interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: 'accent' | 'green' | 'red' | 'amber'
  icon?: string
}

const colorMap = {
  accent: '#00d4ff',
  green:  '#00ff88',
  red:    '#ff3b3b',
  amber:  '#ffaa00',
}

export default function StatCard({ label, value, sub, color = 'accent', icon }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className="rail-card flex flex-col gap-2"
      style={{ borderLeft: `3px solid ${c}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest" style={{ color: '#64748b' }}>{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-3xl font-bold" style={{ color: c, fontFamily: 'Orbitron, sans-serif' }}>
        {value}
      </div>
      {sub && <div className="text-xs" style={{ color: '#64748b' }}>{sub}</div>}
    </div>
  )
}
