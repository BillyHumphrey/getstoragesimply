# Get Storage Simply

A static, plain-spoken self-storage comparison site for Atlanta and Gwinnett County. The site is **Get Storage Simply**, using `getstoragesimply.com`. The tagline is “Simple, honest storage facts.”

The site is built with [Eleventy](https://www.11ty.dev/) so that a new city or neighborhood guide can be added as a single Markdown file. The output is ordinary HTML, CSS, and a few static files, ready for GitHub Pages.

## Local setup

You need Node.js 20 or later.

```bash
cd storage-site
npm install
npm start
```

That serves the site at [http://localhost:8080](http://localhost:8080).

To write a production build into `_site/`:

```bash
npm run build
```

To rebuild and capture full-page screenshots (uses the machine’s Chrome):

```bash
npm run screenshot
```

Screenshots are written to `screenshots/homepage.png` and `screenshots/lawrenceville-climate-controlled.png`.

## How to add a new page

A typical night of work is one new guide. You do not need to touch the templates unless the new page needs a different layout.

1. Copy an existing guide, or start from this skeleton:

   `src/guides/snellville-ga-climate-controlled.md`

2. Fill in the front matter. The important fields are:

   - `permalink` — a stable, lowercase URL, for example `/guides/climate-controlled-storage-snellville-ga/`
   - `title`, `dek`, and `description` — used for the page and for SEO
   - `updated` — the date you checked the facts, as `YYYY-MM-DD`
   - `city`, `state`, and `topic`
   - `facilities` — a list of facilities, each with `name`, `operator`, `street`, `postal`, `address`, `url`, and the `climate`, `ratePolicy`, and `vehicle` objects used by the comparison table

3. Reuse a key from `src/_data/operators.json` in the `operator` field when the company-wide policy is already recorded there. If you are writing about a new chain, add a short policy entry to that file, with sources and the date you checked them.

4. Write the page body in Markdown. You can drop the comparison table into the article with:

   ```njk
   {% include "partials/facility-table.njk" %}
   ```

5. Cite sources on the page. Do not invent prices. If you show a price, name the source and the date you saw it. If a fact is unconfirmed, say so in the table cell.

6. Run `npm start` and read the page on a phone-width window before you consider it done.

7. Add the new URL to the narrative on the home page if it should be featured. The sitemap picks up new guides automatically.

Static pages (About, disclosure, privacy) live at the top of `src/` as Markdown files with a `permalink`.

### Affiliate placeholders

Affiliate links are not live. Planned partners are SpareFoot (via FlexOffers), Neighbor, and U-Haul. Their slots are defined in `src/_data/affiliates.json` and rendered by `src/_includes/partials/affiliate-cta.njk`.

When a program is approved, paste the real tracking URL into the matching `href` in `affiliates.json`, set `status` to `"live"`, and set `"live": true` at the top of that file. Do not invent a tracking link. The HTML comments and `data-affiliate-status` attributes are there so placeholder slots stay obvious in the code.

## Deploying to GitHub Pages

The production URL in `src/_data/site.json` is `https://getstoragesimply.com`. A `CNAME` file in `src/` is copied into the build as `_site/CNAME`.

A GitHub Actions workflow already lives at `.github/workflows/deploy-pages.yml`. On every push to `main` (and when run manually), it installs dependencies, runs `npm run build`, and deploys the `_site` folder with the official GitHub Pages actions.

To turn it on after the repo is on GitHub:

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.
3. Point the `getstoragesimply.com` domain at GitHub Pages once the name is registered (GitHub will show the DNS records). The workflow will keep publishing the CNAME file.

If the site will instead be served from a project URL such as `https://username.github.io/storage-site/` (no custom domain), set `pathPrefix` in `eleventy.config.js` before you build and remove or skip the CNAME file.

## Brand and domain notes

The chosen name is **Get Storage Simply**, at `getstoragesimply.com`. On November 18, 2026, Verisign RDAP (`https://rdap.verisign.com/com/v1/domain/getstoragesimply.com`) returned HTTP 404, which indicates the domain was not registered at that time.

RDAP 404 is a strong signal that a `.com` is unregistered, not a promise it will still be available when you try to buy it, and not a trademark search.

## Project layout

```
src/
  _data/            site.json, affiliates.json, operators.json
  _includes/        layouts and partials
  assets/css/       styles
  guides/           one Markdown file per local guide
  index.njk         homepage
  about.md
  disclosure.md
  privacy.md
  robots.njk
  sitemap.njk
scripts/            screenshot helper
screenshots/        full-page captures of key pages
.github/workflows/  GitHub Pages deploy workflow
BACKLOG.md          next 30 page ideas, in priority order
```
