export interface FooterModel {
  sections: Array<{
    title: string
    links: Array<{ name: string, href: string }>
  }>
  socialLinks: Array<{
    name: string
    icon: string
    href: string
  }>
}
