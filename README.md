# Relay UI

Frontend for [Relay](https://relay.onrender.com) — a fast, minimal URL shortener with real-time click analytics.

## Stack

- **React 19** + TypeScript
- **Vite** (dev server + build)
- **Tailwind CSS v4**
- **React Router v7**

## Features

- Shorten URLs with optional custom slug and expiry date
- Click analytics: total clicks, clicks over time, top referrers
- Magic-link / email auth
- Dark mode support

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` to override defaults:

| Variable | Description | Default |
|---|---|---|
| `VITE_PORT` | Dev server port | `5173` |
| `VITE_API_URL` | Backend base URL (proxy target) | `http://localhost:3000` |
| `VITE_SHORT_BASE_URL` | Base URL used when copying short links | `http://localhost:3000` |

## Proxy

In dev, Vite proxies `/api/*` and `/auth/*` to `VITE_API_URL`, stripping the prefix before forwarding (e.g. `/api/short-url` → `http://localhost:3000/short-url`).

In production (Vercel), `vercel.json` rewrites handle the same routing to `https://relay.onrender.com`.

## Deployment

Deploy to Vercel — `vercel.json` is already configured. Set `VITE_SHORT_BASE_URL` to your backend domain in the Vercel environment settings.

## Project structure

```
src/
  context/        # AuthContext
  lib/            # apiFetch utility
  pages/          # Landing, Login, Dashboard
  providers/      # AuthProvider
```
