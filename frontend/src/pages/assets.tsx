import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/dashboard/Layout'

const ASSETS = [
  { id: 'A001', name: 'Kavach ATP Node — New Delhi', type: 'kavach', location: 'New Delhi Junction', status: 'secure', risk_score: 8.2, vulnerabilities: 0, protocol: 'Kavach v3.2', zone: 'Zone-1-NR', ip_address: '10.1.1.10' },
  { id: 'A002', name: 'OCC Server — Mumbai Central', type: 'occ', location: 'Mumbai Central', status: 'warning', risk_score: 62.4, vulnerabilities: 3, protocol: 'SCADA/IEC-104', zone: 'Zone-2-WR', ip_address: '10.2.1.5' },
  { id: 'A003', name: 'RailTel Gateway — Chennai', type: 'railtel', location: 'Chennai Egmore', status: 'secure', risk_score: 15.0, vulnerabilities: 1, protocol: 'RailTel MPLS', zone: 'Zone-3-SR', ip_address: '10.3.1.20' },
  { id: 'A004', name: 'Trackside RTU — Howrah', type: 'trackside', location: 'Howrah Junction', status: 'critical', risk_score: 88.5, vulnerabilities: 7, protocol: 'DNP3', zone: 'Zone-4-ER', ip_address: '10.4.1.8' },
  { id: 'A005', name: 'Rolling Stock ECU — Rajdhani 12301', type: 'rolling_stock', location: 'En Route NR', status: 'secure', risk_score: 12.1, vulnerabilities: 0, protocol: 'MVB/CAN', zone: 'Zone-1-NR', ip_address: '10.5.1.3' },
  { id: 'A006', name: 'Station BMS — Bengaluru City', type: 'station', location: 'Bengaluru City Junction', status: 'secure', risk_score: 28.0, vulnerabilities: 2, protocol: 'BACnet/IP', zone: 'Zone-5-SWR', ip_address: '10.6.1.15' },
  { id: 'A007', name: 'Kavach ATP Node — Lucknow', type: 'kavach', location: 'Lucknow Charbagh', status: 'secure', risk_score: 9.0, vulnerabilities: 0, protocol: 'Kavach v3.2', zone: 'Zone-2-NER', ip_address: '10.1.2.11' },
  { id: 'A008', name: 'OCC Server — Secunderabad', type: 'occ', location: 'Secunderabad Junction', status: 'warning', risk_score: 55.3, vulnerabilities: 4, protocol: 'SCADA/Modbus', zone: 'Zone-5-SCR', ip_address: '10.7.1.4' },
]

const statusColor: Record<string, string> = {
  secure: '#00ff88', warning: '#ffaa00', critical: '#ff3b3b', offline: '#64748b'
}
const typeIcon: Record<string, string> = {
  kavach: '🛡', occ: '🖥', railtel: '📡', trackside: '🔧', rolling_stock: '🚆', station: '🏛'
}

export default function Assets() {
  const [assets, setAssets] = useState(ASSETS)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/assets/`)
      .then(r => r.json()).then(setAssets).catch(() => {})
  }, [])

  const filtered = filter === 'all' ? assets : assets.filter(a => a.status === filter)

  return (
    <>
      <Head><title>RailShield — Assets</title></Head>
      <Layout title="Asset Inventory">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {['all','secure','warning','critical'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="rail-card text-left transition-all"
              style={filter === s ? { borderColor: statusColor[s] || '#00d4ff' } : {}}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>{s}</div>
              <div className="text-2xl font-bold" style={{ color: statusColor[s] || '#00d4ff', fontFamily: 'Orbitron' }}>
                {s === 'all' ? assets.length : assets.filter(a => a.status === s).length}
              </div>
            </button>
          ))}
        </div>

        {/* Asset Table */}
        <div className="rail-card overflow-hidden p-0">
          <div className="px-5 py-4 border-b" style={{ borderColor: '#1e2d45' }}>
            <div className="text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>
              Rail Network Assets — {filtered.length} found
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2d45' }}>
                  {['Asset', 'Type', 'Location', 'Protocol', 'Zone', 'Vulns', 'Risk Score', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #1e2d45', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: '#e2e8f0' }}>{a.name}</div>
                      <div className="text-xs" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>{a.ip_address}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{typeIcon[a.type] || '◈'}</span>
                      <span className="ml-2 text-xs capitalize" style={{ color: '#94a3b8' }}>{a.type.replace('_',' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{a.location}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', fontFamily: 'JetBrains Mono' }}>{a.protocol}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{a.zone}</td>
                    <td className="px-4 py-3">
                      <span style={{ color: a.vulnerabilities > 0 ? '#ffaa00' : '#00ff88' }}>{a.vulnerabilities}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1e2d45', width: 60 }}>
                          <div className="h-full rounded-full" style={{
                            width: `${a.risk_score}%`,
                            background: a.risk_score > 70 ? '#ff3b3b' : a.risk_score > 40 ? '#ffaa00' : '#00ff88'
                          }} />
                        </div>
                        <span className="text-xs" style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono' }}>{a.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-${a.status} text-xs px-2 py-0.5 rounded-full capitalize`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  )
}
