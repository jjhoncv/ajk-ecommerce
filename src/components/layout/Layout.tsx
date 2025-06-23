import React from 'react'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}

export default Layout
