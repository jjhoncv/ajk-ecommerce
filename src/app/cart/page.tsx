import { CartPageInteractive } from '@/module/cart/components'
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito de Compras | TechStore',
  description: 'Revisa y gestiona los productos en tu carrito de compras'
}

export default function CartPage() {
  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="px-0 py-0">
        <CartPageInteractive />
      </LayoutContent>
    </Layout>
  )
}
