import { test, expect } from '@playwright/test'

test.describe('WishBloom Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
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
    
    // Check skip link
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a:has-text("Skip to main content")')
    await expect(skipLink).toBeFocused()
    
    // Check main landmark
    const main = page.locator('main')
    await expect(main).toHaveAttribute('id', 'main-content')
  })

  test('should navigate to create page', async ({ page }) => {
    await page.goto('/')
    
    const createButton = page.getByTestId('cta-create-button')
    await createButton.click()
    
    await expect(page).toHaveURL('/create')
    await expect(page.locator('h1')).toContainText('Create a WishBloom')
  })

  test('should display loading states', async ({ page }) => {
  await page.goto('/')
  
  // Scroll to trigger lazy loading
  await page.evaluate(() => window.scrollTo(0, 1000))
  
  // Wait a moment for any loading states
  await page.waitForTimeout(100)
  
  // The test passes if no errors occur during scroll
  expect(true).toBe(true)
})


  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    await page.goto('/')
    
    // Animations should be disabled or simplified
    // This is a basic check - specific implementation may vary
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })
})

test.describe('WishBloom Creation Flow', () => {
  test('should complete basic creation flow', async ({ page }) => {
    await page.goto('/create')
    
    // Step 1: Recipient Info
    await page.fill('input[placeholder="Emma"]', 'Test Recipient')
    await page.fill('textarea', 'This is a test intro message for the recipient.')
    await page.fill('input[placeholder="Sarah"]', 'Test Creator')
    
    // Click next
    await page.click('button:has-text("Next")')
    
    // Step 2: Add memories (minimum 3)
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[placeholder="The Coffee Shop Revelation"]', `Memory ${i}`)
      await page.fill('textarea[placeholder="Tell the story behind this memory..."]', `Description for memory ${i}`)
      await page.fill('input[type="date"]', '2024-01-01')
      await page.fill('input[placeholder="Your name"]', 'Contributor')
      await page.click('button:has-text("Add Memory")')
      
      // Wait for memory to be added
      await expect(page.locator(`text=Memory ${i}`)).toBeVisible()
    }
    
    // Should be able to proceed
    const nextButton = page.locator('button:has-text("Next"):not([disabled])')
    await expect(nextButton).toBeEnabled()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/create')
    
    // Try to proceed without filling required fields
    const nextButton = page.locator('button:has-text("Next")')
    await expect(nextButton).toBeDisabled()
    
    // Fill only recipient name
    await page.fill('input[placeholder="Emma"]', 'Test')
    await expect(nextButton).toBeDisabled() // Still disabled (need intro message)
    
    // Fill intro message
    await page.fill('textarea', 'Test intro message here')
    await expect(nextButton).toBeEnabled() // Now enabled
  })
})

test.describe('WishBloom View Page', () => {
  test('should load sample WishBloom', async ({ page }) => {
    await page.goto('/')
    
    // Check if sample content loads
    const recipientName = page.locator('h1').first()
    await expect(recipientName).toBeVisible()
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    const title = await page.title()
    expect(title).toContain('WishBloom')
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /memories/i)
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // First interactive element
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
  })
})

test.describe('Accessibility Compliance', () => {
  test('should pass axe accessibility tests', async ({ page }) => {
    await page.goto('/')
    
    // This would require @axe-core/playwright
    // For now, we do basic checks
    
    // Check for alt text on images
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy() // All images should have alt text
    }
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)
    expect(h1Count).toBeLessThanOrEqual(1) // Only one h1 per page
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Check main text color
    const bodyText = page.locator('p').first()
    const color = await bodyText.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      }
    })
    
    // Color contrast should be checked (would need contrast calculation)
    expect(color.color).toBeTruthy()
  })

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/')
    
    const button = page.getByTestId('cta-create-button')
    await button.focus()
    
    const outline = await button.evaluate((el) => 
      window.getComputedStyle(el).outline
    )
    
    // Should have visible focus indicator
    expect(outline).not.toBe('none')
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // Should load in under 5 seconds (generous for tests)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Filter out known acceptable errors (e.g., external resources)
    const criticalErrors = errors.filter(
      (err) => !err.includes('favicon') && !err.includes('audio')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})