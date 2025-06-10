import Layout from "@/components/layout/Layout";
import Categories from "@/components/sections/Categories";
import DailyDeals from "@/components/sections/DailyDeals";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import Features from "@/components/sections/Features";
import HeroSlider from "@/components/sections/HeroSlider";
import Newsletter from "@/components/sections/Newsletter";
import PopularProducts from "@/components/sections/PopularProducts";
import { getHomeData } from "@/services/homeService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechStore - Tu tienda de tecnología y zapatillas",
  description:
    "Encuentra los mejores productos de tecnología y zapatillas en TechStore",
};

export default async function HomePage() {
  const data = await getHomeData();

  console.log({ data })

  return (
    <Layout>
      <HeroSlider slides={data.slides} sideBanners={data.sideBanners} />
      <Features features={data.features} />
      <Categories categories={data.productCategories} />
      <FeaturedCategories categories={data.featuredCategories} />
      <PopularProducts popularProducts={data.popularProducts} />
      <DailyDeals hydratedDeals={data.hydratedDealsOfTheDay} />
      <Newsletter />
    </Layout>
  );
}
