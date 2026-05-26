import sys
from playwright.sync_api import sync_playwright

url = 'http://127.0.0.1:8888'

console_logs = []
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    # Set up console log capture
    def handle_console_message(msg):
        console_logs.append(f"[{msg.type}] {msg.text}")
        print(f"Console: [{msg.type}] {msg.text}")

    def handle_page_error(err):
        errors.append(err.message)
        print(f"Error: {err.message}", file=sys.stderr)

    page.on("console", handle_console_message)
    page.on("pageerror", handle_page_error)

    try:
        # Navigate to page
        page.goto(url)
        page.wait_for_load_state('networkidle')
        print("Page loaded successfully.")
        
        # Take screenshot
        page.screenshot(path='scratch/live_screenshot.png', full_page=True)
        print("Screenshot saved to scratch/live_screenshot.png")
    except Exception as e:
        print(f"Exception: {e}", file=sys.stderr)
    finally:
        browser.close()

print(f"\nCaptured {len(console_logs)} console messages.")
print(f"Captured {len(errors)} page errors.")
