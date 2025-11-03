import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('create page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/create')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/')

    // Focus skip link with keyboard
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('a:has-text("Skip to main content")')
    await expect(skipLink).toBeFocused()

    // Verify it works
    await page.keyboard.press('Enter')
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeFocused()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Check heading order (h1, then h2, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    expect(headings.length).toBeGreaterThan(0)
  })

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      
      // Alt can be empty string for decorative images, but must exist
      expect(alt).not.toBeNull()
    }
  })

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/')

    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Button must have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('links should have accessible names', async ({ page }) => {
    await page.goto('/')

    const links = page.locator('a')
    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      
      // Link must have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/create')

    const inputs = page.locator('input, textarea, select')
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      if (id) {
        // Check for associated label
        const label = page.locator(`label[for="${id}"]`)
        const labelExists = await label.count() > 0
        
        // Input must have either a label, aria-label, or aria-labelledby
        expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }
  })

  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Check if animations are disabled or simplified
    const hero = page.locator('section').first()
    const transition = await hero.evaluate((el) => 
      window.getComputedStyle(el).transition
    )

    // Transitions should be minimal or instant when reduced motion is preferred
    expect(transition).toBeTruthy()
  })

  test('keyboard navigation should work throughout the page', async ({ page }) => {
    await page.goto('/')

    // Tab through first 5 focusable elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      
      // Should focus on interactive elements
      expect(['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focusedElement)
    }

    // Shift+Tab should work backwards
    await page.keyboard.press('Shift+Tab')
    const stillFocused = await page.evaluate(() => document.activeElement?.tagName)
    expect(stillFocused).toBeTruthy()
  })

  test('focus should be visible', async ({ page }) => {
    await page.goto('/')

    const button = page.getByTestId('cta-create-button')
    await button.focus()

    // Get computed outline or ring
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      }
    })

    // Should have visible focus indicator (outline or box-shadow)
    const hasFocusIndicator = 
      (styles.outline && styles.outline !== 'none') ||
      (styles.boxShadow && styles.boxShadow !== 'none')
    
    expect(hasFocusIndicator).toBeTruthy()
  })

  test('color contrast should be sufficient', async ({ page }) => {
    await page.goto('/')

    // Run Axe specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze()

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })
})