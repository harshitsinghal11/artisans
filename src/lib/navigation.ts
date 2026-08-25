import { Home, Grid, Camera, MessageCircle, Menu } from 'lucide-react'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CATALOG: '/dashboard/catalog',
  ADD_PRODUCT: '/dashboard/add-product',
  INQUIRIES: '/dashboard/inquiries',
  MORE: '/dashboard/more',
}

export const BOTTOM_NAV_ITEMS = [
  { label: 'Home', href: ROUTES.DASHBOARD, icon: Home },
  { label: 'Catalog', href: ROUTES.CATALOG, icon: Grid },
  { label: 'Add', href: ROUTES.ADD_PRODUCT, icon: Camera, isPrimary: true },
  { label: 'Inquiries', href: ROUTES.INQUIRIES, icon: MessageCircle },
  { label: 'More', href: ROUTES.MORE, icon: Menu },
]
