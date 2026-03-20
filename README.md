# FinTrack

FinTrack is a static personal finance web app with an offline-first local data layer, optional Supabase sync, onboarding, dashboards, and focused finance workflows.

## Features
- Authentication screens with local session management.
- Onboarding, dashboard, reports, budgets, goals, debts, and split expenses.
- Shared validation, UI bootstrapping, accessibility helpers, and app-lock flow.
- Optional Supabase sync through a config-driven setup.
- Offline fallback page and service-worker caching.

## Local usage
1. Open `Signup.html` to create a local account.
2. Complete onboarding.
3. Use `MainMenu.html` as the primary app shell.

## Optional config
Copy `fintrack-config.example.js` to `fintrack-config.js` and set:
- `FTConfig.requireAuth`
- `FTConfig.supabase.url`
- `FTConfig.supabase.anonKey`

Then include `fintrack-config.js` before `fintrack-sync.js` if you want environment-specific settings.

## Test
Run:

```bash
node tests/run-tests.js
```

## Architecture
- `fintrack-data.js`: persistence, formatting, exports, insights.
- `fintrack-sync.js`: sync adapter and Supabase transport.
- `fintrack-auth.js`: local auth/session/app-lock logic.
- `fintrack-validation.js`: entity validation.
- `fintrack-ui.js`: shared accessibility, service worker registration, and lock overlay bootstrapping.
