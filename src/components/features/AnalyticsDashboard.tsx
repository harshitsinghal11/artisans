'use client'

import { Card, CardContent, CardHeader } from "@/src/components/ui/Card"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { useState, useEffect } from 'react'

interface Product {
  id: string
  category: string
  suggested_price: number
}

interface AnalyticsDashboardProps {
  products: Product[]
  t: any // dictionary
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308']

export function AnalyticsDashboard({ products, t }: AnalyticsDashboardProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null // Prevent hydration errors with Recharts

  // 1. Calculate total catalog value
  const totalValue = products.reduce((sum, p) => sum + (p.suggested_price || 0), 0)

  // 2. Data for Items by Category (Pie Chart)
  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }))

  // 3. Mock Views Data (Bar Chart) - Simulate engagement based on product count
  const mockViewsData = [
    { name: 'Mon', views: products.length * 5 },
    { name: 'Tue', views: products.length * 8 },
    { name: 'Wed', views: products.length * 12 },
    { name: 'Thu', views: products.length * 7 },
    { name: 'Fri', views: products.length * 15 },
    { name: 'Sat', views: products.length * 20 },
    { name: 'Sun', views: products.length * 18 },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/10">
        <CardHeader className="pb-2">
          <h3 className="font-medium text-foreground">Total Catalog Value</h3>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">₹{totalValue.toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Mock Views Chart */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-foreground">Weekly Views (Estimated)</h3>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockViewsData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-foreground">Products by Category</h3>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No products yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
