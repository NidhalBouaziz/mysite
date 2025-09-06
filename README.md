Optimizations and files added

What I changed:
- Added meta description, OG/Twitter meta and canonical links for each HTML page.
- Added JSON-LD person data in `index.html`.
- Added a skip link, nav accessibility attributes and `id="main-content"` for all pages.
- Added preload/preconnect tags for Google Fonts and CSS.
- Implemented lazy-loading for images (`loading="lazy"`).
- Added `site.js` for header hide-on-scroll and mobile hamburger menu.
- Added CSS for skip link and mobile menu.
- Added `sitemap.xml` and `robots.txt`.

Next recommended steps:
1. Compress and convert images to WebP for better performance.
2. Run Lighthouse (Chrome DevTools) and follow suggestions for LCP/CLS.
3. Add structured data for projects if you want project cards in search results.
4. Serve files via HTTPS and set proper caching headers on your server.

How to test locally:
- Open `index.html` in your browser and resize to mobile width to test the hamburger and header hide on scroll.
- Validate structured data using Google Rich Results test.

If you want, I can convert images, add project JSON-LD, and run a local Lighthouse audit and provide a report.
