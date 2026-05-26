import time
import sys
from playwright.sync_api import sync_playwright

url = 'http://127.0.0.1:8888'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 1200})

    try:
        # Navigate to page
        page.goto(url)
        page.wait_for_load_state('networkidle')
        print("Page loaded.")

        # Scroll to #treatments section, wait for scroll-reveal
        treatments = page.locator('#treatments')
        treatments.scroll_into_view_if_needed()
        time.sleep(1.5)
        
        # Verify default medication card (Restasis) is visible and active
        print("Verifying default medication card (Restasis)...")
        restasis = page.locator('#treatment-restasis')
        assert restasis.is_visible(), "Restasis card should be visible by default"
        
        # Verify default procedure card (Punctal Plugs) is visible and active
        print("Verifying default procedure card (Punctal Plugs)...")
        plugs = page.locator('#treatment-plugs')
        assert plugs.is_visible(), "Punctal Plugs card should be visible by default"
        
        # Select Xiidra from medications dropdown
        print("Selecting Xiidra (xiidra) from medications select dropdown...")
        med_select = page.locator('#medication-select')
        med_select.select_option('xiidra')
        time.sleep(1.0) # Wait for transition
        
        # Verify Restasis card is hidden and Xiidra card is visible
        xiidra = page.locator('#treatment-xiidra')
        assert xiidra.is_visible(), "Xiidra card should be visible after selection"
        assert not restasis.is_visible(), "Restasis card should be hidden"
        
        # Select LipiFlow from procedures dropdown
        print("Selecting LipiFlow (lipiflow) from procedures select dropdown...")
        proc_select = page.locator('#procedure-select')
        proc_select.select_option('lipiflow')
        time.sleep(1.0)
        
        # Verify Plugs card is hidden and LipiFlow card is visible
        lipiflow = page.locator('#treatment-lipiflow')
        assert lipiflow.is_visible(), "LipiFlow card should be visible after selection"
        assert not plugs.is_visible(), "Punctal Plugs card should be hidden"
        
        # Take a screenshot of the treatments section with both active selections
        treatments.screenshot(path='scratch/treatments_dropdown.png')
        print("Treatments section screenshot with Xiidra and LipiFlow active saved to scratch/treatments_dropdown.png")

        print("All test assertions passed successfully!")

    except Exception as e:
        print(f"Exception: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        browser.close()
