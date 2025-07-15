'use client';

import { useState } from 'react';

export default function FunnelPage() {
  const [impressions, setImpressions] = useState(100000);
  const [clicks, setClicks] = useState(1000);
  const [leads, setLeads] = useState(100);
  const [purchases, setPurchases] = useState(20);

  const ctr = (clicks / impressions) * 100;
  const conversion = (purchases / clicks) * 100;
  const insight = `Your CTR is ${ctr.toFixed(2)}%. Try improving your creatives or targeting.`;

  return (
    <div className="min-h-screen py-10 px-6 bg-gradient-to-tr from-[#0b0e17] to-[#141824] text-white">
      <div className="max-w-3xl mx-auto bg-[#11131b] p-8 rounded-2xl border border-white/10 shadow-glass space-y-6">
        <h1 className="text-3xl font-bold">📉 Funnel Breakdown</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-400">Impressions</label>
            <input type="number" value={impressions} onChange={(e) => setImpressions(+e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Clicks</label>
            <input type="number" value={clicks} onChange={(e) => setClicks(+e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Leads</label>
            <input type="number" value={leads} onChange={(e) => setLeads(+e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Purchases</label>
            <input type="number" value={purchases} onChange={(e) => setPurchases(+e.target.value)} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          {[impressions, clicks, leads, purchases].map((val, i) => (
            <div key={i} className="bg-purple-600 p-4 rounded-lg text-center font-bold">{val}</div>
          ))}
        </div>

        <p className="text-sm text-gradient mt-4">{insight}</p>
      </div>
    </div>
  );
}