import { isThisWeek } from "date-fns";

import { supabase } from '@/lib/supabase'

// Dummy implementations for missing functions
function isDateInThisWeek(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return date >= startOfWeek && date <= endOfWeek
}

function calcAvgROAS(reports: any[]): number {
  if (!reports || reports.length === 0) return 0
  const total = reports.reduce((sum, r) => sum + (r.roas || 0), 0)
  return total / reports.length
}

function getPendingReports(clients: any[], reports: any[]): number {
  if (!clients || !reports) return 0
  const reportedClientIds = new Set(reports.map(r => r.client_id))
  return clients.filter(c => !reportedClientIds.has(c.id)).length
}

export async function getDashboardMetrics() {
  const { data: clients } = await supabase.from('clients').select('*')
  const { data: reports } = await supabase.from('client_reports').select('*')

  return {
    totalClients: clients?.length || 0,
    reportsThisWeek: reports?.filter(r => isThisWeek(r.date_sent)).length || 0,
    avgROAS: calcAvgROAS(reports ?? []),
    pendingReports: getPendingReports(clients ?? [], reports ?? []),
  }
}