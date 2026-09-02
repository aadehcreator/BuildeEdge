'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Trash2, Star, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface Address {
  id: string; label: string; line1: string; line2?: string | null;
  city: string; pincode: string; isDefault: boolean;
}

const LABELS = ['Home', 'Site', 'Office', 'Other'];

export default function AddressesPage() {
  const { accessToken } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: 'Home', line1: '', line2: '', pincode: '', city: 'Gwalior' });

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/account/addresses', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json() as { addresses: Address[] };
      setAddresses(data.addresses ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, [accessToken]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/account/addresses?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await fetch('/api/account/addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ id, isDefault: true }),
      });
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleSave = async () => {
    if (!form.line1.trim() || !form.pincode.trim()) {
      toast.error('Fill in required fields'); return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? 'Failed');
      }
      await fetchAddresses();
      setAddingNew(false);
      setForm({ label: 'Home', line1: '', line2: '', pincode: '', city: 'Gwalior' });
      toast.success('Address saved!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-secondary">My Addresses</h1>
        <button
          onClick={() => setAddingNew((v) => !v)}
          className="flex items-center gap-1.5 btn-primary text-sm"
        >
          <Plus size={14} /> Add Address
        </button>
      </div>

      {/* Add new form */}
      <AnimatePresence>
        {addingNew && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-white rounded-2xl border-2 border-primary/30 p-5 space-y-3">
              <h2 className="font-semibold text-secondary">New Address</h2>
              <div className="flex gap-2 flex-wrap">
                {LABELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setForm((f) => ({ ...f, label: l }))}
                    className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${
                      form.label === l ? 'bg-primary text-white border-primary' : 'border-gray-300 text-muted hover:border-primary'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <input
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                placeholder="Address line 1 *"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                value={form.line2}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                placeholder="Landmark / Area"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="Pincode *"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="City"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Address
                </button>
                <button onClick={() => setAddingNew(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address list */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-secondary">No addresses saved</p>
          <p className="text-sm text-muted mt-1">Add a delivery address to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-2xl border-2 p-4 ${addr.isDefault ? 'border-primary/30' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-secondary">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-secondary mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                    <p className="text-xs text-muted">{addr.city} – {addr.pincode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      title="Set as default"
                      className="p-2 rounded-lg hover:bg-orange-50 text-muted hover:text-primary transition-colors"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
