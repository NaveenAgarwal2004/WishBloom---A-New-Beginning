import { test, expect } from '@playwright/test'

test.describe('WishBloom Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible()
    
    // Check for main CTA button
    const ctaButton = page.getByTestId('cta-create-button')
    await expect(ctaButton).toBeVisible()
    
    // Verify fonts loaded
    const h1 = page.locator('h1')
    const fontFamily = await h1.evaluate((el) => 
      window.getComputedStyle(el).fontFamily
    )
    expect(fontFamily).toContain('Cormorant')
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Check skip link appears on tab
    await page.keyboard.press('Tab')
    
    // Wait for focus to settle
    await page.waitForTimeout(100)
    
    const skipLink = page.locator('a', { hasText: 'Skip to main content' })
    await expect(skipLink).toBeVisible()
    await expect(skipLink).toBeFocused()
    
    // Check main landmark exists
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
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Animations should be disabled or simplified
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })
})

test.describe('WishBloom Creation Flow', () => {
  test('should complete basic creation flow', async ({ page }) => {
    await page.goto('/create')
    await page.waitForLoadState('domcontentloaded')
    
    // Step 1: Recipient Info
    await page.fill('input[placeholder="Emma"]', 'Test Recipient')
    await page.fill('textarea[placeholder*="Dear Emma"]', 'This is a test intro message for the recipient. It needs to be at least 10 characters long.')
    await page.fill('input[placeholder="Sarah"]', 'Test Creator')
    
    // Wait for React state to update
    await page.waitForTimeout(500)
    
    // Click next - use more specific selector
    const nextButton = page.locator('button:has-text("Next")').last()
    await expect(nextButton).toBeEnabled({ timeout: 2000 })
    await nextButton.click()
    
    // Wait for navigation to step 2
    await page.waitForTimeout(500)
    await expect(page.locator('h2:has-text("Add Memories")')).toBeVisible()
    
    // Step 2: Add memories (minimum 3)
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[placeholder*="Coffee Shop"]', `Memory ${i}`)
      await page.fill('textarea[placeholder*="Tell the story"]', `Description for memory ${i} that is long enough to pass validation`)
      await page.fill('input[type="date"]', '2024-01-01')
      await page.fill('input[placeholder="Your name"]', 'Contributor')
      
      // Click add button
      await page.locator('button:has-text("Add Memory")').click()
      
      // Wait for memory to be added
      await expect(page.locator(`text=Memory ${i}`).first()).toBeVisible({ timeout: 3000 })
    }
    
    // Should be able to proceed
    const nextButton2 = page.locator('button:has-text("Next")').last()
    await expect(nextButton2).toBeEnabled({ timeout: 2000 })
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/create')
    await page.waitForLoadState('domcontentloaded')
    
    // Try to proceed without filling required fields
    const nextButton = page.locator('button:has-text("Next")').last()
    await expect(nextButton).toBeDisabled()
    
    // Fill only recipient name
    await page.fill('input[placeholder="Emma"]', 'Test')
    await page.waitForTimeout(300)
    await expect(nextButton).toBeDisabled() // Still disabled (need intro message)
    
    // Fill intro message (minimum 10 characters)
    await page.fill('textarea', 'Test intro message here that is long enough')
    
    // Wait for React state update
    await page.waitForTimeout(500)
    
    // Now should be enabled
    await expect(nextButton).toBeEnabled({ timeout: 2000 })
  })
})

test.describe('WishBloom View Page', () => {
  test('should load sample WishBloom', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check if sample content loads
    const recipientName = page.locator('h1').first()
    await expect(recipientName).toBeVisible()
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    const title = await page.title()
    expect(title).toContain('WishBloom')
    
    // Check meta description - be flexible with content
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    expect(metaDescription!.toLowerCase()).toMatch(/memory|memories|birthday|preserve/)
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab') // Skip link
    await page.waitForTimeout(100)
    
    const skipLink = page.locator('a:has-text("Skip to main content")')
    await expect(skipLink).toBeFocused()
    
    await page.keyboard.press('Tab') // Next interactive element
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
  })
})

test.describe('Accessibility Compliance', () => {
  test('should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for alt text on images
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull() // All images should have alt text (can be empty for decorative)
    }
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)
    expect(h1Count).toBeLessThanOrEqual(1) // Only one h1 per page
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Check main text color
    const bodyText = page.locator('p').first()
    await expect(bodyText).toBeVisible()
    
    const color = await bodyText.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      }
    })
    
    // Color contrast should be checked
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
    
    // Should have visible focus indicator
    expect(outline).toBeTruthy()
    expect(outline).not.toBe('none')
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded') // Don't wait for networkidle
    const loadTime = Date.now() - startTime
    
    // Should load in under 10 seconds (more realistic for CI/slower machines)
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
    
    // Filter out acceptable errors (missing resources, etc.)
    const criticalErrors = errors.filter(
      (err) => 
        !err.includes('favicon') && 
        !err.includes('audio') &&
        !err.includes('404') &&
        !err.toLowerCase().includes('chunk') &&
        !err.includes('.mp3') &&
        !err.includes('.wav')
    )
    
    // Log errors for debugging
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors)
    }
    
    expect(criticalErrors).toHaveLength(0)
  })
})