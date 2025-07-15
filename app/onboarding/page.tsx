'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type ClientPayload = {
  name: string;
  niche: string;
  monthlyFee: string;
  monthlySpend: string;
  roas: string;
  cpl: string;
  ctr: string;
};

export default function OnboardingPage() {
  const [clients, setClients] = useState<ClientPayload[]>([
    {
      name: '',
      niche: '',
      monthlyFee: '',
      monthlySpend: '',
      roas: '',
      cpl: '',
      ctr: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (
    idx: number,
    field: keyof ClientPayload,
    value: string
  ) => {
    setClients(prev =>
      prev.map((client, i) =>
        i === idx ? { ...client, [field]: value } : client
      )
    );
  };

  const addClient = () => {
    setClients([
      ...clients,
      {
        name: '',
        niche: '',
        monthlyFee: '',
        monthlySpend: '',
        roas: '',
        cpl: '',
        ctr: '',
      },
    ]);
  };

  const submitAll = async () => {
    const validClients = clients.filter(c => c.name.trim().length > 1);
    if (validClients.length === 0) {
      alert('🚨 Add at least one valid client.');
      return;
    }

    setLoading(true);
    let errors: string[] = [];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert('❌ Could not get current user.');
      setLoading(false);
      return;
    }

    for (const client of validClients) {
      const { error } = await supabase.from('clients').insert({
        name: client.name.trim(),
        niche: client.niche.trim(),
        monthlyFee: parseFloat(client.monthlyFee) || 0,
        monthlySpend: parseFloat(client.monthlySpend) || 0,
        roas: parseFloat(client.roas) || null,
        cpl: parseFloat(client.cpl) || null,
        ctr: parseFloat(client.ctr) || null,
        user_id: user.id,
      });

      if (error) errors.push(error.message);
    }

    setLoading(false);

    if (errors.length > 0) {
      alert(`❌ Some clients couldn’t be added:\n${errors.join('\n')}`);
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-[#0a0a23] px-6 py-16 text-foreground font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* 🌟 Header */}
        <div className="text-center space-y-3">
          <img src="/keepflow-logo.png" alt="KeepFlow Logo" className="mx-auto w-36 h-36" />
          <p className="text-sm text-mutedForeground">AI-powered client reporting for agencies</p>
        </div>

        <header className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-cardForeground tracking-tight">Add Your Clients</h2>
          <p className="text-sm text-mutedForeground">Let’s start your dashboard with real financial data.</p>
        </header>

        {/* 🔢 Input Blocks */}
        {clients.map((client, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card p-6 rounded-xl shadow-lg border border-border transition-all"
          >
            {[
              { label: 'Client Name', field: 'name', placeholder: 'e.g. KeepFlow Co.' },
              { label: 'Niche', field: 'niche', placeholder: 'e.g. Creative Agency' },
              { label: 'Monthly Revenue ($)', field: 'monthlyFee', placeholder: 'e.g. 1,200' },
              { label: 'Monthly Ad Spend ($)', field: 'monthlySpend', placeholder: 'e.g. 3,500' },
              { label: 'Current ROAS', field: 'roas', placeholder: 'Return on Ad Spend' },
              { label: 'Current CPL ($)', field: 'cpl', placeholder: 'Cost Per Lead' },
              { label: 'Current CTR (%)', field: 'ctr', placeholder: 'Click-Through Rate' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="text-sm font-medium text-cardForeground">{label}</label>
                <input
                  className="w-full mt-1 px-3 py-2 text-sm rounded-md bg-transparent border border-input text-cardForeground placeholder-mutedForeground focus:ring-2 focus:ring-ring focus:outline-none transition"
                  placeholder={placeholder}
                  value={client[field as keyof ClientPayload]}
                  onChange={(e) =>
                    updateField(idx, field as keyof ClientPayload, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        ))}

        {/* 🎯 Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={addClient}
            className="px-5 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg hover:brightness-110 hover:shadow-xl transition"
          >
            ➕ Add Client
          </button>
          <button
            onClick={submitAll}
            disabled={loading}
            className="px-6 py-3 text-sm font-semibold rounded-lg flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg hover:brightness-110 hover:shadow-xl transition disabled:opacity-50"
          >
            ✅ Finish Setup
          </button>
        </div>
      </div>

      {/* 🎉 Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-popover rounded-xl p-6 shadow-2xl text-center max-w-md mx-auto border border-border">
            <h2 className="text-2xl font-bold text-popoverForeground">🎉 Clients Added</h2>
            <p className="text-mutedForeground mt-2">Your dashboard is live.</p>
            <div className="mt-4 text-sm text-mutedForeground">Redirecting...</div>
          </div>
        </div>
      )}
    </div>
  );
}