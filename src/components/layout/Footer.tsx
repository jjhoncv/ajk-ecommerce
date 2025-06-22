import ClientAuthButton from '@/components/ui/ClientAuthButton'
import { siteConfig } from '@/config'
import { ICONS } from '@/constants/icons.constants'
import { authOptions } from '@/lib/auth'
import { Monitor } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { type JSX } from 'react'

interface Page {
  name: string
  href: string
}
interface Information {
  description: string
  icon: string
}

interface FooterProps {
  pages: Page[]
  informations: Information[]
}

const Footer = async ({
  pages,
  informations
}: FooterProps): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions)
  const isAuthenticated = session !== null
  const user = session?.user

  return (
    <footer className="border-t border-gray-300 bg-white">
      <div className="mx-auto max-w-screen-4xl px-12 py-12">
        <div className="grid grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Monitor className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mb-4 text-gray-600">{siteConfig.description}</p>

            <div className="mb-6 space-y-2">
              {informations.map((information, index) => (
                <p
                  key={index}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <span
                    className="h-4 w-4"
                    dangerouslySetInnerHTML={{ __html: information.icon }}
                  />
                  {information.description}
                </p>
              ))}
            </div>

            <div className="flex gap-4">
              {siteConfig.socials.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white hover:bg-opacity-90"
                  aria-label={link.name}
                  dangerouslySetInnerHTML={{ __html: ICONS[link.type] }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Compañía</h3>
            <ul className="space-y-2">
              {pages.map((page, key) => (
                <li key={key}>
                  <Link
                    href={page.href}
                    className="text-gray-600 transition-colors duration-300 hover:text-primary"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Mi Cuenta</h3>
            <ul className="space-y-2">
              {isAuthenticated ? (
                [
                  { name: 'Mi cuenta', href: '/account' },
                  { name: 'Ver Carrito', href: '/carrito' },
                  { name: 'Mi Lista de Deseos', href: '/wishlist' },
                  { name: 'Rastrear mi Pedido', href: '/tracking' },
                  { name: 'Ayuda', href: '/ayuda' },

                  { name: 'Mis Pedidos', href: '/pedidos' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 transition-colors duration-300 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <ClientAuthButton
                    initialIsAuthenticated={isAuthenticated}
                    initialUserName={user?.name ?? ''}
                    initialUserEmail={user?.email ?? ''}
                    initialUserId={user?.id ?? ''}
                    variant="footer"
                  />
                </li>
              )}
            </ul>
          </div>

          {/* Install App */}
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Instalar App</h3>
            <p className="mb-4 text-gray-600">Desde App Store o Google Play</p>
            <div className="mb-6 space-y-3">
              <a href="#" className="block">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a href="#" className="block">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
            </div>
            <p className="mb-2 text-gray-600">Medios de pago seguros</p>
            <div className="flex gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                alt="Mastercard"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-gray-300">
        <div className="mx-auto max-w-screen-4xl px-12 py-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-gray-600 md:mb-0">
              © {new Date().getFullYear()} {siteConfig.name}. Todos los
              derechos reservados
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Línea de atención: {siteConfig.contact.phone}
              </p>
              <p className="text-gray-600">Soporte 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
