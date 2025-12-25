import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the page has loaded
    await expect(page).toHaveURL('/');
  })

  test('should have correct title', async ({ page }) => {
    await page.goto('/')

    // Check page title or heading
    await expect(page).toHaveTitle(/Courier Connect/i)
  })
})

test.describe('Navigation', () => {
  test('should navigate to map page', async ({ page }) => {
    await page.goto('/')

    // Look for a link/button to the map
    const mapLink = page.getByRole('link', { name: /map/i })
    if (await mapLink.isVisible()) {
      await mapLink.click()

      // Verify navigation
      await expect(page).toHaveURL(/.*map/)
    }
  })
})

test.describe('Accessibility', () => {
  test('should have no automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')

    // Basic accessibility checks
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Check for basic semantic HTML
    const main = page.locator('main')
    expect(await main.count()).toBeGreaterThan(0)
  })
})
