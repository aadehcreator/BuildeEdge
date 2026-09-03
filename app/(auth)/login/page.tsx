'use client';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import OTPInput from '@/components/auth/OTPInput';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

type Step = 'phone' | 'otp';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const { setAuth } = useAuthStore();
  const { mergeWithServerCart } = useCartStore();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [resendIn, setResendIn] = useState(0);

  const startResendTimer = () => {
    setResendIn(30);
    const id = setInterval(() => setResendIn((v) => { if (v <= 1) { clearInterval(id); return 0; } return v - 1; }), 1000);
  };

  const sendOTP = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json() as { success?: boolean; message?: string; devOtp?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to send OTP');
      toast.success(`OTP sent to +91 ${phone}`);
      if (data.devOtp) { setDevOtp(data.devOtp); toast(`🔧 Dev OTP: ${data.devOtp}`, { duration: 10000 }); }
      setStep('otp');
      startResendTimer();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json() as { success?: boolean; user?: Parameters<typeof setAuth>[0]; accessToken?: string; refreshToken?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Invalid OTP');
      document.cookie = `token=${data.accessToken}; path=/; max-age=86400`;
      setAuth(data.user!, data.accessToken!, data.refreshToken!);

      // Merge local cart with server cart
      try {
        const cartRes = await fetch('/api/cart', { headers: { Authorization: `Bearer ${data.accessToken}` } });
        const cartData = await cartRes.json() as { items?: { product: Parameters<typeof mergeWithServerCart>[0][0]['product']; quantity: number }[] };
        if (cartData.items) mergeWithServerCart(cartData.items);
      } catch { /* silent */ }

      toast.success('Welcome to Build Edge! 🎉');
      router.push(redirect);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-secondary">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">BE</div>
            Build Edge
          </Link>
          <p className="text-sm text-muted mt-2">Gwalior&apos;s fastest construction store</p>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {step === 'phone' ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone size={16} className="text-primary" />
                </div>
                <h1 className="font-heading font-bold text-xl">Login / Sign Up</h1>
              </div>
              <p className="text-sm text-muted mb-6">Enter your mobile number to continue</p>

              <div className="flex gap-2 mb-4">
                <div className="flex items-center px-3 py-3 bg-surface border border-gray-200 rounded-xl text-sm font-medium text-secondary">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
                  placeholder="Enter mobile number"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
              </div>

              <button
                onClick={sendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send OTP</span> <ArrowRight size={16} /></>}
              </button>

              <p className="text-xs text-muted text-center mt-4">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms</Link> &amp;{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { setStep('phone'); setOtp(''); }} className="text-sm text-muted hover:text-primary mb-4 flex items-center gap-1">
                ← Change number
              </button>
              <h1 className="font-heading font-bold text-xl mb-1">Verify OTP</h1>
              <p className="text-sm text-muted mb-6">
                Enter the 6-digit OTP sent to <strong>+91 {phone}</strong>
              </p>

              <OTPInput value={otp} onChange={setOtp} disabled={loading} />

              {devOtp && (
                <p className="text-xs text-center text-muted mt-2">🔧 Dev: <span className="font-mono font-bold text-primary">{devOtp}</span></p>
              )}

              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 mt-5"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
              </button>

              <div className="text-center mt-4">
                {resendIn > 0 ? (
                  <p className="text-xs text-muted">Resend OTP in <strong>{resendIn}s</strong></p>
                ) : (
                  <button onClick={sendOTP} className="text-sm text-primary font-semibold hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface"><Loader2 size={32} className="animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
