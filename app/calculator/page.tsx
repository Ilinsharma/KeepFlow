'use client';

import { useState } from 'react';

export default function CalculatorPage() {
  const [budget, setBudget] = useState(500);
  const [ctr, setCtr] = useState(2.5);
  const [cvRate, setCvRate] = useState(10);
  const [aov, setAov] = useState(100);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const CPM = 10;
  const impressions = (budget / CPM) * 1000;
  const clicks = impressions * (ctr / 100);
  const leads = clicks * (cvRate / 100);
  const cpl = leads > 0 ? budget / leads : 0;
  const revenue = leads * aov;
  const roas = budget > 0 ? revenue / budget : 0;

  const handleGPT = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, ctr, leads, cpl, roas, aov }),
      });
      const json = await res.json();
      setRecommendation(json.summary);
    } catch {
      setRecommendation('AI insight failed to load.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#090c10] text-white py-12 px-6">
      <div className="max-w-3xl mx-auto bg-[#11131b] backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">🧮 Ad Budget Planner</h1>

        {/* Inputs */}
        <div className="space-y-6">
          {[
            {
              label: 'Campaign Budget ($)',
              value: budget,
              set: setBudget,
              min: 100,
              max: 100000,
              step: 50,
              placeholder: '$',
            },
            {
              label: 'Click-Through Rate (%)',
              value: ctr,
              set: setCtr,
              min: 0.1,
              max: 20,
              step: 0.1,
              placeholder: '%',
            },
            {
              label: 'Conversion Rate (%)',
              value: cvRate,
              set: setCvRate,
              min: 1,
              max: 50,
              step: 1,
              placeholder: '%',
            },
            {
              label: 'Avg. Order Value ($)',
              value: aov,
              set: setAov,
              min: 10,
              max: 2000,
              step: 10,
              placeholder: '$',
            },
          ].map((item) => (
            <div key={item.label}>
              <label className="block text-sm text-gray-400 mb-1">
                {item.label} <span className="text-white font-semibold">→ {item.value}{item.placeholder}</span>
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={item.value}
                  onChange={(e) => item.set(+e.target.value)}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => item.set(+e.target.value)}
                  className="w-24 p-2 bg-white/10 rounded text-right"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Impressions', value: Math.round(impressions).toLocaleString() },
            { label: 'Clicks', value: Math.round(clicks).toLocaleString() },
            { label: 'Leads', value: Math.round(leads).toLocaleString() },
            { label: 'Cost/Lead', value: leads > 0 ? `$${Math.round(cpl)}` : '$0' },
          ].map((metric) => (
            <div key={metric.label} className="bg-gradient-to-r from-purple-600 to-indigo-800 p-4 rounded-xl text-center shadow-inner space-y-1">
              <p className="text-sm text-white/70">{metric.label}</p>
              <p className="text-lg font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* ROAS */}
        <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
          <p className="text-sm text-white/60 mb-1">📈 ROAS</p>
          <p className="text-2xl font-bold text-white">{roas.toFixed(2)}x</p>
        </div>

        {/* GPT Button */}
        <button
          onClick={handleGPT}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-700 rounded font-semibold hover:opacity-90 transition duration-300"
        >
          {loading ? '🔄 Generating Insight...' : '🔮 Get AI Recommendation'}
        </button>

        {/* GPT Output */}
        {recommendation && (
          <div className="mt-6 bg-purple-950/60 border border-white/20 p-4 rounded-xl text-sm animate-in fade-in duration-300">
            {recommendation}
          </div>
        )}
      </div>
    </div>
  );
}