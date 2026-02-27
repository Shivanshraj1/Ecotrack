# EcoTrack

EcoTrack is a modern SaaS-style React dashboard for AI-powered waste segregation and recycling tracking.

## Stack
- React + Vite
- Tailwind CSS
- React Router
- Chart.js

## Run locally
```bash
npm install
npm run dev
```

By default, Vite is configured to listen on `0.0.0.0:5173` so it is reachable from containers/remote workspaces.

## If you cannot open localhost
If you are running this inside a VM/container/cloud IDE, use your platform's **Port Forwarding** for:
- `5173` (dev server)
- `4173` (preview server)

Then open the forwarded URL from your browser.

You can also run:
```bash
npm run preview
```
for a production preview build (after dependencies are installed).

## Routes
- `/` landing page
- `/login` login
- `/register` register
- `/dashboard` main dashboard
- `/log` log waste
- `/pickups` pickup requests
- `/rewards` rewards + leaderboard
- `/admin` admin panel
