'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewClientPage() {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [monthlySpend, setMonthlySpend] = useState('');
  const [roas, setRoas] = useState('');
  const [cpl, setCpl] = useState('');
  const [ctr, setCtr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (name.trim().length < 2) {
      alert('Client name is too short.');
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert('Authentication error.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('clients').insert({
      name: name.trim(),
      niche: niche.trim(),
      monthlyFee: parseFloat(monthlyFee) || 0,
      monthlySpend: parseFloat(monthlySpend) || 0,
      roas: parseFloat(roas) || null,
      cpl: parseFloat(cpl) || null,
      ctr: parseFloat(ctr) || null,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      alert(`❌ Error adding client:\n${error.message}`);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-background to-card px-6 py-16 text-foreground font-sans">
      <div className="max-w-xl mx-auto bg-card rounded-xl p-8 border border-border shadow-lg">
        <header className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-bold text-cardForeground">Create New Client</h2>
          <p className="text-sm text-mutedForeground">Add real financial data to enrich your dashboard.</p>
        </header>

        <div className="space-y-6">
          <InputBlock label="Client Name" value={name} setter={setName} placeholder="e.g. Phoenix Digital Labs" />
          <InputBlock label="Niche" value={niche} setter={setNiche} placeholder="e.g. Creative Agency" />
          <InputBlock label="Monthly Revenue ($)" value={monthlyFee} setter={setMonthlyFee} placeholder="e.g. 1,800" />
          <InputBlock label="Monthly Ad Spend ($)" value={monthlySpend} setter={setMonthlySpend} placeholder="e.g. 4,000" />
          <InputBlock label="Current ROAS" value={roas} setter={setRoas} placeholder="e.g. 1.8" />
          <InputBlock label="Current CPL" value={cpl} setter={setCpl} placeholder="e.g. 30.25" />
          <InputBlock label="Current CTR (%)" value={ctr} setter={setCtr} placeholder="e.g. 2.3" />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-lg hover:brightness-110 hover:shadow-xl transition disabled:opacity-50"
          >
            ✅ Save Client & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function InputBlock({
  label,
  value,
  setter,
  placeholder,
}: {
  label: string;
  value: string;
  setter: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-cardForeground">{label}</label>
      <input
        className="w-full mt-1 px-3 py-2 text-sm rounded-md bg-transparent border border-input text-cardForeground placeholder-mutedForeground focus:ring-2 focus:ring-ring focus:outline-none transition"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
      />
    </div>
  );
}