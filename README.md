# Healix

Marketing website for Healix — practical automation and AI for small practices,
academics, and professionals.

Static site: plain HTML, CSS, and a small amount of vanilla JavaScript. No build
step and no dependencies beyond two Google Fonts.

## Structure

```
index.html        Home
services.html     Services (with pricing)
about.html        About / founding story
contact.html      Contact + booking form
css/styles.css    Shared stylesheet (design tokens + all page styles)
js/form.js        Nav toggle, footer year, contact-detail config, form submission
assets/           SVG illustrations
```

## Editing contact details

Open `js/form.js` and edit the `SITE` config block at the top:

- `phone` — fills every phone slot on every page.
- `email` — fills every email slot and `mailto:` link.
- `formAccessKey` — your free Web3Forms access key (https://web3forms.com).
  Until this is set, the contact form shows the confirmation state but does
  not send email.

## Running locally

Open `index.html` directly in a browser, or serve the folder with any static
server.

## Hosting

Deployed as a static site on GitHub Pages.
