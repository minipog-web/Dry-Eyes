import time
import sys
from playwright.sync_api import sync_playwright

url = 'http://127.0.0.1:8888'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 1000})

    try:
        # Navigate to page
        page.goto(url)
        page.wait_for_load_state('networkidle')
        print("Page loaded.")

        # Scroll to #validation section, wait for animation
        validation = page.locator('#validation')
        validation.scroll_into_view_if_needed()
        time.sleep(1.5)
        validation.screenshot(path='scratch/validation_section.png')
        print("Validation section screenshot saved.")

        # Scroll to #symptoms section, wait for animation
        symptoms = page.locator('#symptoms')
        symptoms.scroll_into_view_if_needed()
        time.sleep(1.5)
        symptoms.screenshot(path='scratch/symptoms_section.png')
        print("Symptoms section screenshot saved.")

    except Exception as e:
        print(f"Exception: {e}", file=sys.stderr)
    finally:
        browser.close()
