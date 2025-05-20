import { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import HeroSlider from "@/components/sections/HeroSlider";
import Features from "@/components/sections/Features";
import Categories from "@/components/sections/Categories";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import PopularProducts from "@/components/sections/PopularProducts";
import DailyDeals from "@/components/sections/DailyDeals";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/layout/Footer";
import { getHomeData } from "@/services/homeService";

export const metadata: Metadata = {
  title: "TechStore - Tu tienda de tecnología y zapatillas",
  description:
    "Encuentra los mejores productos de tecnología y zapatillas en TechStore",
};

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header megaMenuCategories={data.megaMenuCategories} />
      <HeroSlider slides={data.slides} sideBanners={data.sideBanners} />
      <Features features={data.features} />
      <Categories categories={data.productCategories} />
      <FeaturedCategories categories={data.featuredCategories} />
      <PopularProducts products={data.popularProducts} />
      <DailyDeals deals={data.dealsOfTheDay} />
      <Newsletter />
      <Footer sections={data.footerSections} socialLinks={data.socialLinks} />
    </div>
  );
}
