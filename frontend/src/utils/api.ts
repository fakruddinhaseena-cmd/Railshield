const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchDashboardStats() {
  const res = await fetch(`${API}/api/v1/dashboard/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API}/api/v1/dashboard/summary`)
  if (!res.ok) throw new Error('Failed to fetch summary')
  return res.json()
}

export async function fetchAssets() {
  const res = await fetch(`${API}/api/v1/assets/`)
  if (!res.ok) throw new Error('Failed to fetch assets')
  return res.json()
}

export async function fetchThreats() {
  const res = await fetch(`${API}/api/v1/threats/`)
  if (!res.ok) throw new Error('Failed to fetch threats')
  return res.json()
}

export async function fetchAlerts() {
  const res = await fetch(`${API}/api/v1/alerts/`)
  if (!res.ok) throw new Error('Failed to fetch alerts')
  return res.json()
}

export async function fetchCompliance() {
  const res = await fetch(`${API}/api/v1/compliance/`)
  if (!res.ok) throw new Error('Failed to fetch compliance')
  return res.json()
}

export async function mlPredict(assetId: string, features: number[]) {
  const res = await fetch(`${API}/api/v1/ml/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset_id: assetId, features, window_minutes: 60 }),
  })
  if (!res.ok) throw new Error('Failed to get prediction')
  return res.json()
}
