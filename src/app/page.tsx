import Layout from "@/components/layout/Layout";
import Categories from "@/components/sections/Categories";
import DailyDeals from "@/components/sections/DailyDeals";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import Features from "@/components/sections/Features";
import HeroSlider from "@/components/sections/HeroSlider";
import Newsletter from "@/components/sections/Newsletter";
import PopularProducts from "@/components/sections/PopularProducts";

// services
import { getBanner } from "@/services/banner";
import { getDealsProducts } from "@/services/dealsProducts";
import { getFeaturedCategories } from "@/services/featuredCategories";
import { getFeatures } from "@/services/features/features";
import { getHero } from "@/services/hero";
import { getMainCategories } from "@/services/mainCategories";
import { getPopularProducts } from "@/services/popularProducts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechStore - Tu tienda de tecnología y zapatillas",
  description:
    "Encuentra los mejores productos de tecnología y zapatillas en TechStore",
};

export default async function HomePage() {
  const mainCategories = await getMainCategories()
  const popularProducts = await getPopularProducts()
  const dealsProducts = await getDealsProducts()
  const hero = await getHero()
  const banners = await getBanner()
  const features = await getFeatures()
  const featureCategories = await getFeaturedCategories()

  return (
    <Layout>
      <HeroSlider slides={hero} sideBanners={banners} />
      <Features features={features} />
      <Categories categories={mainCategories} />
      <FeaturedCategories categories={featureCategories} />
      <PopularProducts products={popularProducts} />
      <DailyDeals products={dealsProducts} />
      <Newsletter />
    </Layout>
  );
}
