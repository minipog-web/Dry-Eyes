import time
import sys
from playwright.sync_api import sync_playwright

url = 'http://127.0.0.1:8888'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})

    try:
        # Navigate to page
        page.goto(url)
        page.wait_for_load_state('networkidle')
        print("Page loaded.")

        # Scroll to #diagnostics section
        diagnostics = page.locator('#diagnostics')
        diagnostics.scroll_into_view_if_needed()
        time.sleep(1)

        # Click all cards to flip them
        cards = page.locator('.diag-card')
        count = cards.count()
        print(f"Found {count} diagnostic cards. Flipping them...")
        
        for i in range(count):
            cards.nth(i).click()
            
        # Wait for the transition animation to complete (0.6s transition)
        time.sleep(1.5)

        # Take screenshot of the #diagnostics section
        diagnostics.screenshot(path='scratch/flipped_diagnostics.png')
        print("Flipped diagnostics screenshot saved to scratch/flipped_diagnostics.png")

    except Exception as e:
        print(f"Exception: {e}", file=sys.stderr)
    finally:
        browser.close()
