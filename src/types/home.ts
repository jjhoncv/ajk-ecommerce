export interface HomeData {
  // Footer
  footerSections: {
    title: string
    links: {
      name: string
      href: string
    }[]
  }[]

  // Social links
  socialLinks: {
    name: string
    icon: string
    href: string
  }[]
}
