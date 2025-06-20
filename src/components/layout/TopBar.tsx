import { siteConfig } from '@/config'

export default function TopBar() {
  return (
    <div className="bg-slate-700 py-2 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:underline">
            Sobre Nosotros
          </a>
          <a href="#" className="hover:underline">
            Mi Cuenta
          </a>
          <a href="#" className="hover:underline">
            Wishlist
          </a>
          <a href="#" className="hover:underline">
            Rastrear Pedido
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span>Necesitas ayuda? Llama: {siteConfig.contact.phone}</span>
          <select className="border-none bg-transparent text-white">
            <option>Español</option>
            <option>English</option>
          </select>
          <select className="border-none bg-transparent text-white">
            <option>PEN</option>
            <option>USD</option>
          </select>
        </div>
      </div>
    </div>
  )
}
