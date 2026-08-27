import { Home, Grid, Camera, Activity, Menu } from 'lucide-react'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CATALOG: '/catalog',
  ADD_PRODUCT: '/add-product',
  FEED: '/feed',
  MORE: '/more',
}

export const BOTTOM_NAV_ITEMS = [
  { label: 'Home', href: ROUTES.DASHBOARD, icon: Home },
  { label: 'Catalog', href: ROUTES.CATALOG, icon: Grid },
  { label: 'Add', href: ROUTES.ADD_PRODUCT, icon: Camera, isPrimary: true },
  { label: 'Feed', href: ROUTES.FEED, icon: Activity },
  { label: 'More', href: ROUTES.MORE, icon: Menu },
]
