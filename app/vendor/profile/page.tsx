'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const BUSINESS_TYPES = ['Manufacturer', 'Distributor', 'Retailer', 'Wholesaler'];

const EMPTY = {
  businessName: '', businessType: 'Retailer', gstin: '', pan: '',
  address: '', city: 'Gwalior', pincode: '', phone: '', email: '',
  bankName: '', accountNumber: '', ifsc: '', description: '',
};

export default function VendorProfilePage() {
  const { accessToken, user } = useAuthStore();
  const [vendor, setVendor] = useState<null | { status: string }>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/vendor/register', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json() as Promise<{ vendor: typeof vendor & typeof EMPTY | null }>)
      .then(({ vendor: v }) => {
        if (v) { setVendor(v); setForm({ ...EMPTY, ...v }); }
      }).finally(() => setLoading(false));
  }, [accessToken]);

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.businessName || !form.phone || !form.email || !form.address || !form.pincode) {
      toast.error('Fill all required fields'); return;
    }
    setSaving(true);
    try {
      const method = vendor ? 'PATCH' : 'POST';
      const url = vendor ? '/api/vendor/profile' : '/api/vendor/register';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success(data.message ?? (vendor ? 'Profile updated!' : 'Registration submitted!'));
      if (!vendor) setVendor({ status: 'PENDING' });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>;

  const inp = 'w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary placeholder-gray-600';
  const lbl = 'block text-xs text-gray-400 mb-1 font-medium';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">{vendor ? 'Vendor Profile' : 'Register as Vendor'}</h1>
        <p className="text-gray-400 text-sm mt-1">{vendor ? 'Update your business information' : 'Fill in your business details to start selling on Build Edge'}</p>
      </div>

      {/* Business Info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Business Information</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={lbl}>Business Name *</label>
            <input value={form.businessName} onChange={f('businessName')} placeholder="e.g. Sharma Building Materials" className={inp} />
          </div>
          <div>
            <label className={lbl}>Business Type *</label>
            <select value={form.businessType} onChange={f('businessType')} className={inp}>
              {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>GSTIN</label>
            <input value={form.gstin} onChange={f('gstin')} placeholder="27XXXXX..." className={inp} />
          </div>
          <div>
            <label className={lbl}>PAN</label>
            <input value={form.pan} onChange={f('pan')} placeholder="XXXXX1234X" className={inp} />
          </div>
          <div>
            <label className={lbl}>Business Phone *</label>
            <input value={form.phone} onChange={f('phone')} placeholder="9876543210" className={inp} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Business Email *</label>
            <input value={form.email} onChange={f('email')} type="email" placeholder="business@example.com" className={inp} />
          </div>
          <div className="col-span-2">
            <label className={lbl}>Description</label>
            <textarea value={form.description} onChange={f('description')} rows={2} placeholder="Tell us about your business..." className={`${inp} resize-none`} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Business Address</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={lbl}>Address *</label>
            <input value={form.address} onChange={f('address')} placeholder="Shop/Warehouse address" className={inp} />
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
        <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Bank Details (for payouts)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Bank Name</label>
            <input value={form.bankName} onChange={f('bankName')} placeholder="SBI / HDFC / ICICI" className={inp} />
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
        {saving ? 'Saving...' : vendor ? 'Update Profile' : 'Submit Registration'}
      </button>
    </div>
  );
}
