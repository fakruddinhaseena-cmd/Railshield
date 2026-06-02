import { useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/dashboard/Layout'
import StatCard from '../components/dashboard/StatCard'
import { useAuth } from '../utils/auth'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const THREAT_TIMELINE = [
  { time: '00:00', threats: 2 }, { time: '04:00', threats: 1 },
  { time: '08:00', threats: 5 }, { time: '10:00', threats: 8 },
  { time: '12:00', threats: 3 }, { time: '14:00', threats: 6 },
  { time: '16:00', threats: 12 },{ time: '18:00', threats: 4 },
  { time: '20:00', threats: 7 }, { time: '22:00', threats: 3 },
]

const ZONE_HEALTH = [
  { zone: 'NR', health: 94 }, { zone: 'WR', health: 78 },
  { zone: 'SR', health: 91 }, { zone: 'ER', health: 62 },
  { zone: 'NER', health: 88 },{ zone: 'SCR', health: 81 },
]

const RECENT_THREATS = [
  { id: 'T001', title: 'DNP3 Command Injection', asset: 'RTU — Howrah', severity: 'critical', time: '8m ago', auto: true },
  { id: 'T002', title: 'SCADA Brute Force', asset: 'OCC — Mumbai', severity: 'high', time: '1h ago', auto: false },
  { id: 'T003', title: 'Kavach Network Anomaly', asset: 'ATP — Lucknow', severity: 'medium', time: '3h ago', auto: false },
  { id: 'T004', title: 'Firmware Tamper Blocked', asset: 'ECU — Rajdhani', severity: 'high', time: '6h ago', auto: true },
]

const sevColor: Record<string, string> = {
  critical: '#ff3b3b', high: '#ff6400', medium: '#ffaa00', low: '#00ff88'
}

const TooltipStyle = {
  contentStyle: { background: '#161d2e', border: '1px solid #1e2d45', borderRadius: 8, color: '#e2e8f0', fontSize: 12 },
  labelStyle: { color: '#64748b' },
}

// ─── Role-specific panels ────────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Assets"     value={8}      sub="6 secure"       color="accent" icon="◈" />
        <StatCard label="Active Threats"   value={2}      sub="Live detection" color="red"    icon="⚠" />
        <StatCard label="Blocked Today"    value={24}     sub="Auto-response"  color="green"  icon="🛡" />
        <StatCard label="Compliance"       value="87.4%"  sub="IEC 62443"      color="amber"  icon="◎" />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Network Health"  value="92.3%"  color="green" />
        <StatCard label="Kavach Nodes"    value={1872}   sub="Online"    color="accent" />
        <StatCard label="Critical Alerts" value={1}      color="red" />
        <StatCard label="Dark Web Feeds"  value={4}      sub="Monitored" color="amber" />
      </div>
    </>
  )
}

function AnalystDashboard() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Open Investigations" value={2}     sub="Assigned to you"   color="red"    icon="⚠" />
        <StatCard label="Threats Analyzed"    value={18}    sub="This week"         color="accent" icon="◈" />
        <StatCard label="MITRE Tactics Found" value={7}     sub="Unique this month" color="amber"  icon="◎" />
      </div>
      <div className="rail-card mb-4">
        <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Your Active Investigations</div>
        <div className="flex flex-col gap-2">
          {RECENT_THREATS.filter(t => t.severity !== 'low').map(t => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#0d1220', border: '1px solid #1e2d45' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sevColor[t.severity], boxShadow: `0 0 6px ${sevColor[t.severity]}` }} />
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{t.title}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>{t.asset} · {t.time}</div>
              </div>
              <span className={`badge-${t.severity} text-xs px-2 py-0.5 rounded-full capitalize`}>{t.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function OpsDashboard() {
  const ASSETS = [
    { name: 'Kavach ATP — New Delhi', status: 'secure',   zone: 'NR', uptime: '99.9%' },
    { name: 'OCC Server — Mumbai',    status: 'warning',  zone: 'WR', uptime: '97.2%' },
    { name: 'RailTel — Chennai',      status: 'secure',   zone: 'SR', uptime: '99.7%' },
    { name: 'Trackside RTU — Howrah', status: 'critical', zone: 'ER', uptime: '84.1%' },
  ]
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Assets Online"   value="7/8"   sub="1 critical"    color="amber"  icon="◈" />
        <StatCard label="Network Health"  value="92.3%" sub="All zones"     color="green"  icon="⬡" />
        <StatCard label="Kavach Uptime"   value="99.1%" sub="Last 30 days"  color="accent" icon="🛡" />
      </div>
      <div className="rail-card mb-4">
        <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Your Zone — Asset Status</div>
        <div className="grid grid-cols-2 gap-3">
          {ASSETS.map(a => (
            <div key={a.name} className="flex items-center gap-3 px-3 py-3 rounded-lg" style={{ background: '#0d1220', border: '1px solid #1e2d45' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.status === 'secure' ? '#00ff88' : a.status === 'warning' ? '#ffaa00' : '#ff3b3b' }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: '#e2e8f0' }}>{a.name}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>Zone {a.zone} · Uptime {a.uptime}</div>
              </div>
              <span className={`badge-${a.status} text-xs px-2 py-0.5 rounded-full capitalize`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role || ''

  return (
    <>
      <Head><title>RailShield — Dashboard</title></Head>
      <Layout>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff' }}>
              RAILSHIELD
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
              Welcome back, <span style={{ color: '#e2e8f0' }}>{user?.name}</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>{role}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88' }}>
              <div className="pulse-dot w-2 h-2"></div>
              Live Monitoring
            </div>
            <div className="px-3 py-1.5 rounded-lg text-xs" style={{ background: '#161d2e', border: '1px solid #1e2d45', color: '#64748b' }}>
              🇮🇳 {user?.zone}
            </div>
          </div>
        </div>

        {/* Role-based KPIs */}
        {role === 'SOC Admin'        && <AdminDashboard />}
        {role === 'Security Analyst' && <AnalystDashboard />}
        {role === 'Network Ops'      && <OpsDashboard />}

        {/* Charts — shown to all */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rail-card">
            <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Threat Activity — Today</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={THREAT_TIMELINE}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3b3b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff3b3b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...TooltipStyle} />
                <Area type="monotone" dataKey="threats" stroke="#ff3b3b" strokeWidth={2} fill="url(#tg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rail-card">
            <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Zone Health Score</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={ZONE_HEALTH} barSize={24}>
                <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...TooltipStyle} />
                <Bar dataKey="health" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live threat feed */}
        <div className="rail-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>Live Threat Feed</div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#00ff88' }}>
              <div className="pulse-dot w-2 h-2"></div> Real-time
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {RECENT_THREATS.map(t => (
              <div key={t.id} className="flex items-center gap-4 px-4 py-3 rounded-lg" style={{ background: '#0d1220', border: '1px solid #1e2d45' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sevColor[t.severity], boxShadow: `0 0 6px ${sevColor[t.severity]}` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{t.title}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{t.asset}</div>
                </div>
                <span className={`badge-${t.severity} text-xs px-2 py-0.5 rounded-full capitalize`}>{t.severity}</span>
                {t.auto && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>Auto ✓</span>}
                <div className="text-xs flex-shrink-0" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>{t.time}</div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}
