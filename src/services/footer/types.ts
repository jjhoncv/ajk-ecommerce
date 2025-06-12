export interface FooterModel {
  sections: {
    title: string
    links: { name: string; href: string }[]
  }[]
  socialLinks: {
    name: string
    icon: string
    href: string
  }[]
}
