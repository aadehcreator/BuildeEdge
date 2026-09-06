'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Save, ShieldAlert, UserCheck, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const BUSINESS_TYPES = ['Manufacturer', 'Distributor', 'Retailer', 'Wholesaler'];

const EMPTY = {
  businessName: '', businessType: 'Retailer', gstin: '', pan: '',
  address: '', city: 'Gwalior', pincode: '474001', phone: '', email: '',
  bankName: '', accountNumber: '', ifsc: '', description: '',
};

export default function VendorProfilePage() {
  const router = useRouter();
  const { accessToken, user, setAuth } = useAuthStore();
  const [vendor, setVendor] = useState<null | { status: string; [key: string]: any }>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const loadVendorProfile = useCallback(async (token?: string) => {
    const activeToken = token || accessToken;
    if (!activeToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/profile', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json() as { vendor?: any; error?: string };
      if (data?.vendor) {
        setVendor(data.vendor);
        setForm((prev) => ({ ...prev, ...data.vendor }));
      } else if (user) {
        setForm((prev) => ({
          ...prev,
          phone: prev.phone || user.phone || '',
          email: prev.email || user.email || '',
        }));
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [accessToken, user]);

  useEffect(() => {
    loadVendorProfile();
  }, [loadVendorProfile]);

  const handleVendorQuickLogin = async () => {
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '9111111111', otp: '123456' }),
      });
      const data = await res.json();
      if (!res.ok || !data.accessToken) {
        throw new Error(data.error ?? 'Login failed');
      }
      setAuth(data.user, data.accessToken, data.refreshToken);
      document.cookie = `token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      toast.success('🏢 Logged in as Vendor successfully!');
      await loadVendorProfile(data.accessToken);
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleFillSample = () => {
    setForm({
      businessName: 'Sharma Building Materials & Supplier',
      businessType: 'Retailer',
      gstin: '23AABCU9603R1ZM',
      pan: 'ABCDE1234F',
      address: 'Shop 14, Near Padav Bridge, Gwalior',
      city: 'Gwalior',
      pincode: '474001',
      phone: '9111111111',
      email: 'sharma.materials@buildedge.in',
      bankName: 'State Bank of India',
      accountNumber: '39485720194',
      ifsc: 'SBIN0001234',
      description: 'सप्लायर: चंबल की रेता, अव्वल लाल ईंटें, अल्ट्राटेक सीमेंट, और नीली गिट्टी।',
    });
    toast.success('Sample vendor details filled!');
  };

  const handleSubmit = async () => {
    if (!form.businessName || !form.phone || !form.address) {
      toast.error('दुकान का नाम, मोबाइल नंबर और पता अनिवार्य हैं। (Fill required fields)');
      return;
    }

    setSaving(true);
    try {
      const method = vendor ? 'PATCH' : 'POST';
      const url = vendor ? '/api/vendor/profile' : '/api/vendor/register';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json() as {
        success?: boolean;
        message?: string;
        error?: string;
        vendor?: any;
        user?: any;
        accessToken?: string;
        refreshToken?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? 'रजिस्ट्रेशन असफल रहा, कृपया दोबारा प्रयास करें');
      }

      // If new tokens returned from registration, activate session immediately
      if (data.accessToken && data.user) {
        setAuth(data.user, data.accessToken, data.refreshToken || '');
        document.cookie = `token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      }

      toast.success(data.message ?? (vendor ? 'Profile updated!' : 'वेंडर रजिस्ट्रेशन सफल!'));
      if (data.vendor) {
        setVendor(data.vendor);
      } else if (!vendor) {
        setVendor({ status: 'APPROVED', ...form });
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>;

  const inp = 'w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary placeholder-gray-600';
  const lbl = 'block text-xs text-gray-400 mb-1 font-medium';

  return (
    <div className="max-w-2xl space-y-6">
      {/* If Not Logged In, Show Informational Banner with 1-Click Login */}
      {!accessToken && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="text-amber-400 flex-shrink-0 mt-0.5" size={22} />
            <div>
              <p className="text-sm font-semibold text-amber-200">
                वेंडर रजिस्ट्रेशन / लॉगिन (Vendor Registration)
              </p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                आप नीचे दिए गए फॉर्म को भरकर सीधे रजिस्टर कर सकते हैं, या 1-क्लिक टेस्ट वेंडर लॉगिन कर सकते हैं।
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleVendorQuickLogin}
              disabled={loggingIn}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              {loggingIn ? <Loader2 size={14} className="animate-spin" /> : <Store size={14} />}
              1-Click Vendor Login (Sharma Building Materials)
            </button>
            <button
              onClick={handleFillSample}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              ⚡ टेस्ट वेंडर डिटेल्स भरें (Auto-Fill Sample Details)
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">{vendor ? 'Vendor Profile' : 'Register as Vendor'}</h1>
          <p className="text-gray-400 text-sm mt-1">{vendor ? 'Update your business information' : 'Fill in your business details to start selling on Build Edge'}</p>
        </div>
        {!vendor && (
          <button
            onClick={handleFillSample}
            type="button"
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-primary border border-primary/40 text-xs font-semibold rounded-lg transition-colors"
          >
            ⚡ Auto-Fill Sample Info
          </button>
        )}
      </div>

      {/* Business Info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Business Information</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={lbl}>Business / Shop Name *</label>
            <input value={form.businessName} onChange={f('businessName')} placeholder="e.g. Sharma Building Materials" className={inp} />
          </div>
          <div>
            <label className={lbl}>Business Type *</label>
            <select value={form.businessType} onChange={f('businessType')} className={inp}>
              {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>GSTIN (Optional)</label>
            <input value={form.gstin} onChange={f('gstin')} placeholder="23ABCDE1234F1Z5" className={inp} />
          </div>
          <div>
            <label className={lbl}>PAN (Optional)</label>
            <input value={form.pan} onChange={f('pan')} placeholder="ABCDE1234F" className={inp} />
          </div>
          <div>
            <label className={lbl}>Business Phone *</label>
            <input value={form.phone} onChange={f('phone')} placeholder="9876543210" className={inp} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Business Email</label>
            <input value={form.email} onChange={f('email')} type="email" placeholder="business@example.com" className={inp} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Description</label>
            <textarea value={form.description} onChange={f('description')} rows={2} placeholder="Tell us about your materials, cement brands, sand/aggregate supply..." className={`${inp} resize-none`} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Business Address (दुकान / गोदाम का पता)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={lbl}>Address *</label>
            <input value={form.address} onChange={f('address')} placeholder="Shop/Warehouse address, Padav / Transport Nagar" className={inp} />
          </div>
          <div>
            <label className={lbl}>City *</label>
            <input value={form.city} onChange={f('city')} className={inp} />
          </div>
          <div>
            <label className={lbl}>Pincode *</label>
            <input value={form.pincode} onChange={f('pincode')} maxLength={6} placeholder="474001" className={inp} />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Bank Details (फंड ट्रांसफर / पेआउट के लिए)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Bank Name</label>
            <input value={form.bankName} onChange={f('bankName')} placeholder="SBI / HDFC / PNB" className={inp} />
          </div>
          <div>
            <label className={lbl}>IFSC Code</label>
            <input value={form.ifsc} onChange={f('ifsc')} placeholder="SBIN0001234" className={inp} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Account Number</label>
            <input value={form.accountNumber} onChange={f('accountNumber')} placeholder="Account number" className={inp} />
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60">
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? 'Saving...' : vendor ? 'Update Profile' : 'Submit Registration / Save Vendor'}
      </button>
    </div>
  );
}
