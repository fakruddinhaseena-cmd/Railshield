import { useEffect, useState, useCallback } from 'react'

interface LiveAlert {
  id: string
  title: string
  asset: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  time: string
  auto_response: boolean
}

const severityColors: Record<string, string> = {
  critical: '#ff3b3b',
  high: '#ff6400',
  medium: '#ffaa00',
  low: '#00ff88',
}

// Simulate threats when WebSocket not available
const SIMULATED_THREATS = [
  { title: 'DNP3 Replay Attack',         asset: 'Trackside RTU — Howrah',     severity: 'critical' as const, auto_response: true  },
  { title: 'Unauthorized SCADA Access',  asset: 'OCC Server — Mumbai',        severity: 'high'     as const, auto_response: false },
  { title: 'Kavach Protocol Anomaly',    asset: 'Kavach ATP — Lucknow',       severity: 'medium'   as const, auto_response: false },
  { title: 'Firmware Tamper Attempt',    asset: 'ECU — Rajdhani 12301',       severity: 'high'     as const, auto_response: true  },
  { title: 'Port Scan Detected',         asset: 'RailTel Gateway — Chennai',  severity: 'medium'   as const, auto_response: false },
  { title: 'IEC-104 Command Flood',      asset: 'OCC Server — Secunderabad',  severity: 'high'     as const, auto_response: true  },
]

export default function LiveAlertToast() {
  const [toasts, setToasts] = useState<LiveAlert[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((alert: LiveAlert) => {
    setToasts(prev => [alert, ...prev].slice(0, 4))
    setTimeout(() => removeToast(alert.id), 5000)
  }, [removeToast])

  useEffect(() => {
    // Try WebSocket first
    const WS_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('http', 'ws')
    let ws: WebSocket | null = null
    let simulatorInterval: NodeJS.Timeout | null = null
    let retryTimer: NodeJS.Timeout | null = null
    let wsConnected = false

    const startSimulator = () => {
      if (simulatorInterval) return
      // First toast after 10s, then every 12-20s
      const fire = () => {
        const t = SIMULATED_THREATS[Math.floor(Math.random() * SIMULATED_THREATS.length)]
        addToast({ ...t, id: `SIM-${Date.now()}`, time: new Date().toISOString() })
        simulatorInterval = setTimeout(fire, 12000 + Math.random() * 8000) as any
      }
      simulatorInterval = setTimeout(fire, 10000) as any
    }

    const connectWS = () => {
      try {
        ws = new WebSocket(`${WS_URL}/ws/alerts`)
        ws.onopen = () => { wsConnected = true }
        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data)
            if (data.type === 'threat') addToast({ ...data })
          } catch {}
        }
        ws.onerror = () => { ws?.close() }
        ws.onclose = () => {
          wsConnected = false
          if (!simulatorInterval) startSimulator()
          retryTimer = setTimeout(connectWS, 8000)
        }
      } catch {
        startSimulator()
      }
    }

    connectWS()
    // Fallback: if WS doesn't connect in 5s, start simulator
    const fallback = setTimeout(() => { if (!wsConnected) startSimulator() }, 5000)

    return () => {
      clearTimeout(fallback)
      if (retryTimer) clearTimeout(retryTimer)
      if (simulatorInterval) clearTimeout(simulatorInterval)
      ws?.close()
    }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360, width: 'calc(100vw - 40px)' }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(40px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeOut { from { opacity:1 } to { opacity:0; transform:translateX(40px) } }
      `}</style>
      {toasts.map(toast => {
        const c = severityColors[toast.severity]
        return (
          <div key={toast.id} style={{
            background: '#111827',
            border: `1px solid ${c}44`,
            borderLeft: `3px solid ${c}`,
            borderRadius: 10,
            padding: '12px 14px',
            boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${c}11`,
            animation: 'slideIn 0.25s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{toast.title}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{toast.asset}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${c}18`, color: c, border: `1px solid ${c}33`, textTransform: 'capitalize' }}>
                    {toast.severity}
                  </span>
                  {toast.auto_response && (
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>
                      ⚡ Auto-Response
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => removeToast(toast.id)}
                style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0, padding: 0 }}>✕</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
