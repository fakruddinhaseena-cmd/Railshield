import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import LiveAlertToast from './LiveAlertToast'
import { useAuth } from '../../utils/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading])

  if (loading || !user) return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '2px solid #1e2d45', borderTop: '2px solid #00d4ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ color: '#00d4ff', fontFamily: 'Orbitron, sans-serif', fontSize: 12, letterSpacing: 3 }}>LOADING...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div className="min-h-screen grid-bg" style={{ background: '#0a0e1a' }}>
      <div className="scan-line" />
      <LiveAlertToast />

      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Main content */}
      <main className="main-mobile" style={{ marginLeft: 256, minHeight: '100vh', paddingBottom: 80 }}>
        <div style={{ padding: '24px 28px' }}>
          {title && (
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', letterSpacing: 0.5 }}>{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .main-mobile { margin-left: 0 !important; padding-bottom: 80px; }
          .main-mobile > div { padding: 16px !important; }
        }
      `}</style>
    </div>
  )
}
