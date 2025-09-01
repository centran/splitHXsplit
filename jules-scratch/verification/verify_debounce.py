from playwright.sync_api import sync_playwright, expect
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:3000")

            # Add words
            page.get_by_label("Add words (comma-separated):").fill("apple, banana, cherry, date, elderberry, fig, grape")
            page.get_by_role("button", name="Add Words").click()

            # Start the picker
            page.get_by_role("button", name="GO").click()

            # Wait for the first word to appear
            expect(page.locator("#random-word")).not_to_be_empty()

            # Click skip button multiple times
            skip_button = page.get_by_role("button", name="SKIP")
            skip_button.click(force=True, no_wait_after=True)
            skip_button.click(force=True, no_wait_after=True)
            skip_button.click(force=True, no_wait_after=True)

            time.sleep(0.5) # Wait for debounce timer to reset

            # Click pause/play button multiple times
            pause_button = page.get_by_role("button", name="PAUSE")
            pause_button.click(force=True, no_wait_after=True)
            page.get_by_role("button", name="PLAY").click(force=True, no_wait_after=True)
            page.get_by_role("button", name="PAUSE").click(force=True, no_wait_after=True)

            # Take a screenshot
            page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    main()
