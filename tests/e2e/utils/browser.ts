import puppeteer, { Browser, Page } from 'puppeteer'
import fs from 'fs'
import path from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots')

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

let browser: Browser | null = null
let page: Page | null = null

export async function initBrowser(): Promise<{ browser: Browser; page: Page }> {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  })
  page = await browser.newPage()

  // Set longer timeout for slow pages
  page.setDefaultTimeout(30000)

  return { browser, page }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
    page = null
  }
}

export function getPage(): Page {
  if (!page) throw new Error('Browser not initialized. Call initBrowser() first.')
  return page
}

export function getBaseUrl(): string {
  return BASE_URL
}

export async function takeScreenshot(name: string, moduleName: string): Promise<string> {
  const p = getPage()
  const moduleDir = path.join(SCREENSHOTS_DIR, moduleName)

  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${name}_${timestamp}.png`
  const filepath = path.join(moduleDir, filename)

  await p.screenshot({ path: filepath, fullPage: true })
  console.log(`  📸 Screenshot: ${moduleName}/${filename}`)

  return filepath
}

export async function goto(url: string): Promise<void> {
  const p = getPage()
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`
  await p.goto(fullUrl, { waitUntil: 'networkidle0' })
}

export async function waitAndClick(selector: string): Promise<void> {
  const p = getPage()
  await p.waitForSelector(selector)
  await p.click(selector)
}

export async function waitAndType(selector: string, text: string): Promise<void> {
  const p = getPage()
  await p.waitForSelector(selector)
  await p.type(selector, text)
}

export async function waitForSelector(selector: string, timeout = 10000): Promise<void> {
  const p = getPage()
  await p.waitForSelector(selector, { timeout })
}

export async function getText(selector: string): Promise<string> {
  const p = getPage()
  await p.waitForSelector(selector)
  return p.$eval(selector, el => el.textContent || '')
}

export async function clearAndType(selector: string, text: string): Promise<void> {
  const p = getPage()
  await p.waitForSelector(selector)
  await p.click(selector, { clickCount: 3 }) // Select all
  await p.type(selector, text)
}

export async function login(email: string, password: string): Promise<void> {
  await goto('/admin')
  await waitAndType('input[name="email"], input[type="email"]', email)
  await waitAndType('input[name="password"], input[type="password"]', password)
  await waitAndClick('button[type="submit"]')
  // Wait for redirect to dashboard
  await new Promise(resolve => setTimeout(resolve, 2000))
}

export async function waitForText(text: string, timeout = 10000): Promise<void> {
  const p = getPage()
  await p.waitForFunction(
    (searchText) => document.body.innerText.includes(searchText),
    { timeout },
    text
  )
}
