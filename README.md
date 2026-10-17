# Printable Calendar 2027

Free English printable calendar for the year **2027**, with US federal holidays (OPM observed dates). Static HTML/CSS/JS — no backend, no signup, no ads, no analytics.

Built as a practice project to walk through local development → preview → (later) public static hosting.

## Quick start (local preview)

```bash
cd printable-calendar-2027
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/) in your browser.

Any free port works; change `8765` if needed.

## Features

- Year overview + 12 month pages
- Print / Save as PDF via the browser print dialog
- Sunday or Monday week start (saved in `localStorage`)
- Show/hide US federal holiday markers
- Holiday list in HTML (readable without JavaScript)
- About, Privacy, and 404 pages

## Holiday source

US federal holidays for 2027 use **observed** dates from the U.S. Office of Personnel Management:

https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/

Data file: `data/holidays-2027.js`

## Directory structure

```
printable-calendar-2027/
├── index.html              # Year overview + holiday list + how-to
├── january.html … december.html
├── about.html
├── privacy.html
├── 404.html
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── css/styles.css
├── js/calendar.js
├── data/holidays-2027.js
└── README.md
```

## How to edit copy and styles

- **Page text / SEO titles**: edit the corresponding `.html` file.
- **Colors, layout, print rules**: `css/styles.css`.
- **Calendar grid behavior**: `js/calendar.js`.
- **Holiday dates/names**: `data/holidays-2027.js` — also update the static holiday lists in `index.html` and each month page so they stay in sync without JavaScript.

## Deploy

Static files on `main` are set up for GitHub Pages: **Deploy from a branch**, branch `main`, folder `/` (root).

Public URL: https://bndded.github.io/printable-calendar-2027/

`canonical` links and `sitemap.xml` use that URL. `robots.txt` points at the sitemap. Once Pages is enabled, GitHub Pages serves `404.html` for unknown paths. `.nojekyll` keeps Pages from running Jekyll on these static files.

## License / use

Practice indie site. Holiday names and dates follow public OPM schedule information; verify with OPM for official leave decisions.
