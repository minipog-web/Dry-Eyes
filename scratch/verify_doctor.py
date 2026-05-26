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

        # Scroll to #physician section, wait for scroll-reveal
        physician = page.locator('#physician')
        physician.scroll_into_view_if_needed()
        time.sleep(1.5)
        
        # Take a screenshot of the #physician section
        physician.screenshot(path='scratch/doctor_profile.png')
        print("Doctor profile section screenshot saved to scratch/doctor_profile.png")

    except Exception as e:
        print(f"Exception: {e}", file=sys.stderr)
    finally:
        browser.close()
