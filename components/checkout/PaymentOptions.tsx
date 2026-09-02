'use client';
import { Smartphone, Banknote, Check } from 'lucide-react';

interface PaymentOptionsProps {
  selected: 'ONLINE' | 'COD';
  onChange: (method: 'ONLINE' | 'COD') => void;
  walletBalance: number;
  useWallet: boolean;
  onWalletToggle: (v: boolean) => void;
}

const OPTIONS = [
  { value: 'ONLINE' as const, icon: Smartphone, label: 'Pay Online', desc: 'UPI, Cards, Net Banking via Razorpay' },
  { value: 'COD' as const, icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
];

export default function PaymentOptions({ selected, onChange, walletBalance, useWallet, onWalletToggle }: PaymentOptionsProps) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${selected === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === opt.value ? 'border-primary bg-primary' : 'border-gray-300'}`}>
            {selected === opt.value && <Check size={12} className="text-white" />}
          </div>
          <opt.icon size={18} className={selected === opt.value ? 'text-primary' : 'text-muted'} />
          <div>
            <p className="text-sm font-semibold">{opt.label}</p>
            <p className="text-xs text-muted">{opt.desc}</p>
          </div>
        </button>
      ))}

      {/* Wallet */}
      {walletBalance > 0 && (
        <div
          onClick={() => onWalletToggle(!useWallet)}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${useWallet ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">💳</span>
            <div>
              <p className="text-sm font-semibold">Use Wallet Balance</p>
              <p className="text-xs text-muted">Available: ₹{walletBalance.toFixed(2)}</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${useWallet ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
            {useWallet && <Check size={12} className="text-white" />}
          </div>
        </div>
      )}
    </div>
  );
}
