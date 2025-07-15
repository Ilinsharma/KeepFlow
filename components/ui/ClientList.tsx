'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type Client = {
  id: string;
  name: string;
  monthlyFee: number;
  monthlySpend: number;
  inserted_at: string;
  user_id: string;
};

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('inserted_at', { ascending: false });

    setClients(data || []);
  }

  async function handleDelete(client: Client) {
    // 📦 Archive before delete
    const archive = {
      original_client_id: client.id,
      user_id: client.user_id,
      name: client.name,
      monthlyFee: client.monthlyFee,
      monthlySpend: client.monthlySpend,
      inserted_at: client.inserted_at,
    };

    await supabase.from('client_archive').insert(archive);
    await supabase.from('clients').delete().eq('id', client.id);
    await fetchClients();
  }

  if (clients.length === 0) {
    return (
      <div className="text-sm text-mutedForeground text-center py-6">
        No clients found. Add one to get started!
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-cardForeground mb-4">👥 Client Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-card border border-border rounded-xl p-5 shadow hover:shadow-lg transition"
          >
            <h4 className="text-primary text-lg font-bold mb-1">{client.name}</h4>
            <p className="text-sm text-mutedForeground">
              Revenue: <span className="text-cardForeground font-medium">${client.monthlyFee.toLocaleString()}</span>
            </p>
            <p className="text-sm text-mutedForeground">
              Ad Spend: <span className="text-cardForeground font-medium">${client.monthlySpend.toLocaleString()}</span>
            </p>
            <p className="text-xs text-mutedForeground mt-1">
              Added on: {new Date(client.inserted_at).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(client)}
              className="mt-4 text-xs text-red-500 hover:underline"
            >
              🗑 Delete Client
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}