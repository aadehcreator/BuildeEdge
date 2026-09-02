'use client';
import { useState } from 'react';
import { MapPin, Plus, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

interface Address {
  id: string; label: string; line1: string; line2?: string | null;
  city: string; pincode: string; isDefault: boolean;
}

interface AddressPickerProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh: () => void;
}

const LABELS = ['Home', 'Site', 'Office', 'Other'];

export default function AddressPicker({ addresses, selectedId, onSelect, onRefresh }: AddressPickerProps) {
  const { accessToken } = useAuthStore();
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: 'Home', line1: '', line2: '', pincode: '', city: 'Gwalior', isDefault: false });
  const [error, setError] = useState('');

  const saveAddress = async () => {
    if (!form.line1.trim() || !form.pincode.trim()) { setError('Please fill required fields'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error ?? 'Failed'); }
      setAddingNew(false);
      setForm({ label: 'Home', line1: '', line2: '', pincode: '', city: 'Gwalior', isDefault: false });
      onRefresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save address'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <button
          key={addr.id}
          onClick={() => onSelect(addr.id)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${selectedId === addr.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
        >
          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedId === addr.id ? 'border-primary bg-primary' : 'border-gray-300'}`}>
            {selectedId === addr.id && <Check size={12} className="text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-primary" />
              <span className="text-sm font-semibold">{addr.label}</span>
              {addr.isDefault && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Default</span>}
            </div>
            <p className="text-sm text-secondary mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
            <p className="text-xs text-muted">{addr.city} – {addr.pincode}</p>
          </div>
        </button>
      ))}

      {/* Add new address */}
      <button
        onClick={() => setAddingNew((v) => !v)}
        className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add new address
      </button>

      <AnimatePresence>
        {addingNew && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              {/* Label */}
              <div className="flex gap-2">
                {LABELS.map((l) => (
                  <button key={l} onClick={() => setForm((f) => ({ ...f, label: l }))}
                    className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${form.label === l ? 'bg-primary text-white border-primary' : 'border-gray-300 text-muted hover:border-primary'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <input value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                placeholder="Address line 1 *"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
              <input value={form.line2} onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                placeholder="Address line 2 (landmark)"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-2">
                <input value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="Pincode *" maxLength={6}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
                <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="City"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button onClick={saveAddress} disabled={saving}
                className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Address'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
