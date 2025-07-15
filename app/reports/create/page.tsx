'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { ReportPDF } from '@/components/ui/ReportPDF';
import Sidebar from '@/components/ui/SideBar';
import Topbar from '@/components/ui/Topbar';

function getCurrentWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const format = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${format(monday)} – ${format(sunday)}`;
}

type Client = {
  id: string;
  name: string;
};

export default function CreateReportPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [niche, setNiche] = useState('');
  const [roas, setRoas] = useState('');
  const [cpl, setCpl] = useState('');
  const [ctr, setCtr] = useState('');
  const [totalSpend, setTotalSpend] = useState('');
  const [previousRoas, setPreviousRoas] = useState('');
  const [previousCpl, setPreviousCpl] = useState('');
  const [previousCtr, setPreviousCtr] = useState('');
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);

  const weekRange = getCurrentWeekRange();

  useEffect(() => {
    async function fetchClients() {
      const { data } = await supabase.from('clients').select('id, name');
      setClients(data || []);
    }
    fetchClients();
  }, []);

  const handleClientSelect = async (clientId: string) => {
    setSelectedClient(clientId);

    const { data: client } = await supabase
      .from('clients')
      .select('niche, roas, cpl, ctr, monthlySpend')
      .eq('id', clientId)
      .single();

    if (client) {
      setNiche(client.niche || '');
      setPreviousRoas(client.roas?.toString() || '');
      setPreviousCpl(client.cpl?.toString() || '');
      setPreviousCtr(client.ctr?.toString() || '');
      setTotalSpend(client.monthlySpend?.toString() || '');
    }
  };

  const generateReport = async () => {
    if (!selectedClient) {
      alert('Please select a client before generating the report.');
      return;
    }

    const hasData =
      niche || roas || cpl || ctr || totalSpend || previousRoas || previousCpl || previousCtr;
    if (!hasData) {
      alert('Please enter at least one metric to generate the report.');
      return;
    }

    setLoading(true);
    const clientName = clients.find(c => c.id === selectedClient)?.name || 'Client';

    const prompt = `
You're an expert marketing strategist speaking like a confident performance coach.

Generate a personalized weekly performance report for a client named ${clientName}, operating in the ${niche} industry, for the date range ${weekRange}.

Metrics for this week are:
- ROAS: ${roas}
- CPL: ${cpl}
- CTR: ${ctr}
- Previous ROAS: ${previousRoas}
- Previous CPL: ${previousCpl}
- Previous CTR: ${previousCtr}

🧾 The report should include 3 sections:

1. **Campaign Performance**  
   - Break down the ad performance using the above metrics.  
   - Mention improvements from last week and frame everything positively.  
   - Always favor the user (agency), even when metrics dip.

2. **Pain Points & Bottlenecks**  
   - Identify potential issues based on trends (e.g., rising CPL, low CTR).  
   - Be insightful and slightly critical, but still supportive.  
   - Keep language fresh across different reports.

3. **Actionable Retention Strategies**  
   - Suggest 3–4 personalized next steps.  
   - Include creative, targeting, or landing page recommendations.  
   - Write like a human expert who deeply understands agency-client relationships.

🎯 Final Touch:  
End the report with a positive, motivating line like:  
“Let’s scale this even further next week!”  
or  
“Another step toward client retention mastery 👊”

Style: Clean, confident, modern. Use clear headers, short paragraphs, and light emojis if helpful.
`;

    const res = await fetch('/api/generate-report', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    const json = await res.json();
    setReportText(json.text || 'Failed to generate.');
    setLoading(false);
  };

  const exportPDF = async () => {
    const clientName = clients.find(c => c.id === selectedClient)?.name || 'Client';
    const blob = await pdf(<ReportPDF clientName={clientName} reportText={reportText} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientName}_KeepFlow_Report.pdf`;
    a.click();
  };

  const saveReport = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    await supabase.from('reports').insert({
      client_id: selectedClient,
      user_id: user.id,
      sent_at: new Date().toISOString(),
      frequency: 'weekly',
      notes: reportText,
    });

    router.push('/dashboard');
  };

  const renderInput = (
    label: string,
    value: string,
    setter: (val: string) => void,
    placeholder?: string
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder || ''}
        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder-mutedForeground focus:outline-none focus:ring-2 focus:ring-ring transition"
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 px-6 py-14 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-primary text-center">Create Client Report</h1>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Select Client</label>
              <select
                value={selectedClient}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full border border-input rounded-md p-2 bg-card text-foreground"
              >
                <option value="">-- Select Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Niche', niche, setNiche, 'e.g. Creative Agency')}
                {renderInput('ROAS (%)', roas, setRoas)}
                {renderInput('CPL ($)', cpl, setCpl)}
                {renderInput('CTR (%)', ctr, setCtr)}
                {renderInput('Total Spend ($)', totalSpend, setTotalSpend)}
                {renderInput('Previous ROAS (%)', previousRoas, setPreviousRoas)}
                {renderInput('Previous CPL ($)', previousCpl, setPreviousCpl)}
                {renderInput('Previous CTR (%)', previousCtr, setPreviousCtr)}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                type="button"
                onClick={generateReport}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow hover:brightness-110 disabled:opacity-50"
              >
                ✨ Generate Report
              </button>
              {reportText && (
                <>
                  <button
                    type="button"
                    onClick={saveReport}
                    className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow hover:brightness-110"
                  >
                    ✅ Save Report
                  </button>
                  <button
                    type="button"
                    onClick={exportPDF}
                    className="px-6 py-2.5 bg-zinc-800 text-white font-semibold rounded-lg shadow hover:brightness-110"
                  >
                    📄 Export PDF
                  </button>
                </>
              )}
            </div>

            {reportText && (
              <section
                id="report-preview"
                className="mt-8 bg-white text-neutral-900 px-6 py-6 rounded-xl shadow-md border border-border text-[16px] leading-relaxed whitespace-pre-wrap"
                style={{
                  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
                  letterSpacing: '0.15px',
                  lineHeight: '1.75rem',
                }}
              >
                {reportText}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

