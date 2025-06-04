import React from "react";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";
import { getHomeData } from "@/services/homeService";
import CategoryModel from "@/models/CategoryModel";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  // Obtener datos necesarios para el layout
  const homeData = await getHomeData();
  const categories = await CategoryModel.getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* <TopBar /> */}
      <Header categories={categories} />
      {children}
      <Footer
        sections={homeData.footerSections}
        socialLinks={homeData.socialLinks}
      />
    </div>
  );
};

export default Layout;
