import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useAuth } from '../../utils/auth'
import { useLang } from '../../utils/i18n'
import { useState } from 'react'

function ProfileMenu({ user, logout }: { user: any, logout: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {/* Popup menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          {/* Menu */}
          <div style={{
            position: 'absolute', bottom: '110%', left: 0, right: 0, zIndex: 50,
            background: '#111827', border: '1px solid #1e3a5f', borderRadius: 10,
            padding: 8, boxShadow: '0 -8px 32px rgba(0,0,0,0.5)'
          }}>
            {/* User info */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e2d45', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{user.email}</div>
              <div style={{ fontSize: 11, color: '#00d4ff', marginTop: 3 }}>{user.role} · {user.zone}</div>
            </div>
            {/* Logout button */}
            <button onClick={() => { setOpen(false); logout() }}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 8,
                background: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)',
                color: '#ff3b3b', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk, sans-serif'
              }}>
              <span>⏏</span> Sign Out
            </button>
          </div>
        </>
      )}

      {/* Profile card — click to open */}
      <div onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          background: open ? 'rgba(0,212,255,0.06)' : '#0d1220',
          border: `1px solid ${open ? 'rgba(0,212,255,0.3)' : '#1e2d45'}`,
          borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s'
        }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#00d4ff', fontFamily: 'JetBrains Mono'
        }}>
          {user.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.role}</div>
        </div>
        <span style={{ color: '#475569', fontSize: 10, flexShrink: 0 }}>{open ? '▲' : '▲'}</span>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLang()

  const navItems = [
    { href: '/',           label: t.dashboard  },
    { href: '/assets',     label: t.assets     },
    { href: '/threats',    label: t.threats    },
    { href: '/alerts',     label: t.alerts     },
    { href: '/map',        label: t.railMap    },
    { href: '/compliance', label: t.compliance },
    { href: '/ml-engine',  label: t.aiEngine   },
    { href: '/darkweb',    label: '🕵 Dark Web' },
    { href: '/reports',    label: t.reports    },
  ]
  const icons = ['⬡','◈','⚠','◉','◍','◎','◆','🕵','▤']

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-50"
      style={{ background: '#0d1220', borderRight: '1px solid #1e2d45' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#1e2d45' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
            🛡️
          </div>
          <div>
            <div className="font-bold text-sm tracking-widest"
              style={{ color: '#00d4ff', fontFamily: 'Orbitron, sans-serif' }}>
              RAILSHIELD
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>Railway Cybersecurity</div>
          </div>
        </div>
      </div>

      {/* Live status */}
      <div className="px-5 py-2.5 flex items-center gap-2 text-xs" style={{ borderBottom: '1px solid #1e2d45' }}>
        <div className="pulse-dot"></div>
        <span style={{ color: '#00ff88' }}>{t.systemOnline}</span>
        <span className="ml-auto" style={{ color: '#64748b', fontFamily: 'JetBrains Mono' }}>
          {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item, i) => {
          const active = router.pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150')}
              style={active
                ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff', borderLeft: '2px solid #00d4ff' }
                : { color: '#64748b', borderLeft: '2px solid transparent' }
              }>
              <span className="text-base w-5 text-center">{icons[i]}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Language toggle */}
      <div className="px-4 pb-2 flex gap-2">
        {(['en','hi'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)}
            className="flex-1 py-1.5 text-xs rounded-lg transition-all"
            style={lang === l
              ? { background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)' }
              : { background: 'transparent', color: '#475569', border: '1px solid #1e2d45' }}>
            {l === 'en' ? '🇬🇧 EN' : '🇮🇳 हिं'}
          </button>
        ))}
      </div>

      {/* India badge + Profile */}
      <div className="px-4 py-3 border-t" style={{ borderColor: '#1e2d45' }}>
        <div className="rounded-lg p-2.5 text-xs mb-3" style={{ background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.15)' }}>
          <div className="font-medium mb-0.5" style={{ color: '#ffaa00' }}>🇮🇳 {t.indiaModule}</div>
          <div style={{ color: '#64748b' }}>Kavach • IR SCADA • CERT-In</div>
        </div>
        {user && <ProfileMenu user={user} logout={logout} />}
      </div>
    </aside>
  )
}
