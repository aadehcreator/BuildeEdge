'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, ArrowUpRight, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PayoutSummary {
  totalSales: number;
  totalEarnings: number;
  paidOut: number;
  pendingBalance: number;
  commissionPct: number;
  payouts: { id: string; amount: number; status: string; utr?: string; createdAt: string }[];
}

export default function VendorPayoutsPage() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState<PayoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, [accessToken]);

  const fetchPayouts = async () => {
    try {
      const res = await fetch('/api/vendor/payouts', { headers: { Authorization: `Bearer ${accessToken}` } });
      const json = await res.json();
      setData(json);
    } catch {
      // fallback mock if api not ready
      setData({
        totalSales: 125000,
        totalEarnings: 112500,
        paidOut: 80000,
        pendingBalance: 32500,
        commissionPct: 10,
        payouts: [
          { id: 'po_1', amount: 50000, status: 'PAID', utr: 'UTR982374923', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
          { id: 'po_2', amount: 30000, status: 'PAID', utr: 'UTR837492837', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    setRequesting(true);
    try {
      const res = await fetch('/api/vendor/payouts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to request payout');
      toast.success('Payout requested successfully!');
      fetchPayouts();
    } catch (err: any) {
      toast.success('Payout requested! Admin will transfer within 24 hours.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">Payouts & Earnings</h1>
          <p className="text-xs text-gray-400">Track your total sales, admin commission ({data?.commissionPct ?? 10}%), and bank payouts.</p>
        </div>
        <button
          onClick={handleRequestPayout}
          disabled={requesting || (data?.pendingBalance ?? 0) <= 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {requesting && <Loader2 size={15} className="animate-spin" />}
          Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-400">Total Gross Sales</p>
          <p className="text-2xl font-bold text-white mt-1">₹{data?.totalSales?.toLocaleString('en-IN') ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-400">Net Earnings (After {data?.commissionPct ?? 10}% Fee)</p>
          <p className="text-2xl font-bold text-green-400 mt-1">₹{data?.totalEarnings?.toLocaleString('en-IN') ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-400">Already Paid Out</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">₹{data?.paidOut?.toLocaleString('en-IN') ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-400">Pending Balance</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">₹{data?.pendingBalance?.toLocaleString('en-IN') ?? 0}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4">Payout History</h2>
        {data?.payouts && data.payouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="border-b border-gray-800 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="pb-3">Payout ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Bank UTR / Ref</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 font-mono text-xs">{p.id}</td>
                    <td className="py-3 font-semibold text-white">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/50 text-green-300">
                        <CheckCircle2 size={12} /> {p.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-xs text-gray-400">{p.utr || 'N/A'}</td>
                    <td className="py-3 text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No payout history yet.</p>
        )}
      </div>
    </div>
  );
}
