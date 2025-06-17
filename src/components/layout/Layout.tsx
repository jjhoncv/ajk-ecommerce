import { getFooter } from "@/services/footer";
import React from "react";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const footer = await getFooter();

  return (
    <>
      {children}
      <Footer
        sections={footer.sections}
        socialLinks={footer.socialLinks}
      />
    </>
  );
};

export default Layout;
