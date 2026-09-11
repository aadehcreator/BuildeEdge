'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Loader2, Building2, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    company: '',
    projectType: 'Commercial Building',
    materials: 'Cement (500+ bags), TMT Steel (10+ tons)',
    siteLocation: '',
    estimatedBudget: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.siteLocation) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      // Simulate API submission
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
      toast.success('B2B Quote Request submitted successfully!');
    } catch {
      toast.error('Failed to submit quote request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10">
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
            <Building2 size={24} />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-secondary">B2B Bulk Request for Quote (RFQ)</h1>
          <p className="text-sm text-muted mt-1">Get special wholesale contractor pricing directly from verified manufacturers & distributors for your construction site.</p>
        </div>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-secondary">Quote Request Received!</h2>
            <p className="text-sm text-muted max-w-md mx-auto">Our B2B wholesale desk will review your requirements and call you within 2 hours with the best negotiated truckload rates.</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary mt-4 inline-block px-6 py-2.5 text-sm">
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Rajesh Sharma"
                  className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., +91 9876543210"
                  className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Company / Firm Name</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g., Sharma Builders & Infra"
                  className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Project Type</label>
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="Commercial Building">Commercial Building</option>
                  <option value="Residential Apartment / Villa">Residential Apartment / Villa</option>
                  <option value="Road / Infrastructure">Road / Infrastructure</option>
                  <option value="Government Contract">Government Contract</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Materials Required & Quantity *</label>
              <textarea
                required
                rows={3}
                value={form.materials}
                onChange={(e) => setForm({ ...form, materials: e.target.value })}
                placeholder="List items, brands, and quantities (e.g., 500 bags UltraTech Cement, 15 Tons Tata Tiscon Steel)"
                className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Site Location / City *</label>
                <input
                  type="text"
                  required
                  value={form.siteLocation}
                  onChange={(e) => setForm({ ...form, siteLocation: e.target.value })}
                  placeholder="e.g., City Center, Gwalior"
                  className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Estimated Budget (Optional)</label>
                <input
                  type="text"
                  value={form.estimatedBudget}
                  onChange={(e) => setForm({ ...form, estimatedBudget: e.target.value })}
                  placeholder="e.g., ₹5,00,000"
                  className="w-full bg-surface border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              <Send size={18} /> Request Wholesale Quotation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
