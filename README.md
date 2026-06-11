# Shared Experiences MK

A beautiful, map-first web app for sharing experiences, memories, and moments across North Macedonia.

## Features

- Fullscreen interactive map with experience markers
- Anonymous, nickname, or real-name sharing
- Location picker (map tap or place search via OpenStreetMap/Nominatim)
- Emotional reactions ("This touched me")
- Admin moderation at `/admin`
- Mobile-first with bottom sheets; desktop floating panels

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Leaflet / React Leaflet
- Supabase (database, auth, storage)

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

3. Install and run:

```bash
npm install
npm run dev
```

Open **http://localhost:5173/** (map) and **http://localhost:5173/admin** (moderation).

## Testing

Run automated API smoke tests (uses publishable key from `.env`):

```bash
npm run test:api
```

Verifies: public read of approved posts, pending hidden, anonymous submit, reaction RPC.

## Seed demo experiences

15 safe demo stories are included for map testing. To seed (or re-seed on a fresh project):

1. Run `npm run seed:demo` for instructions, or
2. Paste `scripts/seed-demo-experiences.sql` into **Supabase → SQL Editor → Run**

The script is idempotent — it skips if demo data already exists.

## Admin Setup

1. Create a user in Supabase Auth (Dashboard → Authentication → Users → Add user)
2. After signup, promote them in SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

3. Visit `/admin` and sign in
4. Approve pending submissions — they appear on the public map after approval (refresh the map tab or refocus the window)

## Database

Schema is managed via Supabase migrations. Tables:

- `experiences` — shared stories with location, category, moderation status
- `experience_reactions` — one reaction per browser fingerprint per experience
- `profiles` — admin roles linked to auth users

Storage bucket: `experience-images`

## Build

```bash
npm run build
npm run preview
```

## License

Private project
