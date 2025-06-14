import { siteConfig } from "@/config";
import { Clock, MapPin, Monitor } from "lucide-react";
import Link from "next/link";

interface FooterSection {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

interface FooterProps {
  sections: FooterSection[];
  socialLinks: SocialLink[];
}

const Footer = async ({ sections, socialLinks }: FooterProps) => {
  // Aquí podrías hacer fetch de datos adicionales si fuera necesario
  // const additionalData = await fetchAdditionalData();

  return (
    <footer className="bg-white border-t border-gray-300">
      <div className="max-w-screen-4xl mx-auto px-12 py-12">
        <div className="grid grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Monitor className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-gray-600 mb-4">{siteConfig.description}</p>
            <div className="space-y-2 mb-6">
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                {siteConfig.contact.address}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                Atención: Lun-Vie 9:00-20:00
              </p>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center bg-secondary hover:bg-opacity-90"
                  aria-label={link.name}
                  dangerouslySetInnerHTML={{ __html: link.icon }}
                />
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Install App */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Instalar App</h3>
            <p className="text-gray-600 mb-4">Desde App Store o Google Play</p>
            <div className="space-y-3 mb-6">
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
            <p className="text-gray-600 mb-2">Medios de pago seguros</p>
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
        <div className="max-w-screen-4xl mx-auto px-12 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
              reservados
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
  );
};

export default Footer;
