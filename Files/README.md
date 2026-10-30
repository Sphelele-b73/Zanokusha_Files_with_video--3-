# Zanokusha Enterprise

Website for Zanokusha Enterprise, a family-owned agricultural business in Ndlangubo, KwaZulu-Natal, South Africa. It supplies fresh spinach, cabbage and maize to communities, supermarkets and food producers.

**Live site:** _add your Netlify / GitHub Pages link here_

## Project structure

```
Files/
├── video/hero-bg.mp4  Muted looping hero background (from your upload)
├── index.html      Home (hero, previews, photo gallery with lightbox)
├── about.html      History + tabbed Mission / Vision / Values
├── product.html    Searchable, filterable, sortable product list with detail modal
├── contact.html    Contact details, Google Maps embed, validated message form (builds an email)
├── enquiry.html    Validated enquiry form (AJAX) with instant cost/availability response, FAQ accordion
├── style.css       Shared styles and responsive layout
├── script.js       All JavaScript (see below)
├── robots.txt      Crawler instructions
├── sitemap.xml     Sitemap
├── _headers        Security + caching headers (Netlify)
└── images/         Optimised images with descriptive file names
```

## Part 3 features

**JavaScript**
- Interactive elements: tabs (about), accordion (FAQ), modal (product details), gallery with lightbox (home; arrow keys and Esc supported).
- Interactive map: Google Maps embed on the contact page (searches the street address, no API key needed).
- Animations: CSS fade-in on the hero, scroll-reveal on sections, accordion/tab transitions. All switched off for users who prefer reduced motion.
- Dynamic content: products are built in the DOM from a JavaScript data array, with search, category filter and sort.

**Forms**
- `enquiry.html`: validated with HTML5 attributes plus JavaScript (South African phone format, email, quantity range, future delivery date). On success it sends the data asynchronously with `fetch` (AJAX) and shows the visitor a response with estimated cost, availability and minimum order.
- `contact.html`: validated, then compiles the details into an email to `info@zanokushaenterprise.co.za` (set in `CONFIG.EMAIL` in `script.js`) that the visitor sends from their email app.
- Inline error messages, focus moves to the first error, honeypot field against spam bots.

**SEO**
- Keywords researched and used in titles, headings and copy: *fresh vegetables KwaZulu-Natal*, *bulk spinach supplier*, *cabbage wholesale South Africa*, *maize supplier Empangeni*, *farm produce Empangeni*.
- Unique title tag and meta description on every page, one `h1` per page with logical `h2`/`h3` order.
- Descriptive image file names and alt text, lazy loading, width/height set to avoid layout shift.
- Clean lowercase URLs, internal links between pages, mobile-friendly responsive design.
- `robots.txt`, `sitemap.xml`, canonical URLs, Open Graph tags and LocalBusiness structured data (JSON-LD).
- Off-page plan: list the business on Google Business Profile (local SEO), share on Facebook/Instagram, request links from local supermarkets, municipality and agricultural associations.

**Performance and security**
- Images reduced from about 4 MB to about 620 KB; one shared stylesheet and one deferred script.
- Content Security Policy, referrer policy, `rel="noopener noreferrer"` on external links, output written with `textContent` (no `innerHTML`), security headers in `_headers`.

## Setup notes
- Prices, minimum orders and seasons in `script.js` (`PRODUCTS`) are placeholders. Replace them with real figures.
- To receive enquiries by email, create a free form at formspree.io and paste the URL into `CONFIG.ENDPOINT`. While it is empty the form runs in demo mode.
- Update `BASE` URLs in `sitemap.xml`, `robots.txt` and the canonical tags once the live address is known.
- Adjust `CONFIG.MAP` to the exact farm coordinates.

## Changelog
- **Part 3**
  - Added `script.js`: tabs, accordion, modal, lightbox, dynamic product list, Google Maps embed, form validation, AJAX enquiry, email builder.
  - Rebuilt `enquiry.html` and `contact.html` forms (the contact form still had membership/donation options from a template).
  - Added SEO: meta tags, canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`.
  - Fixed broken image paths (backslashes and wrong folder), missing images (Spinach, Green cabbage, Farm location) and renamed `Index.html` to `index.html` so hosting finds it.
  - Fixed accessibility: low-contrast gold text on green, 35px body text, multiple `h1` per page, skip link, visible focus, keyboard support, mobile menu button.
  - Optimised and renamed images; added security headers.
  - Replaced the Google Maps iframe (placeholder coordinates) with Leaflet.
- **Part 2** - _add your feedback edits from Part 2 here._
- **Part 1** - Initial five-page site with navigation, products, about, contact and enquiry pages.

## References
- Leaflet. (2023). *Leaflet 1.9.4 documentation*. https://leafletjs.com
- OpenStreetMap contributors. https://www.openstreetmap.org/copyright
- MDN Web Docs. *Fetch API*, *Constraint validation*, *Content Security Policy*, *ARIA tab / dialog patterns*. https://developer.mozilla.org
- W3C. *WAI-ARIA Authoring Practices Guide*. https://www.w3.org/WAI/ARIA/apg/
- Google. *Search Central: SEO starter guide*. https://developers.google.com/search/docs
- Formspree. *Documentation*. https://help.formspree.io
- Images: add the sources/licences of your photos here.
