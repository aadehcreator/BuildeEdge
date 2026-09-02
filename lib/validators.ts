import { z } from 'zod';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const SendOTPSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

export const VerifyOTPSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// ── Address ───────────────────────────────────────────────────────────────────
export const AddressSchema = z.object({
  label: z.enum(['Home', 'Site', 'Office', 'Other']),
  line1: z.string().min(5, 'Address is too short'),
  line2: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  city: z.string().min(2),
  lat: z.number().optional(),
  lng: z.number().optional(),
  isDefault: z.boolean().optional(),
});

// ── Cart ──────────────────────────────────────────────────────────────────────
export const AddToCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(999),
});

export const UpdateCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(0).max(999),
});

// ── Order ─────────────────────────────────────────────────────────────────────
export const CreateOrderSchema = z.object({
  addressId: z.string().cuid(),
  paymentMethod: z.enum(['ONLINE', 'COD']),
  useWallet: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

// ── Payment ───────────────────────────────────────────────────────────────────
export const PaymentCreateSchema = z.object({
  orderId: z.string().cuid(),
});

export const PaymentVerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string().cuid(),
});

// ── Products (admin) ──────────────────────────────────────────────────────────
export const BulkPriceSchema = z.object({
  minQty: z.number().int().min(1),
  price: z.number().positive(),
});

export const ProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  brandId: z.string().cuid().optional(),
  images: z.array(z.string().url()).min(1),
  mrp: z.number().positive(),
  sellingPrice: z.number().positive(),
  bulkPrices: z.array(BulkPriceSchema).optional(),
  unit: z.string().min(1),
  sku: z.string().min(1),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().optional(),
  isNewLaunch: z.boolean().optional(),
  cashbackPercent: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// ── Category (admin) ──────────────────────────────────────────────────────────
export const CategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  image: z.string().url(),
  parentId: z.string().cuid().optional(),
  sortOrder: z.number().int().optional(),
});

// ── Banner (admin) ────────────────────────────────────────────────────────────
export const BannerSchema = z.object({
  image: z.string().url(),
  link: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// ── Newsletter ────────────────────────────────────────────────────────────────
export const NewsletterSchema = z.object({
  email: z.string().email(),
});

// ── Order status (admin) ──────────────────────────────────────────────────────
export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PLACED', 'CONFIRMED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
});

export type SendOTPInput = z.infer<typeof SendOTPSchema>;
export type VerifyOTPInput = z.infer<typeof VerifyOTPSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
