import Header from '@/components/layout/Header'
import Layout from '@/components/layout/Layout'
import { LayoutContent } from '@/components/layout/LayoutContent'
import DailyDeals from '@/components/sections/DailyDeals'
import Features from '@/components/sections/Features'
import Newsletter from '@/components/sections/Newsletter'
import PopularProducts from '@/components/sections/PopularProducts'
import Navigation from '@/components/ui/Navigation/Navigation'
import HeroSlider from '@/module/banners/components/HeroSlider'
import BannerService from '@/module/banners/service/banner'
import Categories from '@/module/categories/Categories'
import FeaturedCategories from '@/module/categories/FeaturedCategories'

// services
import CategoryService from '@/services/categories'
import { getDealsProducts } from '@/services/dealsProducts'
import { getFeaturedCategories } from '@/services/featuredCategories'
import { getFeatures } from '@/services/features/features'
import { getPopularProducts } from '@/services/popularProducts'
import PromotionService from '@/services/promotion'
import { type Metadata } from 'next'
import { type JSX } from 'react'

export const metadata: Metadata = {
  title: 'TechStore - Tu tienda de tecnología y zapatillas',
  description:
    'Encuentra los mejores productos de tecnología y zapatillas en TechStore'
}

export default async function HomePage(): Promise<JSX.Element> {
  const mainCategories = await CategoryService.getMainCategories()
  const popularProducts = await getPopularProducts()
  const dealsProducts = await getDealsProducts()
  const banners = await BannerService.getBanners()
  const features = await getFeatures()
  const featureCategories = await getFeaturedCategories()
  const sideBanners = await PromotionService.getBanners()

  return (
    <Layout>
      <Header>
        <Navigation />
      </Header>
      <LayoutContent className="px-0 py-0">
        <HeroSlider slides={banners} sideBanners={sideBanners} />
        <Features features={features} />
        <Categories categories={mainCategories} />
        <FeaturedCategories categories={featureCategories} />
        <PopularProducts products={popularProducts} />
        <DailyDeals products={dealsProducts} />
        <Newsletter />
      </LayoutContent>
    </Layout>
  )
}
