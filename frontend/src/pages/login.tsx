import { useState, FormEvent, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../utils/auth'

const DEMO_USERS = [
  { email:'admin@railshield.in',   password:'railshield123', role:'SOC Admin',        avatar:'AS', color:'#00d4ff' },
  { email:'analyst@railshield.in', password:'analyst123',    role:'Security Analyst', avatar:'PN', color:'#00ff88' },
  { email:'ops@railshield.in',     password:'ops12345',      role:'Network Ops',      avatar:'RK', color:'#ffaa00' },
]

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try { await login(email, password) }
    catch (err: any) { setError(err.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'11px 14px',
    background:'#1a2540', border:'1px solid #2e4060',
    borderRadius:8, color:'#ffffff', fontSize:14,
    outline:'none', fontFamily:'Space Grotesk, sans-serif',
    caretColor:'#00d4ff', transition:'border-color 0.2s',
  }

  return (
    <>
      <Head>
        <title>RailShield — Secure Login</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet"/>
        <style>{`
          input:-webkit-autofill { -webkit-box-shadow:0 0 0 100px #1a2540 inset !important; -webkit-text-fill-color:#fff !important; }
          input::placeholder { color:#3a4a6a !important; }
          input:focus { border-color: rgba(0,212,255,0.5) !important; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          @keyframes floatBg { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>
      </Head>

      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:'#0a0e1a', padding:20, overflow:'hidden', position:'relative',
        backgroundImage:'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)',
        backgroundSize:'40px 40px' }}>

        {/* Animated background blobs */}
        <div style={{ position:'fixed', top:'15%', left:'8%', width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
          animation:'floatBg 8s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'fixed', bottom:'10%', right:'8%', width:300, height:300, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          animation:'floatBg 10s ease-in-out infinite reverse', pointerEvents:'none' }}/>

        <div style={{ width:'100%', maxWidth:440, opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(20px)', transition:'all 0.6s ease' }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:28, animation: mounted ? 'fadeUp 0.6s ease' : 'none' }}>
            <div style={{ width:64, height:64,
              background:'rgba(0,212,255,0.08)', border:'2px solid rgba(0,212,255,0.25)',
              borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 14px', fontSize:30, boxShadow:'0 0 30px rgba(0,212,255,0.1)' }}>🛡️</div>
            <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:26, fontWeight:900, color:'#00d4ff', letterSpacing:6,
              textShadow:'0 0 30px rgba(0,212,255,0.3)' }}>RAILSHIELD</div>
            <div style={{ fontSize:12, color:'#475569', marginTop:5 }}>Predictive Railway Cybersecurity · India</div>
          </div>

          {/* Card */}
          <div style={{ background:'#111827', border:'1px solid #1e3a5f', borderRadius:18,
            padding:'28px 28px 24px', boxShadow:'0 24px 80px rgba(0,0,0,0.4)',
            animation: mounted ? 'fadeUp 0.7s ease 0.1s both' : 'none' }}>

            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:17, fontWeight:600, color:'#e2e8f0', marginBottom:3 }}>Sign in to your account</div>
              <div style={{ fontSize:12, color:'#475569' }}>Authorized personnel only · All access is logged</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, color:'#64748b', marginBottom:6, textTransform:'uppercase', letterSpacing:1.5 }}>Email</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="you@railshield.in" style={inputStyle}/>
              </div>

              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:11, color:'#64748b', marginBottom:6, textTransform:'uppercase', letterSpacing:1.5 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPw?'text':'password'} required value={password}
                    onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"
                    style={{ ...inputStyle, paddingRight:44 }}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:16, padding:0, lineHeight:1 }}>
                    {showPw?'🙈':'👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ marginBottom:14, padding:'10px 14px', background:'rgba(255,59,59,0.08)', border:'1px solid rgba(255,59,59,0.3)', borderRadius:8, color:'#ff6b6b', fontSize:13 }}>
                  ⚠ {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'12px', borderRadius:8,
                background: loading ? '#1e2d45' : 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(0,212,255,0.06))',
                border:`1px solid ${loading?'#1e2d45':'rgba(0,212,255,0.4)'}`,
                color: loading?'#475569':'#00d4ff',
                fontSize:15, fontWeight:600, cursor:loading?'not-allowed':'pointer',
                fontFamily:'Space Grotesk,sans-serif', letterSpacing:1,
                boxShadow: loading?'none':'0 0 20px rgba(0,212,255,0.1)',
                transition:'all 0.2s',
              }}>
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <span style={{ width:14, height:14, border:'2px solid #475569', borderTop:'2px solid #00d4ff', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }}/>
                    Authenticating...
                  </span>
                ) : '→ Sign In'}
              </button>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0 14px' }}>
              <div style={{ flex:1, height:1, background:'#1e3a5f' }}/>
              <span style={{ fontSize:10, color:'#2e4060', letterSpacing:2 }}>DEMO ACCOUNTS</span>
              <div style={{ flex:1, height:1, background:'#1e3a5f' }}/>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {DEMO_USERS.map(u => (
                <button key={u.email} onClick={()=>{setEmail(u.email);setPassword(u.password);setError('')}}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
                    background: email===u.email ? 'rgba(0,212,255,0.05)' : '#0d1220',
                    border:`1px solid ${email===u.email?'rgba(0,212,255,0.3)':'#1e2d45'}`,
                    borderRadius:10, cursor:'pointer', textAlign:'left', transition:'all 0.15s',
                    boxShadow: email===u.email ? '0 0 12px rgba(0,212,255,0.08)' : 'none',
                  }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`${u.color}15`, border:`1px solid ${u.color}40`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700,
                    color:u.color, fontFamily:'JetBrains Mono', flexShrink:0 }}>{u.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:'#e2e8f0', fontWeight:600 }}>{u.role}</div>
                    <div style={{ fontSize:11, color:'#475569', fontFamily:'JetBrains Mono' }}>{u.email}</div>
                  </div>
                  <div style={{ fontSize:11, color:'#2e4060' }}>Fill →</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:16, fontSize:11, color:'#2e4060' }}>
            🇮🇳 Secured by RailShield · IEC 62443 · CERT-In Compliant
          </div>
        </div>
      </div>
    </>
  )
}
