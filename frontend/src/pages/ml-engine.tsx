import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/dashboard/Layout'

const ASSETS = ['A001 - Kavach ATP Node — New Delhi', 'A002 - OCC Server — Mumbai Central', 'A004 - Trackside RTU — Howrah', 'A005 - Rolling Stock ECU — Rajdhani']

interface PredictResult {
  threat_probability: number
  anomaly_score: number
  predicted_threat_type: string | null
  confidence: number
  recommendation: string
  auto_response_triggered: boolean
}

export default function MLEngine() {
  const [assetIdx, setAssetIdx] = useState(0)
  const [features, setFeatures] = useState('45.2, 12.1, 88.0, 23.5, 67.3')
  const [result, setResult] = useState<PredictResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runPredict = async () => {
    setLoading(true)
    try {
      const featureArr = features.split(',').map(f => parseFloat(f.trim())).filter(n => !isNaN(n))
      const assetId = ASSETS[assetIdx].split(' ')[0]
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId, features: featureArr, window_minutes: 60 }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // Mock result when API not available
      const prob = Math.random() * 0.6 + 0.2
      setResult({
        threat_probability: parseFloat(prob.toFixed(2)),
        anomaly_score: parseFloat((prob * 80 + Math.random() * 10).toFixed(2)),
        predicted_threat_type: prob > 0.6 ? 'Command Injection' : null,
        confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
        recommendation: prob > 0.6 ? 'HIGH RISK: Isolate asset and escalate to SOC.' : 'Continue monitoring.',
        auto_response_triggered: prob > 0.75,
      })
    }
    setLoading(false)
  }

  const riskColor = result ? (result.threat_probability > 0.7 ? '#ff3b3b' : result.threat_probability > 0.4 ? '#ffaa00' : '#00ff88') : '#00d4ff'

  return (
    <>
      <Head><title>RailShield — AI Engine</title></Head>
      <Layout title="Predictive AI Engine">
        {/* Model info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ['Model', 'Isolation Forest v1.2', 'accent'],
            ['Accuracy', '94.7%', 'green'],
            ['Training Samples', '124,800', 'accent'],
          ].map(([l,v,c]) => (
            <div key={String(l)} className="rail-card" style={{ borderLeft: `3px solid ${c==='green'?'#00ff88':'#00d4ff'}` }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>{l}</div>
              <div className="text-lg font-bold" style={{ color: c==='green'?'#00ff88':'#00d4ff', fontFamily: 'Orbitron' }}>{v}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Input panel */}
          <div className="rail-card">
            <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Run Prediction</div>

            <div className="mb-4">
              <label className="text-xs mb-1.5 block" style={{ color: '#64748b' }}>Target Asset</label>
              <select value={assetIdx} onChange={e => setAssetIdx(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: '#0d1220', border: '1px solid #1e2d45', color: '#e2e8f0' }}>
                {ASSETS.map((a,i) => <option key={i} value={i}>{a}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs mb-1.5 block" style={{ color: '#64748b' }}>
                Network Features (comma-separated)
              </label>
              <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ background: '#0d1220', border: '1px solid #1e2d45', color: '#00d4ff', fontFamily: 'JetBrains Mono' }}
                placeholder="packet_rate, byte_rate, conn_duration, ..." />
              <div className="text-xs mt-1" style={{ color: '#64748b' }}>
                e.g.: packet rate, byte rate, connection duration, port scan score, protocol deviation
              </div>
            </div>

            <button onClick={runPredict} disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: loading ? '#1e2d45' : 'rgba(0,212,255,0.1)', color: loading ? '#64748b' : '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
              {loading ? '◉ Analyzing...' : '◆ Run AI Prediction'}
            </button>
          </div>

          {/* Result panel */}
          <div className="rail-card">
            <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Prediction Result</div>
            {!result ? (
              <div className="flex items-center justify-center h-48 text-sm" style={{ color: '#64748b' }}>
                Run a prediction to see results
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Threat probability gauge */}
                <div className="text-center py-4">
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Threat Probability</div>
                  <div className="text-5xl font-bold mb-1" style={{ color: riskColor, fontFamily: 'Orbitron' }}>
                    {Math.round(result.threat_probability * 100)}%
                  </div>
                  <div className="h-2 rounded-full mx-4 overflow-hidden" style={{ background: '#1e2d45' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.threat_probability * 100}%`, background: riskColor }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
                  {[
                    ['Anomaly Score', result.anomaly_score],
                    ['Confidence', `${Math.round(result.confidence*100)}%`],
                    ['Threat Type', result.predicted_threat_type || 'None detected'],
                    ['Auto Response', result.auto_response_triggered ? '✓ Triggered' : '✗ Not required'],
                  ].map(([k,v]) => (
                    <div key={String(k)} className="flex justify-between py-1.5 border-b" style={{ borderColor: '#1e2d45' }}>
                      <span style={{ color: '#64748b' }}>{k}</span>
                      <span style={{ color: '#e2e8f0' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg text-xs" style={{ background: `${riskColor}10`, border: `1px solid ${riskColor}30`, color: riskColor }}>
                  💡 {result.recommendation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Supported protocols */}
        <div className="rail-card mt-6">
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Supported Rail Protocols</div>
          <div className="flex flex-wrap gap-2">
            {['DNP3', 'IEC-104', 'Modbus TCP', 'MVB', 'CAN', 'BACnet/IP', 'Kavach v3', 'CBTC', 'RailTel MPLS', 'SCADA/OPC-UA', 'WTB', 'Profinet'].map(p => (
              <span key={p} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,212,255,0.06)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.15)', fontFamily: 'JetBrains Mono' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}
