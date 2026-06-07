'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface FloatBarChartProps {
  data: { name: string; floatDays: number; color: string }[]
}

export function FloatBarChart({ data }: FloatBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [`${value} hari`, 'Float Days']}
          contentStyle={{ borderRadius: '8px', fontSize: 12 }}
        />
        <Bar dataKey="floatDays" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
