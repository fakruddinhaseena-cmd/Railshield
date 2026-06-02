import Link from 'next/link'
import { useRouter } from 'next/router'

const items = [
  { href: '/',           icon: '⬡', label: 'Home'     },
  { href: '/assets',     icon: '◈', label: 'Assets'   },
  { href: '/threats',    icon: '⚠', label: 'Threats'  },
  { href: '/alerts',     icon: '◉', label: 'Alerts'   },
  { href: '/map',        icon: '◍', label: 'Map'      },
  { href: '/compliance', icon: '◎', label: 'Comply'   },
  { href: '/ml-engine',  icon: '◆', label: 'AI'       },
  { href: '/reports',    icon: '▤', label: 'Reports'  },
]

export default function MobileNav() {
  const router = useRouter()
  return (
    <nav className="mobile-nav" style={{ display: 'none' }}>
      {items.map(item => {
        const active = router.pathname === item.href
        return (
          <Link key={item.href} href={item.href}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '6px 2px', borderRadius: 8, textDecoration: 'none',
              background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: active ? '#00d4ff' : '#475569', transition: 'all 0.15s',
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
