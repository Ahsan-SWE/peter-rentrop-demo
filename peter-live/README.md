# Peter Rentrop, MD — Live Website

Production-ready static multi-page site assembled from the supplied page content.

## Pages

- `index.html` — Home
- `about.html` — About
- `portfolio.html` — Portfolio / image gallery
- `resources.html` — Media and resources
- `blog.html` — Filterable demo blog content
- `contact.html` — Client-side validated contact form
- `privacy.html` — Privacy policy
- `404.html` — Not-found page

## Run locally

```bash
npm run dev
```

Open `http://localhost:4173`.

## Validate and build

```bash
npm run check
npm run build
```

The production output is generated in `dist/`. The included `vercel.json` configures the build, clean routes, redirects, and security headers for Vercel deployment.

## Content preservation

The supplied source files are retained in `source-original/`. Main page copy and media references are preserved; only document structure, internal navigation, accessibility attributes, and deployment support were added.

## Contact form

The contact page uses only HTML, CSS, and JavaScript. On submit it validates the fields and opens the visitor's default email application with a prepared message addressed to `contact@peterrentrop.com`. Change the `data-recipient` attribute in `contact.html` if a different destination address is required.

## Navigation and footer

The same responsive navbar and footer are included on every HTML page. On screens up to 860px wide, the navbar switches to an accessible hamburger menu.

The footer includes the copyright text, a dedicated Privacy Policy link, and LinkedIn, Facebook, Instagram, and YouTube icons. The current social URLs point to the platform homepages because profile-specific URLs were not supplied. Replace the four external `href` values in the footer markup with the official profile URLs before launch.
