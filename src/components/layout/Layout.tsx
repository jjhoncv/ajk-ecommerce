import { getFooter } from "@/services/footer";
import { getHeader } from "@/services/header";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const categories = await getHeader();
  const footer = await getFooter();

  return (
    <div className="min-h-screen bg-white transition-all duration-300 ease-in-out" id="content-page">
      <Header categories={categories || []} />
      {children}
      <Footer
        sections={footer.sections}
        socialLinks={footer.socialLinks}
      />
    </div>
  );
};

export default Layout;
