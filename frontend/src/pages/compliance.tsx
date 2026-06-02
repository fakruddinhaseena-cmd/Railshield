import Head from 'next/head'
import Layout from '../components/dashboard/Layout'

const COMPLIANCE = [
  { standard: 'IEC 62443-3-2', score: 91, status: 'compliant', controls_passed: 87, controls_total: 96, last_audit: '7 days ago', description: 'OT Security for Industrial Automation' },
  { standard: 'NIST 800-82', score: 88, status: 'compliant', controls_passed: 132, controls_total: 150, last_audit: '14 days ago', description: 'Guide to ICS Security' },
  { standard: 'EN TS 50701', score: 85, status: 'partial', controls_passed: 68, controls_total: 80, last_audit: '3 days ago', description: 'Railway Cybersecurity Standard' },
  { standard: 'CERT-In Guidelines', score: 94, status: 'compliant', controls_passed: 47, controls_total: 50, last_audit: '2 days ago', description: 'India National CERT Guidelines' },
  { standard: 'TSA Security Directives', score: 79, status: 'partial', controls_passed: 55, controls_total: 70, last_audit: '30 days ago', description: 'US TSA Rail Security' },
]

const avg = Math.round(COMPLIANCE.reduce((s,c) => s+c.score, 0) / COMPLIANCE.length)

export default function Compliance() {
  return (
    <>
      <Head><title>RailShield — Compliance</title></Head>
      <Layout title="Compliance & Standards">
        {/* Overall score */}
        <div className="rail-card mb-6 flex items-center gap-8">
          <div>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Overall Compliance Score</div>
            <div className="text-6xl font-bold" style={{ fontFamily: 'Orbitron', color: avg >= 90 ? '#00ff88' : '#ffaa00' }}>{avg}%</div>
          </div>
          <div className="flex-1">
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1e2d45' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${avg}%`, background: avg >= 90 ? '#00ff88' : '#ffaa00' }} />
            </div>
            <div className="mt-3 flex gap-6 text-xs" style={{ color: '#64748b' }}>
              <span>✓ {COMPLIANCE.filter(c=>c.status==='compliant').length} standards compliant</span>
              <span>⚠ {COMPLIANCE.filter(c=>c.status==='partial').length} partially compliant</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4">
          {COMPLIANCE.map(c => (
            <div key={c.standard} className="rail-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold" style={{ color: '#e2e8f0' }}>{c.standard}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={c.status === 'compliant'
                        ? { background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }
                        : { background: 'rgba(255,170,0,0.08)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.2)' }}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs mb-3" style={{ color: '#64748b' }}>{c.description}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1e2d45' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${c.score}%`,
                        background: c.score >= 90 ? '#00ff88' : c.score >= 80 ? '#ffaa00' : '#ff3b3b'
                      }} />
                    </div>
                    <span className="text-sm font-bold w-12 text-right" style={{ color: '#e2e8f0', fontFamily: 'Orbitron' }}>{c.score}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs flex-shrink-0" style={{ fontFamily: 'JetBrains Mono' }}>
                  <span style={{ color: '#00d4ff' }}>{c.controls_passed}/{c.controls_total} controls</span>
                  <span style={{ color: '#64748b' }}>Last: {c.last_audit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}
