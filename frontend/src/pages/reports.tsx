import Head from 'next/head'
import Layout from '../components/dashboard/Layout'
import { useState } from 'react'

const REPORT_TYPES = [
  { id: 'executive', title: 'Executive Summary', desc: 'High-level threat overview for management', icon: '◎', pages: 4 },
  { id: 'threat',    title: 'Threat Intelligence Report', desc: 'Detailed threat analysis with MITRE mappings', icon: '⚠', pages: 12 },
  { id: 'asset',     title: 'Asset Vulnerability Report', desc: 'Full inventory with risk scores', icon: '◈', pages: 8 },
  { id: 'compliance',title: 'Compliance Audit Report', desc: 'IEC 62443, CERT-In, NIST status', icon: '◎', pages: 16 },
  { id: 'incident',  title: 'Incident Response Report', desc: 'Post-incident analysis & timeline', icon: '◉', pages: 6 },
]

const RECENT_REPORTS = [
  { name: 'Executive Summary — May 2025', type: 'executive', date: '2025-05-15', size: '1.2 MB' },
  { name: 'Compliance Audit — Q1 2025',   type: 'compliance', date: '2025-04-01', size: '3.8 MB' },
  { name: 'Threat Intel — April 2025',    type: 'threat',     date: '2025-04-30', size: '2.1 MB' },
]

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const generate = async (id: string) => {
    setGenerating(id)
    setDone(null)
    await new Promise(r => setTimeout(r, 2200))
    setGenerating(null)
    setDone(id)
    setTimeout(() => setDone(null), 4000)
  }

  const exportHTML = (reportId: string) => {
    const report = REPORT_TYPES.find(r => r.id === reportId)
    if (!report) return
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RailShield — ${report.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; color: #1a1a2e; }
    h1 { color: #0a3d62; border-bottom: 3px solid #00d4ff; padding-bottom: 10px; }
    h2 { color: #0a3d62; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #0a3d62; color: white; padding: 10px; text-align: left; }
    td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) { background: #f5f9ff; }
    .badge-critical { color: #c0392b; font-weight: bold; }
    .badge-high { color: #e67e22; font-weight: bold; }
    .badge-medium { color: #f39c12; }
    .badge-low { color: #27ae60; }
    .summary-box { background: #eaf4ff; border-left: 4px solid #00d4ff; padding: 16px; margin: 16px 0; border-radius: 4px; }
    .footer { margin-top: 40px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>🛡️ RailShield — ${report.title}</h1>
  <p><strong>Generated:</strong> ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; <strong>Classification:</strong> CONFIDENTIAL</p>

  <div class="summary-box">
    <strong>Executive Summary</strong><br>
    RailShield detected 4 threats in the last 24 hours across 8 monitored rail assets.
    2 threats were automatically mitigated. Overall network health: 92.3%. Compliance score: 87.4%.
  </div>

  <h2>Threat Summary</h2>
  <table>
    <tr><th>ID</th><th>Threat</th><th>Asset</th><th>Severity</th><th>Status</th><th>Auto-Response</th></tr>
    <tr><td>T001</td><td>DNP3 Command Injection</td><td>Trackside RTU — Howrah</td><td class="badge-critical">CRITICAL</td><td>Active</td><td>✓ Yes</td></tr>
    <tr><td>T002</td><td>SCADA Brute Force</td><td>OCC Server — Mumbai</td><td class="badge-high">HIGH</td><td>Investigating</td><td>✗ No</td></tr>
    <tr><td>T003</td><td>Kavach Network Anomaly</td><td>Kavach ATP — Lucknow</td><td class="badge-medium">MEDIUM</td><td>Monitoring</td><td>✗ No</td></tr>
    <tr><td>T004</td><td>Firmware Tamper Attempt</td><td>ECU — Rajdhani 12301</td><td class="badge-high">HIGH</td><td>Blocked</td><td>✓ Yes</td></tr>
  </table>

  <h2>Asset Health Overview</h2>
  <table>
    <tr><th>Asset</th><th>Type</th><th>Zone</th><th>Status</th><th>Risk Score</th><th>Vulns</th></tr>
    <tr><td>Kavach ATP — New Delhi</td><td>Kavach</td><td>NR</td><td class="badge-low">Secure</td><td>8.2</td><td>0</td></tr>
    <tr><td>OCC Server — Mumbai</td><td>OCC</td><td>WR</td><td class="badge-medium">Warning</td><td>62.4</td><td>3</td></tr>
    <tr><td>Trackside RTU — Howrah</td><td>Trackside</td><td>ER</td><td class="badge-critical">Critical</td><td>88.5</td><td>7</td></tr>
    <tr><td>RailTel GW — Chennai</td><td>RailTel</td><td>SR</td><td class="badge-low">Secure</td><td>15.0</td><td>1</td></tr>
  </table>

  <h2>Compliance Status</h2>
  <table>
    <tr><th>Standard</th><th>Score</th><th>Controls Passed</th><th>Status</th></tr>
    <tr><td>IEC 62443-3-2</td><td>91%</td><td>87/96</td><td class="badge-low">Compliant</td></tr>
    <tr><td>NIST 800-82</td><td>88%</td><td>132/150</td><td class="badge-low">Compliant</td></tr>
    <tr><td>CERT-In Guidelines</td><td>94%</td><td>47/50</td><td class="badge-low">Compliant</td></tr>
    <tr><td>EN TS 50701</td><td>85%</td><td>68/80</td><td class="badge-medium">Partial</td></tr>
  </table>

  <div class="footer">
    RailShield v1.0 · India's Predictive Railway Cybersecurity Platform · IEC 62443 · CERT-In Compliant
    <br>This report is auto-generated and confidential. Unauthorized distribution is prohibited.
  </div>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RailShield_${report.title.replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Head><title>RailShield — Reports</title></Head>
      <Layout title="Reports & Export">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {REPORT_TYPES.map(r => (
            <div key={r.id} className="rail-card flex items-start gap-4">
              <div className="text-2xl mt-0.5">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#e2e8f0' }}>{r.title}</h3>
                <p className="text-xs mb-3" style={{ color: '#64748b' }}>{r.desc} · ~{r.pages} pages</p>
                <div className="flex gap-2">
                  <button onClick={() => generate(r.id)} disabled={generating === r.id}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', cursor: generating === r.id ? 'wait' : 'pointer' }}>
                    {generating === r.id ? '⏳ Generating...' : done === r.id ? '✓ Ready!' : '⚙ Generate'}
                  </button>
                  {done === r.id && (
                    <button onClick={() => exportHTML(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)', cursor: 'pointer' }}>
                      ↓ Download HTML
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rail-card">
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Recent Reports</div>
          <div className="flex flex-col gap-2">
            {RECENT_REPORTS.map(r => (
              <div key={r.name} className="flex items-center gap-4 px-4 py-3 rounded-lg"
                style={{ background: '#0d1220', border: '1px solid #1e2d45' }}>
                <div className="text-lg">📄</div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{r.name}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{r.date} · {r.size}</div>
                </div>
                <button onClick={() => exportHTML(r.type)}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,212,255,0.06)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.15)', cursor: 'pointer' }}>
                  ↓ Re-download
                </button>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}
