'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/ui/sidebar';
import Topbar from '@/components/ui/topbar';
import { supabase } from '@/lib/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import {
  EyeIcon,
  FileTextIcon,
  XCircleIcon,
  PlusIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

type Client = {
  id: string;
  name: string;
  niche: string;
  monthlyFee: number;
  monthlySpend: number;
  lastReportDate?: string;
  active?: boolean;
};

export default function ClientsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  useEffect(() => {
    async function fetchClients() {
      const { data } = await supabase.from('clients').select('*');
      setClients(data || []);
    }
    fetchClients();
  }, []);

  const confirmDeleteClient = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('clients').delete().eq('id', deleteTarget.id);
    if (!error) {
      setClients(prev => prev.filter(c => c.id !== deleteTarget.id));
    } else {
      alert('❌ Failed to delete client.');
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-[#141420] to-[#0a0a23] text-foreground font-sans">
      <Sidebar activePath={pathname} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 px-6 py-12 overflow-y-auto relative">
          <div className="max-w-6xl mx-auto space-y-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold text-primary text-center"
            >
              Client Portfolio
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {clients.map((client) => (
                <motion.div
                  key={client.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[rgba(255,255,255,0.05)] border border-border backdrop-blur-md rounded-2xl p-6 shadow-md transition"
                >
                  {/* 🧑 Avatar & Name */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-ring text-white rounded-full text-sm font-semibold">
                        {client.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-cardForeground">{client.name}</h2>
                        <p className="text-xs text-mutedForeground">{client.niche || '—'}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded bg-${client.active ? 'green' : 'red'}-600 text-white`}
                    >
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* 📊 Stats */}
                  <div className="grid grid-cols-3 gap-4 text-xs text-mutedForeground mt-2">
                    <div>
                      <span className="font-semibold text-foreground">ROAS:</span>{' '}
                      {client.monthlyFee && client.monthlySpend
                        ? (client.monthlyFee / client.monthlySpend).toFixed(2)
                        : '—'}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">CPL:</span> —{/* placeholder */}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">CTR:</span> —{/* placeholder */}
                    </div>
                  </div>

                  {/* 📅 Last Report */}
                  <div className="mt-2 text-xs text-mutedForeground">
                    Last Report:{' '}
                    {client.lastReportDate
                      ? `${Math.floor(
                          (Date.now() - new Date(client.lastReportDate).getTime()) / 86400000
                        )} days ago`
                      : 'No reports yet'}
                  </div>

                  {/* ⚙️ Actions */}
                  <div className="flex gap-3 mt-4 text-sm">
                    <button
                      onClick={() => router.push(`/clients/${client.id}`)}
                      className="flex items-center gap-1 text-mutedForeground hover:text-ring transition"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/reports/generate?client=${client.id}`)}
                      className="flex items-center gap-1 text-mutedForeground hover:text-green-500 transition"
                    >
                      <FileTextIcon className="w-4 h-4" />
                      Report
                    </button>
                    <button
                      onClick={() => setDeleteTarget(client)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 🧩 Floating Add Client Button */}
          <button
            onClick={() => router.push('/clients/new')}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:scale-105 transition z-10"
          >
            <PlusIcon className="w-5 h-5" />
          </button>

          {/* ⚠️ Delete Confirmation Modal */}
          {deleteTarget && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-popover text-popoverForeground border border-border rounded-xl shadow-xl p-6 max-w-md mx-auto space-y-4 text-center">
                <h3 className="text-lg font-bold">Confirm Delete</h3>
                <p className="text-sm text-mutedForeground">
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={confirmDeleteClient}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded hover:bg-muted/70 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
