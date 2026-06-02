import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/dashboard/Layout'

const THREATS = [
  { id: 'T001', title: 'Anomalous DNP3 Command Injection', severity: 'critical', source_ip: '203.88.140.12', target_asset: 'Trackside RTU — Howrah', threat_type: 'Command Injection', description: 'Unauthorized DNP3 control commands detected targeting signal relay at Howrah Junction.', detected_at: '2025-05-20T10:12:00', status: 'active', confidence: 0.94, mitre_tactic: 'T0855 - Unauthorized Command Message', auto_response: true },
  { id: 'T002', title: 'Suspicious SCADA Login Attempts', severity: 'high', source_ip: '91.214.23.55', target_asset: 'OCC Server — Mumbai Central', threat_type: 'Brute Force', description: '52 failed login attempts in 3 minutes on OCC SCADA interface.', detected_at: '2025-05-20T09:20:00', status: 'investigating', confidence: 0.87, mitre_tactic: 'T0834 - Native API', auto_response: false },
  { id: 'T003', title: 'Kavach Network Anomaly', severity: 'medium', source_ip: null, target_asset: 'Kavach ATP Node — Lucknow', threat_type: 'Network Anomaly', description: 'Unusual broadcast traffic detected on Kavach ATP network segment.', detected_at: '2025-05-20T07:10:00', status: 'monitoring', confidence: 0.71, mitre_tactic: 'T0840 - Network Sniffing', auto_response: false },
  { id: 'T004', title: 'Rolling Stock ECU Firmware Tamper Attempt', severity: 'high', source_ip: '172.16.5.101', target_asset: 'Rolling Stock ECU — Rajdhani 12301', threat_type: 'Firmware Attack', description: 'Unauthorized firmware update request detected on train ECU. Blocked by auto-response.', detected_at: '2025-05-20T04:30:00', status: 'blocked', confidence: 0.91, mitre_tactic: 'T0839 - Module Firmware', auto_response: true },
]

const sev: Record<string, string> = { critical: '#ff3b3b', high: '#ff6400', medium: '#ffaa00', low: '#00ff88' }
const statusCol: Record<string, string> = { active: '#ff3b3b', investigating: '#ffaa00', monitoring: '#00d4ff', blocked: '#00ff88' }

export default function Threats() {
  const [threats, setThreats] = useState(THREATS)
  const [selected, setSelected] = useState<typeof THREATS[0] | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/threats/`)
      .then(r => r.json()).then(setThreats).catch(() => {})
  }, [])

  return (
    <>
      <Head><title>RailShield — Threats</title></Head>
      <Layout title="Threat Intelligence">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[['Active', threats.filter(t=>t.status==='active').length, 'red'],
            ['Investigating', threats.filter(t=>t.status==='investigating').length, 'amber'],
            ['Blocked Today', 24, 'green']].map(([l,v,c]) => (
            <div key={String(l)} className="rail-card" style={{ borderLeft: `3px solid ${c==='red'?'#ff3b3b':c==='amber'?'#ffaa00':'#00ff88'}` }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>{l}</div>
              <div className="text-3xl font-bold" style={{ color: c==='red'?'#ff3b3b':c==='amber'?'#ffaa00':'#00ff88', fontFamily: 'Orbitron' }}>{v}</div>
            </div>
          ))}
        </div>

        <div className={`grid gap-4 ${selected ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="flex flex-col gap-3">
            {threats.map(t => (
              <div key={t.id} onClick={() => setSelected(t)}
                className="rail-card cursor-pointer transition-all"
                style={selected?.id === t.id ? { borderColor: sev[t.severity] } : {}}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: sev[t.severity], boxShadow: `0 0 8px ${sev[t.severity]}` }} />
                    <div className="min-w-0">
                      <div className="font-medium text-sm" style={{ color: '#e2e8f0' }}>{t.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{t.target_asset}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`badge-${t.severity} text-xs px-2 py-0.5 rounded-full capitalize`}>{t.severity}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `${statusCol[t.status]}15`, color: statusCol[t.status], border: `1px solid ${statusCol[t.status]}33` }}>{t.status}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
                  <span style={{ fontFamily: 'JetBrains Mono' }}>Confidence: <span style={{ color: '#00d4ff' }}>{Math.round(t.confidence*100)}%</span></span>
                  {t.auto_response && <span style={{ color: '#00ff88' }}>⚡ Auto-Response</span>}
                  {t.source_ip && <span style={{ fontFamily: 'JetBrains Mono' }}>src: {t.source_ip}</span>}
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="rail-card h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>Threat Detail</div>
                <button onClick={() => setSelected(null)} style={{ color: '#64748b' }}>✕</button>
              </div>
              <div className={`badge-${selected.severity} text-xs px-2 py-0.5 rounded-full capitalize inline-block mb-3`}>{selected.severity}</div>
              <h3 className="font-semibold mb-1" style={{ color: '#e2e8f0' }}>{selected.title}</h3>
              <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{selected.description}</p>
              <div className="flex flex-col gap-2 text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
                {[
                  ['Type', selected.threat_type],
                  ['Target', selected.target_asset],
                  ['Source IP', selected.source_ip || 'N/A'],
                  ['MITRE Tactic', selected.mitre_tactic],
                  ['Confidence', `${Math.round(selected.confidence*100)}%`],
                  ['Auto Response', selected.auto_response ? '✓ Triggered' : '✗ Manual'],
                ].map(([k,v]) => (
                  <div key={String(k)} className="flex justify-between gap-2 py-1.5 border-b" style={{ borderColor: '#1e2d45' }}>
                    <span style={{ color: '#64748b' }}>{k}</span>
                    <span style={{ color: '#e2e8f0', textAlign: 'right' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
