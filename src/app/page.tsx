import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import HeroSlider from "@/components/sections/HeroSlider";
import Features from "@/components/sections/Features";
import Categories from "@/components/sections/Categories";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import Newsletter from "@/components/sections/Newsletter";
import { getHomeData } from "@/services/homeService";
import PopularProducts from "@/components/sections/PopularProducts";
import DailyDeals from "@/components/sections/DailyDeals";

export const metadata: Metadata = {
  title: "TechStore - Tu tienda de tecnología y zapatillas",
  description:
    "Encuentra los mejores productos de tecnología y zapatillas en TechStore",
};

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <Layout>
      <HeroSlider slides={data.slides} sideBanners={data.sideBanners} />
      <Features features={data.features} />
      <Categories categories={data.productCategories} />
      <FeaturedCategories categories={data.featuredCategories} />
      <PopularProducts hydratedProducts={data.hydratedPopularProducts} />
      <DailyDeals hydratedDeals={data.hydratedDealsOfTheDay} />
      <Newsletter />
    </Layout>
  );
}
