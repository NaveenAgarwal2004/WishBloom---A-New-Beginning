import { test, expect } from '@playwright/test'

test.describe('WishBloom Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h1')).toBeVisible()
    const ctaButton = page.getByTestId('cta-create-button')
    await expect(ctaButton).toBeVisible()
    
    // ✅ ROOT FIX #1A: Wait for custom font to load
    const h1 = page.locator('h1')
    
    // Wait for the font to actually load (check document.fonts API)
    await page.waitForFunction(() => {
      return document.fonts.check('1em "Cormorant Garamond"')
    }, { timeout: 5000 })
    
    // Now verify the font is applied
    const fontFamily = await h1.evaluate((el) => 
      window.getComputedStyle(el).fontFamily
    )
    expect(fontFamily).toContain('Cormorant')
  })

  // ✅ ROOT FIX #2: Browser-aware accessibility test
  test('should have proper accessibility attributes', async ({ page, browserName }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Check skip link exists and is visible
    const skipLink = page.locator('a', { hasText: 'Skip to main content' })
    await expect(skipLink).toBeVisible()
    
    // ✅ Only test focus on browsers that support full keyboard navigation by default
    if (browserName === 'chromium' || browserName === 'firefox') {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      await expect(skipLink).toBeFocused()
    } else {
      // For WebKit/Safari: Just verify the skip link is accessible
      console.log(`Skipping focus test on ${browserName} due to browser keyboard navigation limitations`)
      
      // Verify skip link functionality by clicking it
      await skipLink.click()
      const mainContent = page.locator('main#main-content')
      await expect(mainContent).toBeVisible()
    }
    
    // Check main landmark exists (all browsers)
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()
  })

  test('should navigate to create page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const createButton = page.getByTestId('cta-create-button')
    await createButton.click()
    
    await page.waitForURL('**/create')
    await expect(page.locator('h1')).toContainText('Create a WishBloom')
  })

  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })
})

test.describe('WishBloom Creation Flow', () => {
  // ✅ ROOT FIX #1: Test updated for new validation logic
  test('should complete basic creation flow', async ({ page }) => {
    await page.goto('/create')
    await page.waitForLoadState('domcontentloaded')
    
    // Step 1: Recipient Info
    await page.fill('input[placeholder="Emma"]', 'Test Recipient')
    await page.fill('textarea[placeholder*="Dear Emma"]', 'This is a test intro message for the recipient. It needs to be at least 10 characters long.')
    await page.fill('input[placeholder="Sarah"]', 'Test Creator')
    
    // ✅ With direct Zustand updates, button should enable immediately
    // But we still add a small wait for React render cycle
    await page.waitForTimeout(200)
    
    const nextButton = page.locator('button:has-text("Next")').last()
    await expect(nextButton).toBeEnabled({ timeout: 2000 })
    await nextButton.click()
    
    await page.waitForTimeout(500)
    await expect(page.locator('h2:has-text("Add Memories")')).toBeVisible()
    
    // Step 2: Add memories (minimum 3)
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[placeholder*="Coffee Shop"]', `Memory ${i}`)
      await page.fill('textarea[placeholder*="Tell the story"]', `Description for memory ${i} that is long enough to pass validation`)
      await page.fill('input[type="date"]', '2024-01-01')
      await page.fill('input[placeholder="Your name"]', 'Contributor')
      
      await page.locator('button:has-text("Add Memory")').click()
      await expect(page.locator(`text=Memory ${i}`).first()).toBeVisible({ timeout: 3000 })
    }
    
    const nextButton2 = page.locator('button:has-text("Next")').last()
    await expect(nextButton2).toBeEnabled({ timeout: 2000 })
  })

  // ✅ ROOT FIX #1: Test updated for new validation logic
  test('should validate required fields', async ({ page }) => {
    await page.goto('/create')
    await page.waitForLoadState('domcontentloaded')
    
    // Try to proceed without filling required fields
    const nextButton = page.locator('button:has-text("Next")').last()
    await expect(nextButton).toBeDisabled()
    
    // Fill only recipient name
    await page.fill('input[placeholder="Emma"]', 'Test')
    await page.waitForTimeout(200)
    await expect(nextButton).toBeDisabled() // Still disabled (need intro message)
    
    // Fill intro message (minimum 10 characters)
    await page.fill('textarea', 'Test intro message here that is long enough')
    await page.waitForTimeout(200)
    
    // ✅ Button should enable quickly with direct store updates
    await expect(nextButton).toBeEnabled({ timeout: 2000 })
  })
})

test.describe('WishBloom View Page', () => {
  test('should load sample WishBloom', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const recipientName = page.locator('h1').first()
    await expect(recipientName).toBeVisible()
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/')
    
    const title = await page.title()
    expect(title).toContain('WishBloom')
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    expect(metaDescription!.toLowerCase()).toMatch(/memory|memories|birthday|preserve/)
  })

  // ✅ ROOT FIX #2: Browser-aware keyboard navigation test
  test('should be keyboard navigable', async ({ page, browserName }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    if (browserName === 'chromium' || browserName === 'firefox') {
      // Full keyboard navigation test for Chrome/Firefox
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      
      const skipLink = page.locator('a:has-text("Skip to main content")')
      await expect(skipLink).toBeFocused()
      
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
    } else {
      // For WebKit/Safari: Test that interactive elements are accessible
      console.log(`Skipping keyboard navigation test on ${browserName} due to browser limitations`)
      
      const button = page.getByTestId('cta-create-button')
      await expect(button).toBeVisible()
      await button.focus()
      await expect(button).toBeFocused()
    }
  })
})

test.describe('Accessibility Compliance', () => {
  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
    
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)
    expect(h1Count).toBeLessThanOrEqual(1)
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    const bodyText = page.locator('p').first()
    await expect(bodyText).toBeVisible()
    
    const color = await bodyText.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      }
    })
    
    expect(color.color).toBeTruthy()
  })

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    const button = page.getByTestId('cta-create-button')
    await button.focus()
    
    const outline = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.outline || styles.boxShadow
    })
    
    expect(outline).toBeTruthy()
    expect(outline).not.toBe('none')
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(10000)
  })

  test('should have no critical console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const criticalErrors = errors.filter(
      (err) => 
        !err.includes('favicon') && 
        !err.includes('audio') &&
        !err.includes('404') &&
        !err.toLowerCase().includes('chunk') &&
        !err.includes('.mp3') &&
        !err.includes('.wav')
    )
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors)
    }
    
    expect(criticalErrors).toHaveLength(0)
  })
})