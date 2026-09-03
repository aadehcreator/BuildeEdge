'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Package, TrendingUp, Users, ShieldCheck, Zap, Star } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const PERKS = [
  { icon: TrendingUp, title: 'Grow Your Business', desc: 'Reach thousands of contractors and builders in Gwalior with zero marketing cost.' },
  { icon: Zap, title: '60-Min Logistics', desc: 'We handle last-mile delivery — you just pack and hand over.' },
  { icon: Package, title: 'IMS Built-in', desc: 'Real-time inventory tracking, low-stock alerts, and stock adjustment — all free.' },
  { icon: ShieldCheck, title: 'Secure Payouts', desc: 'Weekly bank transfers. Track every rupee earned via your vendor dashboard.' },
  { icon: Users, title: 'Dedicated Support', desc: 'WhatsApp support from our vendor team. We grow together.' },
  { icon: Star, title: 'Top Brands Welcome', desc: 'List Asian Paints, Fevicol, Bosch, Hettich, and more on our platform.' },
];

const STEPS = [
  { step: '01', title: 'Register', desc: 'Fill your business details — takes 5 minutes.' },
  { step: '02', title: 'Get Approved', desc: 'Our team reviews your application in 24–48 hours.' },
  { step: '03', title: 'Add Products', desc: 'List your products with photos, prices, and stock.' },
  { step: '04', title: 'Start Earning', desc: 'Orders flow in — we deliver, you earn every week.' },
];

export default function BecomeVendorPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleStart = () => {
    if (!user) { router.push('/login?redirect=/vendor/profile'); return; }
    router.push('/vendor/profile');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero */}
      <motion.section
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          Vendor Partner Program
        </span>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-secondary mb-4 leading-tight">
          Sell Construction Materials<br />on Build Edge
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto mb-8">
          Join Gwalior&apos;s fastest-growing construction platform. Zero setup cost. Real-time inventory. Weekly payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleStart}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-dark transition-colors"
          >
            Start Selling <ArrowRight size={20} />
          </button>
          <Link href="https://wa.me/918109585179" target="_blank"
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-secondary text-secondary font-bold rounded-2xl hover:bg-secondary hover:text-white transition-colors">
            📞 Talk to Us
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { value: '60 Min', label: 'Delivery SLA' },
          { value: '1%', label: 'Commission (lowest)' },
          { value: '24h', label: 'Approval Time' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
            <p className="font-heading font-bold text-3xl text-primary">{s.value}</p>
            <p className="text-muted text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Perks */}
      <section>
        <h2 className="font-heading font-bold text-2xl text-secondary text-center mb-8">
          Why Sell on Build Edge?
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PERKS.map((perk) => (
            <div key={perk.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <perk.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-secondary mb-1">{perk.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-heading font-bold text-2xl text-secondary text-center mb-8">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="font-semibold text-secondary mb-1">{s.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 text-gray-300 text-xl">›</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Commission structure */}
      <section className="bg-secondary rounded-2xl p-6 md:p-10 text-white">
        <h2 className="font-heading font-bold text-2xl mb-6 text-center">Commission Structure</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { type: 'Starter', commission: '10%', sales: 'Up to ₹50K/mo', color: 'border-gray-600' },
            { type: 'Growth', commission: '8%', sales: '₹50K – ₹2L/mo', color: 'border-primary', popular: true },
            { type: 'Premium', commission: '5%', sales: 'Above ₹2L/mo', color: 'border-gray-600' },
          ].map((tier) => (
            <div key={tier.type} className={`border-2 ${tier.color} rounded-xl p-5 text-center ${tier.popular ? 'bg-primary/10' : ''}`}>
              {tier.popular && <span className="text-xs text-primary font-bold bg-primary/20 px-2 py-0.5 rounded-full">POPULAR</span>}
              <p className="font-heading font-bold text-xl mt-2">{tier.type}</p>
              <p className="text-4xl font-bold text-primary my-3">{tier.commission}</p>
              <p className="text-gray-400 text-sm">{tier.sales}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs mt-4">
          Commission is auto-deducted from payouts. No hidden fees.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="font-heading font-bold text-2xl text-secondary mb-3">Ready to Start?</h2>
        <p className="text-muted mb-6">Registration is free. Get approved and start selling in 48 hours.</p>
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-dark transition-colors"
        >
          Register as Vendor <ArrowRight size={20} />
        </button>
      </section>
    </div>
  );
}
