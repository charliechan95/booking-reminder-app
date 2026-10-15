# WhatsApp Booking + Reminders

Static web app for Hong Kong service shops (clinics, salons, tutors, trades).
No backend — all data in the browser's localStorage.

## What it does

1. **Settings** — shop name, WhatsApp number, FPS ID / name, PayMe name,
   deposit (flat amount or % of service price), language (繁中 / English).
2. **Services** — add services with duration + price.
3. **Working hours** — per weekday, open/close times.
4. **Bookings** — pick service + date → free time slots are generated from
   working hours (taken slots are excluded, no double-booking).
   Each booking has one-tap WhatsApp buttons:
   - 📩 Confirmation (預約確認)
   - ⏰ Reminder (提醒)
   - 💰 Deposit request with FPS details (催訂金)
   
   These open `wa.me` links with the message prefilled — the owner taps
   send inside WhatsApp. No paid WhatsApp API needed.
5. **Status flow** — Confirmed → Arrived / No-show / Cancelled / Rescheduled.
   Deposit status — Pending / Paid / Waived.
6. **Dashboard** — today's bookings, 7-day no-show rate (no-shows ÷
   arrived+no-shows), pending deposits, total bookings.
7. **Search** — by customer name or phone.

## Deploy

Drop the files on any static host (Vercel root `index.html`, zero config).
`vercel.json` sets `cleanUrls: true`.

## Files

- `index.html` — views and tab layout
- `db.js` — localStorage data layer + slot generation + WhatsApp link building
- `app.js` — UI rendering and events (繁中 / English)
- `style.css`, `vercel.json`
