import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export interface OrderEmailData {
  to: string;
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number; unit: string }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  address: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity} ${item.unit}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      <div style="background:#E87722;padding:24px 32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">Build Edge</h1>
        <p style="color:rgba(255,255,255,0.9);margin:4px 0 0">Order Confirmed! 🎉</p>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px;color:#333">Hi ${data.customerName},</p>
        <p style="color:#555">Your order <strong>#${data.orderId.slice(-8).toUpperCase()}</strong> has been placed successfully. We'll deliver it in <strong>60 minutes</strong>!</p>
        
        <h3 style="color:#1A1A1A;margin-top:24px">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:10px 8px;text-align:left;font-size:13px;color:#666">Item</th>
              <th style="padding:10px 8px;text-align:center;font-size:13px;color:#666">Qty</th>
              <th style="padding:10px 8px;text-align:right;font-size:13px;color:#666">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        
        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-top:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#666">Subtotal</span><span>₹${data.subtotal.toLocaleString('en-IN')}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#666">Delivery</span><span style="color:#16A34A">${data.deliveryFee === 0 ? 'FREE' : '₹' + data.deliveryFee}</span></div>
          <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:16px;margin-top:8px;padding-top:8px;border-top:1px solid #eee"><span>Total</span><span>₹${data.total.toLocaleString('en-IN')}</span></div>
        </div>
        
        <div style="margin-top:20px;padding:16px;background:#fff8f0;border-radius:8px;border-left:4px solid #E87722">
          <p style="margin:0;color:#555"><strong>Delivery Address:</strong><br>${data.address}</p>
          <p style="margin:8px 0 0;color:#555"><strong>Payment:</strong> ${data.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>
        
        <p style="color:#555;margin-top:24px">Need help? WhatsApp us at <a href="https://wa.me/918109585179" style="color:#E87722">+91 8109585179</a></p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center">
        <p style="color:#999;font-size:12px;margin:0">© 2024 Build Edge · Gwalior · Open 8 AM – 8 PM</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Build Edge" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: `Order Confirmed #${data.orderId.slice(-8).toUpperCase()} — Build Edge`,
    html,
  });
}
