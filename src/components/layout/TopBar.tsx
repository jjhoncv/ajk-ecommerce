import { siteConfig } from "@/config";

export default function TopBar() {
  return (
    <div className="bg-slate-700 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
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
          <select className="bg-transparent border-none text-white">
            <option>Español</option>
            <option>English</option>
          </select>
          <select className="bg-transparent border-none text-white">
            <option>PEN</option>
            <option>USD</option>
          </select>
        </div>
      </div>
    </div>
  );
}
