import { supabase } from '@/lib/supabase'

export async function getDashboardMetrics() {
  const { data: clients } = await supabase.from('clients').select('*')
  const { data: reports } = await supabase.from('client_reports').select('*')

  return {
    totalClients: clients?.length || 0,
    reportsThisWeek: reports?.filter(r => isThisWeek(r.date_sent)).length || 0,
    avgROAS: calcAvgROAS(reports),
    pendingReports: getPendingReports(clients, reports),
  }
}