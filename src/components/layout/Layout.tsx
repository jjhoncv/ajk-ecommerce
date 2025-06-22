import InformationService from '@/services/information'
import PageService from '@/services/pages'

import React from 'react'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const informations = await InformationService.getInformation()
  const pages = await PageService.getPages()

  return (
    <>
      {children}
      <Footer pages={pages} informations={informations} />
    </>
  )
}

export default Layout
