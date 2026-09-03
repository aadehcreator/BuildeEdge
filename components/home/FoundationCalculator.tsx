// components/home/FoundationCalculator.tsx
'use client';
import React, { useState } from 'react';

export default function FoundationCalculator() {
  const [phase, setPhase] = useState<'Slab' | 'Brickwork'>('Slab');
  const [area, setArea] = useState(1000);
  const [thickness, setThickness] = useState(6);

  const calculate = () => {
    if (phase === 'Slab') {
      const cubicFeet = (area * (thickness / 12));
      const cementBags = Math.ceil(cubicFeet * 0.15); 
      const steelTons = (cubicFeet * 0.005).toFixed(2);
      return { cementBags, steelTons };
    }
    return { cementBags: 0, steelTons: 0 };
  };

  const results = calculate();

  return (
    <div className="bg-[#1A1A1A] p-8 rounded-xl shadow-2xl border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Material Estimator</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={() => setPhase('Slab')} className={`p-4 rounded border ${phase === 'Slab' ? 'bg-[#FFC107] text-[#1A1A1A]' : 'border-gray-700 text-white'}`}>Slab Casting</button>
        <button onClick={() => setPhase('Brickwork')} className={`p-4 rounded border ${phase === 'Brickwork' ? 'bg-[#FFC107] text-[#1A1A1A]' : 'border-gray-700 text-white'}`}>Brickwork</button>
      </div>

      <div className="space-y-4 mb-8">
        <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full p-4 bg-gray-900 text-white rounded border border-gray-700" placeholder="Plot Area (Sq Ft)" />
        <input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full p-4 bg-gray-900 text-white rounded border border-gray-700" placeholder="Slab Thickness (In)" />
      </div>

      <div className="flex justify-between items-center bg-gray-900 p-4 rounded mb-6 text-white">
        <div>Cement: <span className="text-[#FFC107] font-bold">{results.cementBags} Bags</span></div>
        <div>Steel: <span className="text-[#FFC107] font-bold">{results.steelTons} Tons</span></div>
      </div>

      <button className="w-full bg-[#FFC107] text-[#1A1A1A] font-bold py-4 rounded hover:bg-yellow-400 transition-colors">
        Add Calculated Material to Cart
      </button>
    </div>
  );
}
