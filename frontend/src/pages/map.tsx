import Head from 'next/head'
import Layout from '../components/dashboard/Layout'
import { useState } from 'react'

const ASSETS_GEO = [
  { id:'A001', name:'Kavach ATP — New Delhi',      lat:28.65, lng:77.23, status:'secure',   type:'kavach',       zone:'NR',  risk:8,  ip:'10.1.1.10',  protocol:'Kavach v3.2',  vulns:0 },
  { id:'A002', name:'OCC Server — Mumbai Central', lat:18.97, lng:72.82, status:'warning',  type:'occ',          zone:'WR',  risk:62, ip:'10.2.1.5',   protocol:'SCADA/IEC-104',vulns:3 },
  { id:'A003', name:'RailTel GW — Chennai',        lat:13.08, lng:80.26, status:'secure',   type:'railtel',      zone:'SR',  risk:15, ip:'10.3.1.20',  protocol:'RailTel MPLS', vulns:1 },
  { id:'A004', name:'Trackside RTU — Howrah',      lat:22.58, lng:88.34, status:'critical', type:'trackside',    zone:'ER',  risk:88, ip:'10.4.1.8',   protocol:'DNP3',         vulns:7 },
  { id:'A005', name:'ECU — Rajdhani 12301',        lat:26.85, lng:80.95, status:'secure',   type:'rolling_stock',zone:'NR',  risk:12, ip:'10.5.1.3',   protocol:'MVB/CAN',      vulns:0 },
  { id:'A006', name:'Station BMS — Bengaluru',     lat:12.98, lng:77.60, status:'secure',   type:'station',      zone:'SWR', risk:28, ip:'10.6.1.15',  protocol:'BACnet/IP',    vulns:2 },
  { id:'A007', name:'Kavach ATP — Lucknow',        lat:26.84, lng:80.92, status:'secure',   type:'kavach',       zone:'NER', risk:9,  ip:'10.1.2.11',  protocol:'Kavach v3.2',  vulns:0 },
  { id:'A008', name:'OCC — Secunderabad',          lat:17.43, lng:78.50, status:'warning',  type:'occ',          zone:'SCR', risk:55, ip:'10.7.1.4',   protocol:'SCADA/Modbus', vulns:4 },
]

const statusColor: Record<string,string> = { secure:'#00ff88', warning:'#ffaa00', critical:'#ff3b3b' }
const typeIcon:    Record<string,string> = { kavach:'🛡', occ:'🖥', railtel:'📡', trackside:'🔧', rolling_stock:'🚆', station:'🏛' }

function geoToSVG(lat: number, lng: number) {
  const x = ((lng - 68) / (97 - 68)) * 340 + 30
  const y = ((37 - lat) / (37 - 8)) * 380 + 20
  return { x, y }
}

export default function MapPage() {
  const [selected, setSelected] = useState<typeof ASSETS_GEO[0] | null>(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? ASSETS_GEO : ASSETS_GEO.filter(a => a.status === filter)

  return (
    <>
      <Head><title>RailShield — Rail Network Map</title></Head>
      <Layout title="Rail Network Map">
        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
          {[
            ['Total Nodes', ASSETS_GEO.length,                                    '#00d4ff'],
            ['Secure',      ASSETS_GEO.filter(a=>a.status==='secure').length,     '#00ff88'],
            ['Warning',     ASSETS_GEO.filter(a=>a.status==='warning').length,    '#ffaa00'],
            ['Critical',    ASSETS_GEO.filter(a=>a.status==='critical').length,   '#ff3b3b'],
          ].map(([l,v,c]) => (
            <div key={String(l)} className="rail-card" style={{ borderLeft:`3px solid ${c}` }}>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1.5, color:'#64748b', marginBottom:6 }}>{l}</div>
              <div style={{ fontSize:26, fontWeight:700, color:String(c), fontFamily:'Orbitron' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {['all','secure','warning','critical'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding:'6px 14px', borderRadius:8, fontSize:12, cursor:'pointer', fontFamily:'Space Grotesk',
                background: filter===s ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: filter===s ? '#00d4ff' : '#475569',
                border: filter===s ? '1px solid rgba(0,212,255,0.3)' : '1px solid #1e2d45',
              }}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          {/* Map */}
          <div className="rail-card" style={{ padding:14 }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1.5, color:'#64748b', marginBottom:10 }}>
              India Rail Network — Click asset for details
            </div>
            <div style={{ background:'#0d1220', borderRadius:10, overflow:'hidden', position:'relative' }}>
              <svg viewBox="0 0 400 420" style={{ width:'100%', cursor:'crosshair' }}>
                {/* India outline */}
                <path d="M120,30 L160,25 L200,30 L240,28 L280,40 L310,60 L330,90 L340,130 L335,160 L320,190 L300,220 L290,250 L280,280 L260,300 L240,320 L220,340 L200,360 L185,375 L175,380 L165,370 L150,350 L135,320 L120,295 L105,270 L95,240 L85,210 L80,180 L78,150 L82,120 L90,90 L105,60 Z"
                  fill="#1a2540" stroke="#2e4060" strokeWidth="1.5"/>
                {/* Grid lines */}
                <line x1="0" y1="140" x2="400" y2="140" stroke="#1e2d45" strokeWidth="0.5" strokeDasharray="4,4"/>
                <line x1="0" y1="250" x2="400" y2="250" stroke="#1e2d45" strokeWidth="0.5" strokeDasharray="4,4"/>
                <line x1="140" y1="0" x2="140" y2="420" stroke="#1e2d45" strokeWidth="0.5" strokeDasharray="4,4"/>
                <line x1="260" y1="0" x2="260" y2="420" stroke="#1e2d45" strokeWidth="0.5" strokeDasharray="4,4"/>

                {/* Rail connections */}
                {ASSETS_GEO.map((a,i) =>
                  ASSETS_GEO.slice(i+1, i+3).map(b => {
                    const p1 = geoToSVG(a.lat, a.lng), p2 = geoToSVG(b.lat, b.lng)
                    return <line key={`${a.id}-${b.id}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke="#1e3a5f" strokeWidth="1" strokeDasharray="5,5" opacity="0.6"/>
                  })
                )}

                {/* Asset nodes */}
                {ASSETS_GEO.map(asset => {
                  const {x,y} = geoToSVG(asset.lat, asset.lng)
                  const c = statusColor[asset.status]
                  const isSel = selected?.id === asset.id
                  const isFiltered = filter !== 'all' && asset.status !== filter
                  return (
                    <g key={asset.id} style={{ cursor:'pointer', opacity: isFiltered ? 0.2 : 1 }}
                      onClick={() => setSelected(selected?.id===asset.id ? null : asset)}>
                      {/* Pulse for critical */}
                      {asset.status==='critical' && (
                        <circle cx={x} cy={y} r="14" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.4">
                          <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
                        </circle>
                      )}
                      {/* Glow ring for selected */}
                      {isSel && <circle cx={x} cy={y} r="14" fill="none" stroke={c} strokeWidth="2" opacity="0.6"/>}
                      {/* Main node */}
                      <circle cx={x} cy={y} r={isSel?10:7} fill={`${c}20`} stroke={c} strokeWidth={isSel?2:1.5}/>
                      <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize="8">{typeIcon[asset.type]}</text>
                      {/* Zone label */}
                      <text x={x} y={y+18} textAnchor="middle" fontSize="7.5" fill="#94a3b8" style={{fontFamily:'Space Grotesk'}}>
                        {asset.zone}
                      </text>
                    </g>
                  )
                })}

                {/* Legend */}
                <g transform="translate(8,390)">
                  {[['secure','#00ff88'],['warning','#ffaa00'],['critical','#ff3b3b']].map(([s,c],i)=>(
                    <g key={s} transform={`translate(${i*90},0)`}>
                      <circle cx="5" cy="5" r="4" fill={`${c}20`} stroke={c} strokeWidth="1.2"/>
                      <text x="14" y="9" fontSize="8" fill="#64748b" style={{fontFamily:'Space Grotesk'}}>{s}</text>
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* Asset list */}
          <div className="rail-card" style={{ padding:14, overflowY:'auto', maxHeight:520 }}>
            <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1.5, color:'#64748b', marginBottom:10 }}>
              {filtered.length} Assets
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filtered.map(a => (
                <div key={a.id} onClick={() => setSelected(a===selected ? null : a)}
                  style={{
                    padding:'10px 12px', borderRadius:10, cursor:'pointer', transition:'all 0.15s',
                    background: selected?.id===a.id ? 'rgba(0,212,255,0.05)' : '#0d1220',
                    border:`1px solid ${selected?.id===a.id ? 'rgba(0,212,255,0.3)' : '#1e2d45'}`,
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:18 }}>{typeIcon[a.type]}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                        <span className={`badge-${a.status}`} style={{ fontSize:10, padding:'1px 6px', borderRadius:20 }}>{a.status}</span>
                        <span style={{ fontSize:10, color: a.risk>70?'#ff3b3b':a.risk>40?'#ffaa00':'#00ff88', fontFamily:'JetBrains Mono' }}>
                          Risk: {a.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected detail panel */}
        {selected && (
          <div className="rail-card" style={{ marginTop:14, borderColor:statusColor[selected.status] }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1.5, color:'#64748b' }}>Asset Detail</div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:16 }}>✕</button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <span style={{ fontSize:32 }}>{typeIcon[selected.type]}</span>
              <div style={{ flex:1, minWidth:200 }}>
                <h3 style={{ fontWeight:600, color:'#e2e8f0', marginBottom:4 }}>{selected.name}</h3>
                <div style={{ display:'flex', flexWrap:'wrap', gap:16, fontSize:12, fontFamily:'JetBrains Mono' }}>
                  {[['IP',selected.ip||'N/A'],['Protocol',selected.protocol||'N/A'],['Zone',selected.zone],['Vulns',String(selected.vulns)],['Risk',`${selected.risk}/100`]].map(([k,v])=>(
                    <div key={k}><span style={{color:'#64748b'}}>{k}: </span><span style={{color:'#e2e8f0'}}>{v}</span></div>
                  ))}
                </div>
              </div>
              <span className={`badge-${selected.status}`} style={{ fontSize:12, padding:'4px 12px', borderRadius:20, textTransform:'capitalize' }}>{selected.status}</span>
            </div>
            {/* Risk bar */}
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:11, color:'#64748b', marginBottom:4 }}>Risk Score</div>
              <div style={{ height:6, background:'#1e2d45', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${selected.risk}%`, borderRadius:3, transition:'width 0.5s',
                  background: selected.risk>70?'#ff3b3b':selected.risk>40?'#ffaa00':'#00ff88' }}/>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
