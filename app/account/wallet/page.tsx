'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Wallet, ArrowUp, ArrowDown, Loader2, Info } from 'lucide-react';

interface WalletTx {
  id: string; amount: number; type: 'CREDIT' | 'DEBIT';
  note: string | null; orderId: string | null; createdAt: string;
}
interface WalletData { id: string; balance: number; transactions: WalletTx[]; }

export default function WalletPage() {
  const { accessToken } = useAuthStore();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/wallet', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json() as Promise<{ wallet: WalletData }>)
      .then(({ wallet }) => setWallet(wallet))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-secondary mb-6">Wallet & Cashback</h1>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Balance card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-6 text-white mb-6">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={18} />
                <span className="text-sm font-medium opacity-90">Build Edge Wallet</span>
              </div>
              <p className="text-4xl font-bold mt-2">₹{(wallet?.balance ?? 0).toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">Available balance</p>
            </div>
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-white/5 rounded-full" />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-xl mb-6 text-sm">
            <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-muted">
              Earn <strong className="text-secondary">1% cashback</strong> on every paid order. Wallet balance can be used to pay for your next order at checkout.
            </p>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-secondary">Transaction History</h2>
            </div>
            {!wallet?.transactions?.length ? (
              <div className="p-8 text-center">
                <Wallet size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-muted text-sm">No transactions yet</p>
                <p className="text-xs text-muted mt-1">Start shopping to earn cashback!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {wallet.transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.type === 'CREDIT'
                          ? <ArrowDown size={16} className="text-green-600" />
                          : <ArrowUp size={16} className="text-red-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary">{tx.note ?? (tx.type === 'CREDIT' ? 'Cashback credited' : 'Amount debited')}</p>
                        <p className="text-xs text-muted">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
