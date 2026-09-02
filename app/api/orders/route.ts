import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateOrderSchema } from '@/lib/validators';

const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 500;

function getBulkPrice(sellingPrice: number, bulkPrices: unknown, qty: number): number {
  if (!Array.isArray(bulkPrices) || bulkPrices.length === 0) return sellingPrice;
  const sorted = [...bulkPrices].sort((a: {minQty:number}, b: {minQty:number}) => b.minQty - a.minQty);
  const tier = sorted.find((t: {minQty:number; price:number}) => qty >= t.minQty);
  return tier ? tier.price : sellingPrice;
}

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(20, Number(searchParams.get('limit') ?? 10));

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.userId },
        include: { items: { select: { productName: true, productImage: true, quantity: true, price: true, unit: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where: { userId: user.userId } }),
    ]);

    return NextResponse.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { addressId, paymentMethod, useWallet, notes } = parsed.data;

    // Verify address belongs to user
    const address = await prisma.address.findFirst({ where: { id: addressId, userId: user.userId } });
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, mrp: true, sellingPrice: true, unit: true, stock: true, bulkPrices: true } },
          },
        },
      },
    });

    if (!cart?.items.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      if (item.product.stock < item.quantity) throw new Error(`Insufficient stock for ${item.product.name}`);
      const price = getBulkPrice(item.product.sellingPrice, item.product.bulkPrices, item.quantity);
      subtotal += price * item.quantity;
      return {
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] ?? '',
        quantity: item.quantity,
        mrp: item.product.mrp,
        price,
        unit: item.product.unit,
      };
    });

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const cashbackAmount = subtotal * 0.01; // 1%

    // Apply wallet balance
    let walletDeduction = 0;
    if (useWallet) {
      const wallet = await prisma.wallet.findUnique({ where: { userId: user.userId } });
      if (wallet) {
        walletDeduction = Math.min(wallet.balance, subtotal + deliveryFee);
      }
    }

    const total = subtotal + deliveryFee - walletDeduction;

    const addressSnapshot = {
      label: address.label, line1: address.line1, line2: address.line2,
      pincode: address.pincode, city: address.city,
    };

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          status: 'PLACED',
          addressSnapshot,
          subtotal,
          deliveryFee,
          discount: walletDeduction,
          cashback: cashbackAmount,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          notes,
          estimatedAt: new Date(Date.now() + 60 * 60 * 1000), // +1 hour
          items: { create: orderItems },
        },
      });

      // Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Deduct from wallet
      if (walletDeduction > 0) {
        const wallet = await tx.wallet.findUnique({ where: { userId: user.userId } });
        if (wallet) {
          await tx.wallet.update({
            where: { userId: user.userId },
            data: { balance: { decrement: walletDeduction } },
          });
          await tx.walletTx.create({
            data: { walletId: wallet.id, amount: walletDeduction, type: 'DEBIT', note: `Used for order ${newOrder.id}`, orderId: newOrder.id },
          });
        }
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id, total: order.total }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message.startsWith('Insufficient stock')) return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('order POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
