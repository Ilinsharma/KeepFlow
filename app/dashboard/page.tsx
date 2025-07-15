'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/ui/SideBar';
import Topbar from '@/components/ui/Topbar';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Client {
  id: number;
  name: string;
  monthlyFee?: number;
  roas?: number;
  cpl?: number;
  ctr?: number;
}

interface Report {
  id: number;
  client_id: number;
  created_at: string;
  status?: string;
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: clientData } = await supabase.from('clients').select('*');
      const { data: reportData } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      setClients(clientData || []);
      setReports(reportData || []);
    }

    async function fetchSuggestion() {
      const { choices } = await fetch('/api/gpt-suggestion', { method: 'POST' }).then(res => res.json());
      setSuggestion(choices?.[0]?.message?.content || '');
    }

    fetchData();
    fetchSuggestion();
  }, []);

  const totalClients = clients.length;
  const mrr = clients.reduce((acc, c) => acc + (c.monthlyFee || 0), 0);
  const avgRoas = clients.reduce((acc, c) => acc + (c.roas || 0), 0) / totalClients || 0;
  const avgCpl = clients.reduce((acc, c) => acc + (c.cpl || 0), 0) / totalClients || 0;
  const retention = '91%';
  const reportCount = reports.length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-card to-[#0a0a23] text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 px-6 py-12 space-y-12 relative">
          {/* ✨ Greeting */}
          <h1 className="text-3xl font-bold text-cardForeground">Welcome back, Ilin 👋</h1>

          {/* 📊 Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Active Clients" value={totalClients} trend="+12%" />
            <StatCard title="MRR" value={`$${mrr.toLocaleString()}`} trend="+5%" />
            <StatCard title="Avg. ROAS" value={avgRoas.toFixed(2)} trend="↓2%" />
            <StatCard title="Avg. CPL" value={`$${avgCpl.toFixed(2)}`} trend="↑3%" />
            <StatCard title="Reports Generated" value={reportCount} trend="+18%" />
          </section>

          {/* 💡 Smart Suggestions */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[rgba(255,255,255,0.05)] border border-border backdrop-blur-md p-6 rounded-xl shadow flex flex-col gap-4 max-w-3xl"
          >
            <p className="text-sm text-mutedForeground">💡 GPT Suggestion</p>
            <p className="text-cardForeground font-medium">{suggestion}</p>
            <div className="flex gap-3 mt-2">
              <button className="text-xs px-3 py-1 rounded bg-muted hover:bg-muted/70 transition">👍 Helpful</button>
              <button className="text-xs px-3 py-1 rounded bg-muted hover:bg-muted/70 transition">👎 Not Helpful</button>
              <button className="text-xs px-3 py-1 rounded bg-muted hover:bg-muted/70 transition">⏳ Remind Later</button>
            </div>
          </motion.section>

          {/* 📄 Reports Table */}
          <section className="bg-card border border-border rounded-xl shadow p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-cardForeground mb-4">Recent Reports</h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-mutedForeground">
                  <th className="py-2 px-3">Client</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">ROAS</th>
                  <th className="py-2 px-3">CPL</th>
                  <th className="py-2 px-3">CTR</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map(report => {
                  const client = clients.find(c => c.id === report.client_id);
                  return (
                    <tr key={report.id} className="border-t border-border hover:bg-muted/10 transition">
                      <td className="py-2 px-3">{client?.name || '—'}</td>
                      <td className="py-2 px-3">{new Date(report.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-3">{client?.roas ?? '—'}</td>
                      <td className="py-2 px-3">{client?.cpl ?? '—'}</td>
                      <td className="py-2 px-3">{client?.ctr ?? '—'}</td>
                      <td className="py-2 px-3">{report.status ?? 'Sent'}</td>
                      <td className="py-2 px-3 flex gap-2">
                        <button className="text-xs text-ring">View</button>
                        <button className="text-xs text-zinc-400">Compare</button>
                        <button className="text-xs text-red-500">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </main>

        {/* ➕ Generate Report CTA */}
        <button
          onClick={() => router.push('/reports/create')}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 py-3 text-sm font-semibold rounded-full shadow-lg hover:scale-105 transition z-50"
        >
          + Generate Report
        </button>
      </div>
    </div>
  );
}

// 📦 StatCard component inline for now
function StatCard({ title, value, trend }: { title: string; value: string | number; trend: string }) {
  const trendColor = trend.includes('↑') || trend.includes('+') ? 'text-green-500' : 'text-red-500';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[rgba(255,255,255,0.05)] border border-border backdrop-blur-md rounded-xl p-5 shadow-sm"
    >
      <h3 className="text-sm text-mutedForeground font-medium">{title}</h3>
      <p className="text-2xl font-bold text-cardForeground mt-1">{value}</p>
      <p className={`text-xs mt-1 font-medium ${trendColor}`}>{trend}</p>
    </motion.div>
  );
}