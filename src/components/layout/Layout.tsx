import categoryModel from "@/models/Category.model";
import { getHomeData } from "@/services/homeService";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  // Obtener datos necesarios para el layout
  const homeData = await getHomeData();
  const categories = await categoryModel.getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* <TopBar /> */}
      <Header categories={categories || []} />
      {children}
      <Footer
        sections={homeData.footerSections}
        socialLinks={homeData.socialLinks}
      />
    </div>
  );
};

export default Layout;
