# Bailynbnb — Your Website

This is your website for both properties (West Park pool home + Miami Muse). It's built to work the same way your Chino's site did: flat files, upload to GitHub, done.

## What's in this zip (7 files, all flat — no folders)

- `index.html` — homepage listing both properties
- `west-park.html` — West Park property page
- `miami.html` — Miami property page
- `style.css` — all the design/colors
- `script.js` — all the interactive behavior (photo gallery, calendar, forms)
- `README.md` — this file
- (you'll add your photo files here too — see below)

---

## STEP 1 — Get the site live on GitHub Pages

1. Go to github.com on your phone, log into your account (or create one — it's free).
2. Tap the **+** in the top right → **New repository**.
3. Name it `bailynbnb` (or anything you like). Set it to **Public**. Tap **Create repository**.
4. In the new repo, tap **Add file → Upload files**.
5. Upload all the files from this zip (unzip first using your phone's file app, then select all the files at once — not the zip itself).
6. Scroll down, tap **Commit changes**.
7. Go to the repo's **Settings** tab → **Pages** (left sidebar).
8. Under "Branch," choose `main` and folder `/ (root)` → **Save**.
9. Wait 1–2 minutes, then refresh — GitHub will show you your live link, something like:
   `https://yourusername.github.io/bailynbnb/`

That link is your real, live website. Share it with anyone.

---

## STEP 2 — Add your photos (you said ~80 total)

**No hard limit** — you can upload as many as you want. A few things to know:

- **Keep file sizes reasonable.** Phone photos are often 3–8 MB each. 80 of those is fine for GitHub, but the site will load faster for guests if you compress them first. Most phones have a "reduce file size" option when sharing/exporting a photo, or you can use a free app like "Photo Compress." Aim for under ~1–1.5 MB per photo if you can.
- **Name your files clearly before uploading**, using this pattern (all lowercase, no spaces):
  - West Park photos: `westpark-01.jpg`, `westpark-02.jpg`, `westpark-03.jpg`, … up to however many you have
  - Miami photos: `miami-01.jpg`, `miami-02.jpg`, `miami-03.jpg`, …
- Upload them into the **same repository**, at the **top level** (same place as `index.html`) — same "Add file → Upload files" step as above.
- Then open the page for that property on GitHub (tap `west-park.html` or `miami.html` in your repo) and tap the **pencil icon** to edit it. Near the bottom, find this block:

  ```
  const westParkImages = [
    "westpark-01.jpg","westpark-02.jpg","westpark-03.jpg","westpark-04.jpg", ...
  ];
  ```

  Add a line for every photo you uploaded, following the same pattern, then tap **Commit changes**. That's it — the gallery and lightbox update automatically. There's no limit to how many you list.

Until you add real photos, the site shows a clean "Photo coming soon" placeholder instead of a broken image icon, so it never looks broken while you're mid-upload.

---

## STEP 3 — Turn on the email forms (booking requests + reviews)

Each property page actually has **two** forms that both email you directly (same tool as Chino's — FormSubmit, free, no account needed):
- The "Request to Book" form in the sidebar
- The "Leave a review" form at the bottom of the Reviews section

1. Open `west-park.html` in GitHub, tap the pencil to edit.
2. Search for `PASTE_YOUR_EMAIL_HERE@example.com` — it appears **twice** (once in each form). Replace both with your real email address.
3. Do the same in `miami.html` (also twice).
4. Also update the "Email Bailyn" button on `index.html` (search for the same `PASTE_YOUR_EMAIL_HERE` text, appears once there).
5. Commit your changes.
6. The **first** time someone submits any of these forms, FormSubmit will email you a confirmation link — click it once per email address to activate. After that, every booking request and every review lands straight in your inbox.

**About reviews specifically:** because this is a flat, static site (no database), new reviews don't appear on the page automatically — they land in your email, and you copy the ones you want to keep onto the page yourself. This keeps the reviews section spam-free and fully in your control. To add one:

1. Open `west-park.html` (or `miami.html`) in GitHub, tap the pencil.
2. Find the `<div class="review-grid">` block and copy one of the existing `<div class="review-card">...</div>` blocks.
3. Paste it right before the closing `</div>` of `review-grid`, and swap in the new guest's initial, name, location, and review text.
4. Commit changes.

---

## STEP 4 — Turn on real payments (Stripe Payment Links)

This is what makes "Pay Deposit" actually work — a genuine, secure checkout, with no backend or database needed.

1. Go to **stripe.com** on your phone browser and sign up (free — you only get charged a small % when you actually get paid).
2. Once inside your Stripe Dashboard, search for **"Payment Links"** (or find it under the Products/Payments menu).
3. Tap **Create payment link**.
4. Create one product called **"West Park Deposit"** — set whatever deposit amount you want to charge (e.g. $150). Save it, then copy the link Stripe gives you.
5. Repeat for **"Miami Deposit"**.
6. Back in GitHub, edit `west-park.html`, find this line near the bottom:
   ```
   const STRIPE_LINK_WESTPARK = "PASTE_YOUR_STRIPE_PAYMENT_LINK_HERE";
   ```
   Paste your West Park Stripe link between the quotes. Commit changes.
7. Do the same for `miami.html` with `STRIPE_LINK_MIAMI`.

Once both are pasted in, the "Pay Deposit" tab on each property page takes guests straight to a real, secure Stripe checkout page. Until you paste a link in, tapping the button just explains that online payment isn't turned on yet and points guests to "Request to Book" instead — so it never looks broken.

**Being upfront about scope:** this gives you real inquiries and real payments without needing a backend. What it does *not* do is automatically sync bookings to the calendar the moment someone pays — that requires a database (like the Supabase setup we used for Family Tyes). For now, you keep the calendar accurate by editing the blocked-dates list yourself (next step) whenever a stay is confirmed. If down the road you want the calendar to lock itself the instant someone books, that's a natural next phase and we can build it the same way we approached Family Tyes.

---

## STEP 5 — Keep the availability calendar current

Each property page has a calendar showing the current month and next month, with booked dates grayed out.

1. Edit `west-park.html` (or `miami.html`), find this block:
   ```
   const westParkBlockedDates = [
     // "2026-09-05", "2026-09-06", "2026-09-07"
   ];
   ```
2. Add one line per booked night, in `"YYYY-MM-DD"` format, separated by commas:
   ```
   const westParkBlockedDates = [
     "2026-09-05", "2026-09-06", "2026-09-07"
   ];
   ```
3. Commit changes — the calendar updates instantly for anyone who visits.

---

## Quick recap of what's real vs. what's manual

| Feature | Status |
|---|---|
| Browsing both properties, photos, amenities, reviews | Fully live |
| "Request to Book" form → emails you | Fully live once you add your email |
| "Pay Deposit" → real Stripe checkout | Fully live once you add your Stripe links |
| Availability calendar | Live, but you update it by hand when a date books |

If you'd ever like the calendar and payments to connect automatically (so a paid booking blocks the date by itself), that's a bigger build using the same no-code stack as Family Tyes (Lovable + Supabase + Stripe) — just say the word when you're ready and we can spec it out.
