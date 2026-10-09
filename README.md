# FixLab — Moroccan computer and phone repair website

A responsive Arabic/Darija repair-shop website built with the existing **React + Vite + TypeScript** project. The original project architecture, scripts, npm lockfile, and browser-testing setup are preserved. Original navy/blue CSS, RTL layout, locally served Arabic/French-friendly fonts, and an original workshop image give FixLab its own identity.

## Install and run

Use **Node.js 22.12 or later**; Node.js 24 is recommended (`.nvmrc`). From the project directory:

```sh
cd /workspace/Computer-and-Phone-Repair
npm ci
npm run dev -- --host 0.0.0.0
```

For a downloaded or cloned project, replace the first path with your project folder. Open **http://localhost:5173** (Vite prints the exact address).

```sh
npm run typecheck
npm run build
npm run preview -- --host 0.0.0.0
```

Production output is in `dist/`. The preview address is normally **http://localhost:4173**. Deploy `dist/` to any static host; no backend or paid service is needed. `vite preview` is for checking the build locally.

## Configure the business first

**`src/config/business.ts`** is the clearly named configuration file for the business name, tagline, city/country, WhatsApp number, telephone number, address, opening hours, and social links.

- Replace **`YOUR_WHATSAPP_NUMBER` before using WhatsApp contact or repair requests**. Use your real international number with its country code. Optional `+`, spaces, parentheses, dots and hyphens are normalized. Do not enter a URL or a domestic number without the country code.
- Replace `YOUR_PHONE_NUMBER` and `YOUR_ADDRESS`. `YOUR_CITY` is also available for future location copy.
- Review the fictional opening hours.
- Replace `YOUR_INSTAGRAM_URL` and `YOUR_FACEBOOK_URL` with valid HTTPS links. Until configured, the social icons are non-clickable; placeholders never become broken external links.
- Unconfigured phone numbers are displayed as placeholders without a `tel:` link. The WhatsApp contact button explains its unavailable state and links to the request form.

**`src/data/services.ts`** contains service names, descriptions, categories and optional fictional starting prices in **MAD**. Every displayed price is labeled **“ابتداءً من”**; pricing is confirmed after diagnosis and customer approval. Remove a service's `price` to display “حسب التشخيص”. Data recovery has no sample price or guarantee.

## Repair request behavior

The form validates the customer's name, device type, brand/model, problem description and preferred contact method. Selecting a service card fills the matching service and, where appropriate, device type. A phone callback preference additionally requires an international callback number.

1. Invalid requests show field-specific Arabic messages and focus the first invalid field.
2. A valid request creates a readable, URL-encoded WhatsApp message containing the customer details, preferred contact method and an indicative price when available.
3. **After the business WhatsApp number is configured**, submission opens `https://wa.me/...` with the prepared message. The customer must press Send in WhatsApp. If a browser blocks the popup, an explicit WhatsApp link remains available.
4. **With the placeholder number**, the form still validates and prepares a copyable message, explains that WhatsApp is not configured, and sends nothing. It never contacts an invented number.
5. Message copying has loading, success and failure states. If clipboard access fails, the prepared text remains selectable. Editing a field clears the old message so an outdated request is not reused.

Requests are not stored in a database, local storage or an analytics service. Contact details enter the WhatsApp URL only when the customer opens it. The form does not reserve a time or claim that a message has been delivered.

## Checks

```sh
npm run typecheck
npm run build
npm test
```

The Playwright configuration uses system Chromium when available. Otherwise install its browser once:

```sh
npx playwright install chromium
npm test
```

You can also set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a supported local Chromium executable. Tests run on desktop and mobile, covering responsive overflow, filters/search and empty results, service selection, input validation, phone callback preference, clipboard fallback, correctly encoded WhatsApp links, unconfigured contacts, FAQ keyboard controls, mobile navigation and axe accessibility checks in initial, error and success states. WhatsApp tests intercept the browser opening and use a synthetic number; no actual contact is made.

## Files

- `src/config/business.ts` — business and contact configuration.
- `src/data/services.ts` — editable services and starting prices.
- `src/lib/whatsapp.ts` — validation, number normalization and message generation.
- `src/components/` — reusable header, brand, hero, services, process, request form, FAQ and contact/footer.
- `src/styles.css` — original styling, mobile-first responsive layouts, focus states and reduced-motion support.
- `public/images/workshop.webp` — original AI-generated fictional workshop photograph, optimized to WebP (about 119 KB).
- `public/licenses/` — open-source font and icon license notices.
- `tests/site.spec.ts` — maintained end-to-end, accessibility and message validation checks.

## Demo content

FixLab is a **fictional business**. All service descriptions, starting prices and opening hours are sample content. Contact information deliberately uses obvious placeholders. The workshop photograph was generated specifically for this demo and depicts no real business, brand or identifiable technician. No real shop's branding or photography is copied. The existing original SVG illustration is retained in `src/assets/` but is not used by FixLab.

No payment system, fabricated reviews, certification claims, stock claims, guaranteed recovery, or guaranteed repair times are included. Review all content and configure the actual business details before launching for real customers. This note lives in the README and is not a design element on the website.

Tajawal, DM Sans and Manrope are distributed under the SIL Open Font License; Lucide icons use the ISC License. Font files are self-hosted through the build, with no third-party font requests.
