import asyncio
from playwright.async_api import async_playwright, expect
import time

async def main():
    # Start the Spring Boot application
    process = await asyncio.create_subprocess_exec(
        'mvn', 'spring-boot:run',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    print("Waiting for application to start...")
    await asyncio.sleep(30)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            print("Navigating to index.html, expecting redirect to login.html")
            await page.goto("http://localhost:8080/index.html")
            await expect(page).to_have_url("http://localhost:8080/login.html")

            print("Entering credentials and logging in...")
            await page.fill("#username", "vipin")
            await page.fill("#password", "password")
            await page.click("button[type=submit]")

            print("Waiting for redirection to index.html and claims to load...")
            await expect(page).to_have_url("http://localhost:8080/index.html")
            await expect(page.locator("#claims-table tbody tr")).to_have_count(5, timeout=10000)

            print("Logging out...")
            await page.click("#logout-btn")

            print("Waiting for redirection to login.html...")
            await expect(page).to_have_url("http://localhost:8080/login.html")

            print("Taking screenshot...")
            await page.screenshot(path="jules-scratch/verification/login_verification.png")

            await browser.close()
            print("Verification successful!")

    finally:
        print("Terminating application...")
        process.terminate()
        await process.wait()
        print("Application terminated.")

if __name__ == '__main__':
    asyncio.run(main())
