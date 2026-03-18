# FinTrack — Supabase Setup Guide

This guide walks you through connecting FinTrack to Supabase so your data is saved in a real SQL database and stays in sync across any browser or device.

---

## How it works

```
Your Browser
  └── fintrack-data.js   (localStorage — instant reads/writes, works offline)
  └── fintrack-sync.js   (Supabase sync — runs in background after every change)
            │
            ▼
    Supabase PostgreSQL
      ft_transactions
      ft_accounts
      ft_budgets
      ft_goals
      ft_settings
      ft_nw_history
```

- **Offline-first** — the app works without internet. All changes queue up and sync when you reconnect.
- **No login required** — each device gets a unique ID stored in localStorage. Data is private to that device.
- **Real-time backup** — every add/edit/delete is pushed to Supabase automatically.

---

## Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
3. Give it a name (e.g. `fintrack`) and choose a region close to you
4. Wait ~1 minute for the project to be ready

---

## Step 2 — Run the database schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` from the FinTrack folder
4. Copy the entire contents and paste into the SQL editor
5. Click **Run** (green button)

You should see "Success. No rows returned" — this means all tables were created.

---

## Step 3 — Get your API keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy two values:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

---

## Step 4 — Add your keys to fintrack-sync.js

Open `fintrack-sync.js` and replace lines 16–17 at the top:

```js
// BEFORE:
const SUPABASE_URL      = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

// AFTER (example):
const SUPABASE_URL      = "https://abcdefghijkl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

Save the file.

---

## Step 5 — Open the app

Open `MainMenu.html` in your browser. You'll see a small indicator in the bottom-right corner:

| Indicator | Meaning |
|-----------|---------|
| `⟳ Syncing...` | First sync in progress — uploading your localStorage data |
| `✓ Synced` | All data is saved to Supabase |
| `● Offline` | No internet — changes are queued |
| `⚠ Sync error` | Something went wrong — check the browser console |

---

## Viewing your data in Supabase

Go to **Table Editor** in your Supabase dashboard to browse all your data:

- `ft_transactions` — all your income/expense entries
- `ft_accounts` — bank accounts and balances
- `ft_budgets` — monthly budgets
- `ft_goals` — savings goals
- `ft_settings` — theme, currency, preferences
- `ft_nw_history` — daily net worth snapshots

---

## Using on multiple devices

Since there's no login, each device gets its own unique ID and its own data.

**To use the same data on another device:**

1. In the first browser, go to **Settings → Export JSON**
2. Copy or transfer the `.json` file to the new device
3. Open `MainMenu.html` on the new device
4. Go to **Settings → Import** and load the JSON file
5. The sync layer will automatically push all imported data to Supabase

> **Tip:** In the future, adding email login (via Supabase Auth) would allow true multi-device sync without needing to export/import.

---

## Offline behavior

When there's no internet:
- The app works 100% normally using localStorage
- Every change is stored in a local pending queue (`ft_sync_queue` in localStorage)
- When you go back online, the queue drains automatically and all changes sync to Supabase
- You can check how many pending ops are queued: `FTSync.getPendingCount()` in the browser console

---

## Resetting / clearing data

- **Settings → Clear All Data** wipes localStorage and redirects to onboarding
- To also wipe Supabase data, go to **Supabase → Table Editor → ft_transactions** and delete rows (or run `DELETE FROM ft_transactions WHERE user_id = '<your_user_id>'` in SQL Editor)

---

## Files added for Supabase support

| File | Purpose |
|------|---------|
| `supabase-schema.sql` | Run once in Supabase SQL Editor to create all tables and security policies |
| `fintrack-sync.js` | Sync layer — handles push/pull between localStorage and Supabase |
| `fintrack-data.js` | Updated — now calls sync hooks after every add/update/delete |

---

## Troubleshooting

**"Sync error" badge appears**
- Open browser DevTools → Console to see the error message
- Most common cause: incorrect URL or API key in `fintrack-sync.js`
- Also check that you ran `supabase-schema.sql` successfully

**Data not showing after opening on a new browser**
- The new browser has a different device ID — export/import JSON to transfer data
- Or add email auth (see Supabase Auth docs) for seamless cross-device sync

**CORS error in console**
- Make sure you're using the `anon` public key (not the `service_role` secret key)
- The anon key is safe to use in browser JavaScript
