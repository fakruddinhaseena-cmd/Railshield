import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/dashboard/Layout'

const ALERTS = [
  { id: 'AL001', title: 'Critical: RTU Under Attack', severity: 'critical', asset_name: 'Trackside RTU — Howrah', message: 'Active command injection attack detected. Auto-isolation initiated.', created_at: '8m ago', resolved: false, alert_type: 'attack' },
  { id: 'AL002', title: 'High: Brute Force on OCC', severity: 'high', asset_name: 'OCC Server — Mumbai Central', message: '52 failed auth attempts. Account lockout triggered.', created_at: '1h ago', resolved: false, alert_type: 'auth' },
  { id: 'AL003', title: 'Medium: Kavach Network Anomaly', severity: 'medium', asset_name: 'Kavach ATP Node — Lucknow', message: 'Unusual broadcast traffic on ATP segment. Monitoring.', created_at: '3h ago', resolved: false, alert_type: 'anomaly' },
  { id: 'AL004', title: 'High: Firmware Tamper Blocked', severity: 'high', asset_name: 'Rolling Stock ECU — Rajdhani 12301', message: 'Unauthorized firmware update blocked. Source IP quarantined.', created_at: '6h ago', resolved: true, alert_type: 'firmware' },
  { id: 'AL005', title: 'Info: Compliance Scan Complete', severity: 'info', asset_name: 'Kavach ATP Node — New Delhi', message: 'Scheduled IEC 62443 compliance scan completed. Score: 94%.', created_at: '1d ago', resolved: true, alert_type: 'compliance' },
]

const typeIcon: Record<string, string> = { attack: '⚔', auth: '🔑', anomaly: '◉', firmware: '⚙', compliance: '◎' }

export default function Alerts() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [showResolved, setShowResolved] = useState(false)

  const visible = showResolved ? alerts : alerts.filter(a => !a.resolved)

  return (
    <>
      <Head><title>RailShield — Alerts</title></Head>
      <Layout title="Security Alerts">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[false, true].map(r => (
              <button key={String(r)} onClick={() => setShowResolved(r)}
                className="px-4 py-1.5 rounded-lg text-sm transition-all"
                style={showResolved === r
                  ? { background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                  : { color: '#64748b', border: '1px solid #1e2d45', background: 'transparent' }}>
                {r ? 'All Alerts' : 'Active Only'}
              </button>
            ))}
          </div>
          <div className="text-xs" style={{ color: '#64748b' }}>{visible.length} alerts</div>
        </div>

        <div className="flex flex-col gap-3">
          {visible.map(a => (
            <div key={a.id} className="rail-card flex items-start gap-4"
              style={{ opacity: a.resolved ? 0.6 : 1 }}>
              <div className="text-xl mt-0.5">{typeIcon[a.alert_type] || '◉'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm" style={{ color: '#e2e8f0' }}>{a.title}</span>
                  {a.resolved && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88' }}>Resolved</span>}
                </div>
                <div className="text-xs mb-1" style={{ color: '#64748b' }}>{a.asset_name}</div>
                <div className="text-sm" style={{ color: '#94a3b8' }}>{a.message}</div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`badge-${a.severity} text-xs px-2 py-0.5 rounded-full capitalize`}>{a.severity}</span>
                <span className="text-xs" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>{a.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}
