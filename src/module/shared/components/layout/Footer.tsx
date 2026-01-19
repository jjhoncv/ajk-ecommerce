import { Logo } from '@/module/shared/components/ui'
import { siteConfig } from '@/config'
import { ICONS } from '@/module/shared/constants/icons.constants'
import CategoryService from '@/module/categories/services'
import InformationService from '@/module/shared/services/information'
import PageService from '@/module/shared/services/pages'
import Link from 'next/link'
import { type JSX } from 'react'

const Footer = async (): Promise<JSX.Element> => {
  const informations = await InformationService.getInformation()
  const pages = await PageService.getPages()
  const mainCategories = await CategoryService.getMainCategories()

  return (
    <footer className="border-t border-gray-300 bg-white">
      <div className="mx-auto max-w-screen-4xl px-12 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Logo />

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
            <h3 className="mb-4 font-bold text-gray-900">Categorias</h3>
            <ul className="space-y-2">
              {mainCategories.map((category, key) => (
                <li key={key}>
                  <Link
                    href={`/category/${category.id}`}
                    className="text-gray-600 transition-colors duration-300 hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">
              Servicio al cliente
            </h3>
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
            <h3 className="mb-4 font-bold text-gray-900">
              Medios de pago seguros
            </h3>

            {/* <p className="mb-2 text-gray-600">Medios de pago seguros</p> */}
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
