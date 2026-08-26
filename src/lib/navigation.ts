import { Home, Grid, Camera, BarChart2, Menu } from 'lucide-react'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CATALOG: '/catalog',
  ADD_PRODUCT: '/add-product',
  ANALYTICS: '/analytics',
  MORE: '/more',
}

export const BOTTOM_NAV_ITEMS = [
  { label: 'Home', href: ROUTES.DASHBOARD, icon: Home },
  { label: 'Catalog', href: ROUTES.CATALOG, icon: Grid },
  { label: 'Add', href: ROUTES.ADD_PRODUCT, icon: Camera, isPrimary: true },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart2 },
  { label: 'More', href: ROUTES.MORE, icon: Menu },
]
