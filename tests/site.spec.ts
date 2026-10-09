import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { services } from '../src/data/services'
import { buildInquiryMessage, buildWhatsAppUrl, normalizeWhatsAppNumber, validateInquiry } from '../src/lib/whatsapp'

async function fillRequest(page: import('@playwright/test').Page) {
  await page.locator('#inquiry-name').fill('زبون تجريبي')
  await page.locator('#inquiry-device').selectOption('smartphone')
  await page.locator('#inquiry-model').fill('هاتف تجريبي')
  await page.locator('#inquiry-details').fill('الشاشة مكسورة & اللمس ما كيستجبش.')
}
const cards = '.service-card:not(.diagnosis-card)'

test('renders FixLab without script errors, broken imagery or horizontal overflow', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('جهازك تعطّل؟')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator(cards)).toHaveCount(7)
  await expect(page.getByText('YOUR_ADDRESS')).toBeVisible()
  await expect(page.locator('.repair-art')).toHaveJSProperty('complete', true)
  expect(await page.locator('.repair-art').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('filters services and recovers from empty Arabic or French search', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'الهواتف', exact: true }).click()
  await expect(page.locator(cards)).toHaveCount(3)
  await page.getByRole('searchbox', { name: 'البحث عن خدمة' }).fill('not-a-real-service')
  await expect(page.getByRole('heading', { name: 'ما لقيناش خدمة بهاد الاسم.' })).toBeVisible()
  await page.getByRole('button', { name: 'عرض كل الخدمات' }).click()
  await expect(page.locator(cards)).toHaveCount(7)
  await page.getByRole('searchbox', { name: 'البحث عن خدمة' }).fill('ecran')
  await expect(page.locator(cards)).toHaveCount(1)
  await page.getByRole('searchbox', { name: 'البحث عن خدمة' }).fill('بطارية')
  await expect(page.locator(cards)).toHaveCount(1)
})

test('choosing a service populates the device and starting price', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'طلب خدمة: تبديل البطارية' }).click()
  await expect(page.locator('#inquiry-serviceId')).toHaveValue('battery')
  await expect(page.locator('#inquiry-device')).toHaveValue('smartphone')
  await expect(page.locator('.estimate-note strong')).toHaveText('180 MAD')
  await expect(page.locator('#inquiry-name')).toBeFocused()
})

test('validates, prepares and copies a message without contacting an unconfigured number', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('راجع الحقول المشار ليها قبل ما تكمل.')
  await expect(page.locator('#inquiry-name')).toBeFocused()
  await expect(page.locator('#inquiry-name')).toHaveAttribute('aria-invalid', 'true')
  await fillRequest(page)
  let openedPopup = false
  page.on('popup', () => { openedPopup = true })
  await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'الرسالة ديالك واجدة.' })).toBeVisible()
  await expect(page.locator('.inquiry-result')).toBeFocused()
  await expect(page.locator('.inquiry-result pre')).toContainText('الاسم: زبون تجريبي')
  await expect(page.locator('.inquiry-result pre')).toContainText('طريقة التواصل المفضلة: WhatsApp')
  await expect(page.locator('.inquiry-result')).toContainText('ما ترسل حتى طلب')
  await page.getByRole('button', { name: 'نسخ الرسالة', exact: true }).click()
  await expect(page.getByRole('button', { name: 'تم نسخ الرسالة', exact: true })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('هاتف تجريبي')
  expect(openedPopup).toBe(false)
  await page.locator('#inquiry-details').fill('وصف جديد لمشكل مختلف في الجهاز.')
  await expect(page.locator('.inquiry-result')).toHaveCount(0)
})

test('validates callback contact and includes the preferred number', async ({ page }) => {
  await page.goto('/')
  await fillRequest(page)
  await page.getByRole('radio', { name: 'مكالمة هاتفية' }).check()
  await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click()
  await expect(page.locator('#inquiry-contactNumber')).toBeFocused()
  await expect(page.locator('#inquiry-contactNumber')).toHaveAttribute('aria-invalid', 'true')
  await page.locator('#inquiry-contactNumber').fill('+212 000 000 000')
  await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click()
  await expect(page.locator('.inquiry-result pre')).toContainText('طريقة التواصل المفضلة: مكالمة هاتفية')
  await expect(page.locator('.inquiry-result pre')).toContainText('رقم التواصل: +212 000 000 000')
})

test('copy failure preserves the message and explains the manual fallback', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Permission refused')) } }))
  await fillRequest(page)
  await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click()
  await page.getByRole('button', { name: 'نسخ الرسالة', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'النسخ التلقائي ما خدمش' })).toBeVisible()
  await expect(page.locator('.inquiry-result pre')).toContainText('الشاشة مكسورة')
})

test('configured WhatsApp opens the encoded message and provides a popup fallback', async ({ page }) => {
  // Synthetic test number; intercept window.open so no real request is made.
  await page.route('**/src/config/business.ts', async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: (await response.text()).replace('YOUR_WHATSAPP_NUMBER', '212000000000') })
  })
  await page.addInitScript(() => { window.open = url => { document.documentElement.dataset.openedWhatsApp = String(url); return null } })
  await page.goto('/')
  await fillRequest(page)
  await page.getByRole('button', { name: 'نكمل على WhatsApp', exact: true }).click()
  const openedUrl = await page.locator('html').getAttribute('data-opened-whats-app')
  expect(openedUrl).toBeTruthy()
  const url = new URL(openedUrl!)
  expect(url.origin).toBe('https://wa.me')
  expect(url.pathname).toBe('/212000000000')
  expect(url.searchParams.get('text')).toContain('الشاشة مكسورة & اللمس ما كيستجبش.')
  await expect(page.getByRole('link', { name: 'فتح WhatsApp', exact: true })).toHaveAttribute('href', openedUrl!)
  await expect(page.getByRole('link', { name: 'فتح WhatsApp', exact: true })).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(page.locator('.inquiry-result')).toContainText('الطلب ما كيأكدش موعد')
})

test('unconfigured contact button gives a useful way to prepare the request', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'تواصل عبر WhatsApp', exact: true }).click()
  await expect(page.locator('.contact-notice')).toContainText('رقم WhatsApp غير مفعّل حالياً')
  await expect(page.locator('.contact-notice a')).toHaveAttribute('href', '#request')
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0)
})

test('supports FAQ keyboard controls and mobile menu dismissal', async ({ page }, testInfo) => {
  await page.goto('/')
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'فتح القائمة', exact: true }).click()
    await expect(page.getByRole('navigation', { name: 'قائمة الهاتف' })).toBeVisible()
    await page.getByRole('navigation', { name: 'قائمة الهاتف' }).getByRole('link', { name: 'الخدمات', exact: true }).click()
    await expect(page.getByRole('navigation', { name: 'قائمة الهاتف' })).toHaveCount(0)
    await page.getByRole('button', { name: 'فتح القائمة', exact: true }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'فتح القائمة', exact: true })).toBeFocused()
  }
  const question = page.locator('summary').filter({ hasText: 'واش خاصني نوافق على الثمن قبل الإصلاح؟' })
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(question.locator('..')).toHaveAttribute('open', '')
  await page.keyboard.press('Enter')
  await expect(question.locator('..')).not.toHaveAttribute('open', '')
})

test('passes accessibility checks before validation, with errors, and with a prepared message', async ({ page }) => {
  await page.goto('/')
  for (const state of ['initial', 'invalid', 'prepared']) {
    if (state === 'invalid') await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click()
    if (state === 'prepared') { await fillRequest(page); await page.getByRole('button', { name: 'جهّز طلب الإصلاح', exact: true }).click() }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations, state).toEqual([])
  }
})

test('message generation normalizes numbers, preserves Arabic and rejects invalid values', () => {
  const inquiry = { name: ' زبون تجريبي ', device: 'smartphone', model: 'هاتف تجريبي', serviceId: 'screen', details: 'الشاشة مكسورة & اللمس ما كيستجبش.', contactMethod: 'whatsapp', contactNumber: '' }
  expect(validateInquiry(inquiry, services)).toEqual({})
  const message = buildInquiryMessage(inquiry, 'FixLab', services)
  expect(message).toContain('الاسم: زبون تجريبي')
  expect(message).toContain('ابتداءً من 250 MAD')
  expect(message).toContain('يتأكد بعد التشخيص')
  expect(buildWhatsAppUrl('YOUR_WHATSAPP_NUMBER', message)).toBeNull()
  expect(buildWhatsAppUrl('', message)).toBeNull()
  expect(normalizeWhatsAppNumber('000000000000')).toBeNull()
  const url = buildWhatsAppUrl('+212 000 000 000', message)!
  expect(new URL(url).pathname).toBe('/212000000000')
  expect(new URL(url).searchParams.get('text')).toBe(message)
  expect(validateInquiry({ ...inquiry, details: 'short', serviceId: 'unknown' }, services)).toHaveProperty('details')
  expect(validateInquiry({ ...inquiry, name: '<'.repeat(81) }, services)).toHaveProperty('name')
  expect(validateInquiry({ ...inquiry, contactMethod: 'unknown' }, services)).toHaveProperty('contactMethod')
  expect(validateInquiry({ ...inquiry, contactMethod: 'phone', contactNumber: '' }, services)).toHaveProperty('contactNumber')
})
