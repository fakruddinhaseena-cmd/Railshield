import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/dashboard/Layout'

const MOCK_FEEDS = [
  { id: 'DW001', title: 'Railway SCADA Exploit Kit Listed on Dark Web Forum', source: 'RailHack Forum (Tor)', severity: 'critical', summary: 'A threat actor is selling a 0-day exploit targeting IEC-104 SCADA systems used in Indian Railways. Buyer interest from 3 nation-state groups.', tags: ['IEC-104', '0-day', 'SCADA', 'Indian Railways'], detected_at: '6h ago', credibility: 0.87, threat_actor: 'APT-RAILGH0ST', target: 'Indian Railways OCC Systems', mitigations: ['Apply IEC-104 vendor patches', 'Segment OCC from internet', 'Enable DPI monitoring'] },
  { id: 'DW002', title: 'Kavach ATP Credentials Leaked in Paste Site', source: 'PasteDB Mirror', severity: 'high', summary: '220 Kavach ATP system credentials found in a public paste. Includes admin credentials for Northern Railway zones.', tags: ['Kavach', 'Credentials', 'Phishing', 'Northern Railway'], detected_at: '18h ago', credibility: 0.91, threat_actor: 'Unknown', target: 'Kavach ATP — Zone NR', mitigations: ['Force password reset for all ATP admins', 'Enable MFA', 'Audit login logs'] },
  { id: 'DW003', title: 'DDoS-for-hire Targeting Rail Infrastructure', source: 'BreachForums Clone', severity: 'medium', summary: 'A booter service is offering DDoS attacks on critical Indian infrastructure including railway ticketing and control systems.', tags: ['DDoS', 'Infrastructure', 'Ticketing'], detected_at: '2d ago', credibility: 0.68, threat_actor: 'DDoS-Gang-47', target: 'IRCTC + OCC Web Interfaces', mitigations: ['Enable DDoS protection', 'Rate limiting', 'CDN failover'] },
  { id: 'DW004', title: 'Rail Network Topology Maps Sold on Telegram', source: 'Telegram Channel (Rail-Leaks)', severity: 'high', summary: 'Detailed network topology maps of South Central Railway OT network are being sold on Telegram. Data from insider or contractor leak.', tags: ['Insider Threat', 'Network Map', 'SCR', 'Telegram'], detected_at: '1d ago', credibility: 0.79, threat_actor: 'Insider / Contractor', target: 'South Central Railway (SCR)', mitigations: ['Audit contractor access', 'Classify network diagrams', 'Monitor insider activity'] },
]

const sevColor: Record<string, string> = { critical: '#ff3b3b', high: '#ff6400', medium: '#ffaa00' }

export default function DarkWeb() {
  const [feeds, setFeeds] = useState(MOCK_FEEDS)
  const [selected, setSelected] = useState<typeof MOCK_FEEDS[0] | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/darkweb/`)
      .then(r => r.json()).then(setFeeds).catch(() => {})
  }, [])

  return (
    <>
      <Head><title>RailShield — Dark Web Intel</title></Head>
      <Layout title="Dark Web Threat Intelligence">
        {/* Warning banner */}
        <div className="rounded-lg p-4 mb-6 flex items-start gap-3"
          style={{ background: 'rgba(255,59,59,0.05)', border: '1px solid rgba(255,59,59,0.2)' }}>
          <div className="text-xl">🕵️</div>
          <div>
            <div className="font-semibold text-sm mb-0.5" style={{ color: '#ff3b3b' }}>Dark Web Monitoring Active</div>
            <div className="text-xs" style={{ color: '#64748b' }}>RailShield continuously monitors Tor forums, Telegram channels, and paste sites for threats targeting Indian Railways. All data is for defensive intelligence only.</div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ['Feeds Today', feeds.length, '#00d4ff'],
            ['Critical', feeds.filter(f=>f.severity==='critical').length, '#ff3b3b'],
            ['High', feeds.filter(f=>f.severity==='high').length, '#ff6400'],
            ['Threat Actors', new Set(feeds.map(f=>f.threat_actor)).size, '#ffaa00'],
          ].map(([l,v,c]) => (
            <div key={String(l)} className="rail-card" style={{ borderLeft: `3px solid ${c}` }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>{l}</div>
              <div className="text-3xl font-bold" style={{ color: String(c), fontFamily: 'Orbitron' }}>{v}</div>
            </div>
          ))}
        </div>

        <div className={`grid gap-4 ${selected ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="flex flex-col gap-3">
            {feeds.map(f => (
              <div key={f.id} onClick={() => setSelected(f === selected ? null : f)}
                className="rail-card cursor-pointer transition-all"
                style={selected?.id === f.id ? { borderColor: sevColor[f.severity] } : {}}>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: sevColor[f.severity], boxShadow: `0 0 6px ${sevColor[f.severity]}` }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1" style={{ color: '#e2e8f0' }}>{f.title}</div>
                    <div className="text-xs mb-2" style={{ color: '#64748b' }}>{f.source} · {f.detected_at}</div>
                    <div className="text-xs mb-2" style={{ color: '#94a3b8' }}>{f.summary}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {f.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded"
                          style={{ background: 'rgba(0,212,255,0.06)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.15)', fontFamily: 'JetBrains Mono' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`badge-${f.severity} text-xs px-2 py-0.5 rounded-full capitalize`}>{f.severity}</span>
                    <span className="text-xs" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>
                      Cred: <span style={{ color: f.credibility > 0.8 ? '#ff3b3b' : '#ffaa00' }}>{Math.round(f.credibility * 100)}%</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="rail-card h-fit sticky top-6">
              <div className="flex justify-between mb-4">
                <div className="text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>Intel Detail</div>
                <button onClick={() => setSelected(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <span className={`badge-${selected.severity} text-xs px-2 py-0.5 rounded-full capitalize inline-block mb-3`}>{selected.severity}</span>
              <h3 className="font-semibold mb-2" style={{ color: '#e2e8f0' }}>{selected.title}</h3>
              <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{selected.summary}</p>
              <div className="flex flex-col gap-1.5 text-xs mb-4" style={{ fontFamily: 'JetBrains Mono' }}>
                {[
                  ['Source', selected.source],
                  ['Threat Actor', selected.threat_actor],
                  ['Target', selected.target],
                  ['Credibility', `${Math.round(selected.credibility * 100)}%`],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between py-1.5 border-b" style={{ borderColor: '#1e2d45' }}>
                    <span style={{ color: '#64748b' }}>{k}</span>
                    <span style={{ color: '#e2e8f0' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Recommended Mitigations</div>
              <div className="flex flex-col gap-1.5">
                {selected.mitigations.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94a3b8' }}>
                    <span style={{ color: '#00ff88', flexShrink: 0 }}>→</span>
                    {m}
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
