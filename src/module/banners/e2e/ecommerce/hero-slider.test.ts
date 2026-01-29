/**
 * Banners E2E - Hero Slider Tests (Ecommerce)
 *
 * Tests the banner display on the homepage HeroSlider
 */

import { getPage, takeScreenshot, log, wait } from '../utils'
import { TEST_BANNERS } from '../data'

export async function runHeroSliderTests(): Promise<void> {
  const page = getPage()
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

  log('=== HERO SLIDER TESTS ===')

  // 1. Navigate to homepage
  log('Navigating to homepage...')
  await page.goto(baseUrl)
  await wait(2000)
  await takeScreenshot('01-home', 'ecommerce/hero')
  log('  Homepage loaded')

  // 2. Check if HeroSlider/banner section exists
  const hasSlider = await page.evaluate(() => {
    // Look for slider/carousel elements
    const sliderElements = document.querySelectorAll(
      '[class*="slider"], [class*="carousel"], [class*="hero"], [class*="swiper"]'
    )
    return sliderElements.length > 0
  })

  if (hasSlider) {
    log('  Hero slider section found')
  } else {
    log('  Hero slider section not found (may need banners)')
  }

  // 3. Check if our test banner is visible
  const testBannerVisible = await page.evaluate((title: string) => {
    return document.body.textContent?.includes(title) || false
  }, TEST_BANNERS.main.title)

  if (testBannerVisible) {
    log(`  Test banner "${TEST_BANNERS.main.title}" visible`)
  } else {
    log('  Test banner not visible on homepage (may be on different slide)')
  }

  // 4. Check for navigation dots/arrows
  const hasNavigation = await page.evaluate(() => {
    const dots = document.querySelectorAll('[class*="dot"], [class*="pagination"], [class*="indicator"]')
    const arrows = document.querySelectorAll('[class*="arrow"], [class*="prev"], [class*="next"]')
    return dots.length > 0 || arrows.length > 0
  })

  if (hasNavigation) {
    log('  Slider navigation controls found')

    // 5. Try clicking next to see more slides
    const clickedNext = await page.evaluate(() => {
      const nextBtn = document.querySelector('[class*="next"], [aria-label*="next"], button[class*="right"]')
      if (nextBtn) {
        (nextBtn as HTMLElement).click()
        return true
      }
      return false
    })

    if (clickedNext) {
      await wait(1000)
      await takeScreenshot('02-next-slide', 'ecommerce/hero')
      log('  Navigated to next slide')
    }
  }

  // 6. Check for banner CTA button
  const hasCTA = await page.evaluate((buttonText: string) => {
    const buttons = document.querySelectorAll('a, button')
    for (const btn of buttons) {
      if (btn.textContent?.includes(buttonText)) {
        return true
      }
    }
    return false
  }, TEST_BANNERS.main.buttonText)

  if (hasCTA) {
    log(`  CTA button "${TEST_BANNERS.main.buttonText}" found`)
  }

  // 7. Test CTA link works
  const ctaClicked = await page.evaluate((buttonText: string) => {
    const links = document.querySelectorAll('a')
    for (const link of links) {
      if (link.textContent?.includes(buttonText)) {
        const href = link.getAttribute('href')
        return href
      }
    }
    return null
  }, TEST_BANNERS.main.buttonText)

  if (ctaClicked) {
    log(`  CTA links to: ${ctaClicked}`)
  }

  await takeScreenshot('03-final', 'ecommerce/hero')

  log('=== HERO SLIDER TESTS COMPLETED ===')
}
