# FinTrack Web App — Project History & Chat Memory

## Project Overview
**App Name:** FinTrack
**Type:** Personal Finance Tracker Web App
**Design:** Dark theme, Material Design 3 inspired
**Currency:** ₹ Indian Rupees (en-IN locale)
**User:** Darko 

---

## Design System
- **Background:** #000000
- **Surfaces:** #0A0A0A, #141414, #1E1E1E, #282828, #333333
- **Primary:** #80CBC4 (Teal)
- **Expense:** #EF9A9A (Red)
- **Income:** #A5D6A7 (Green)
- **Transfer:** #90CAF9 (Blue)
- **Warning:** #E8B06E (Amber)
- **Fonts:** Google Sans (headings), Google Sans Text (body), JetBrains Mono (numbers)
- **Icons:** Material Symbols Rounded (Google Fonts CDN)
- **Border Radius:** 12px (sm), 16px (md), 24px (lg), 100px (full)

---

## Session Timeline

### Session 1 — Initial Setup & File Check
- User asked to check the "Fintrack - Web app" folder
- Found 3 existing HTML files: `AddTransaction.html`, `AllTransactions.html`, `MainMenu.html`
- Each was a standalone page with no cross-linking

### Session 2 — Link Pages Together
- **AddTransaction.html:** Back button had no `onclick` → Fixed to link to `MainMenu.html`
- **AllTransactions.html:** FAB showed `alert()` → Fixed to link to `AddTransaction.html`
- **AllTransactions.html:** Back button used `history.back()` → Changed to `MainMenu.html`
- **Navigation map established:**
  - MainMenu → AddTransaction (FAB), AllTransactions (nav tab)
  - AllTransactions → MainMenu (back), AddTransaction (FAB)
  - AddTransaction → MainMenu (back)

### Session 3 — Fix MainMenu Icons
- Icons on MainMenu were rendering as plain text (e.g., "searchnotificationssettings")
- **Root cause:** The `.ms` CSS class was missing `font-family: 'Material Symbols Rounded'`
- Fixed by adding the full font-family declaration to `.ms` class
- Updated icon choices:
  - **Header:** `notifications_active` → `notifications`, `more_vert` → `settings`
  - **Nav bar:** `space_dashboard` → `home`, `swap_vert` → `receipt_long`, `account_balance` → `wallet`, `analytics` → `bar_chart`, `tune` → `settings`
  - **Account emojis:** 💵→💰, 📱→⚡, 👛→🔐

### Session 4 — Floating Top Bar for AllTransactions
- Made AllTransactions top bar floating with transparent background
- Added `backdrop-filter: blur(20px) saturate(1.4)` for frosted glass effect
- Removed solid `background: var(--bg)` from `.top-bar`

### Session 5 — Floating Nav Bars on All Pages + Header Restructure
**MainMenu header restructured:**
- "FinTrack" moved to absolute center of header bar
- Greeting ("Good morning/afternoon/evening") shown on the left
- Header settings button linked to `Settings.html`

**Floating nav bar added to all 3 pages:**
- Same 5 icons: home, receipt_long, wallet, bar_chart, settings
- Frosted glass effect (rgba(14,14,14,0.92) + backdrop-filter blur)
- Fixed bottom:16px, centered, pill-shaped (border-radius:100px)
- Active state highlighted per page
- FABs repositioned to bottom:76px (above nav bar)
- Body padding-bottom increased to 100px

### Session 6 — New Pages Created (Accounts, Reports, Settings)
Created 3 new full pages with matching design system:

**Accounts.html:**
- Total net worth card
- Account list (Cash, SBI Savings, HDFC Checking, UPI/GPay, Paytm Wallet)
- Credit card section (Axis, ICICI, HDFC, Federal, SBI) with usage progress bars
- Add Account FAB

**Reports.html:**
- Spending by category (donut chart)
- Income vs Expense comparison (bar chart)
- Daily spending tracker
- Cash flow insights

**Settings.html:**
- Profile section (avatar with initials "DA", name, email)
- General settings (currency, language, date format, week start, financial year)
- Appearance (theme toggle Dark/Light/System, accent color picker)
- Notifications (daily reminder, budget alerts, bill reminders, weekly summary)
- Data & Privacy (export CSV/JSON, import, cloud backup, clear all data)
- Security (app lock, biometric login)
- About (version, developer, terms, privacy, rate, feedback)
- Interactive toggles, accent color selection, toast notifications

**All navigation updated:**
- MainMenu `navTab()` function updated — removed `alert()` placeholders
- All 6 pages now have floating nav bar with correct links
- All back buttons link to MainMenu.html

### Session 7 — Major Feature Expansion (12 Total Pages)

#### New Pages Created (6 more):

**Budgets.html:**
- Monthly category budgets with progress bars (green/yellow/red thresholds)
- Overall budget circular progress ring
- Add/edit/delete budgets via bottom sheets
- Month navigation
- Budget vs actual comparison

**Recurring.html:**
- Manage recurring bills, subscriptions, EMIs
- Grouped by frequency (daily, weekly, monthly, yearly)
- Upcoming payments timeline
- Pause/resume toggles
- Add/edit/delete forms
- Next payment date calculations

**Goals.html:**
- Savings goals with visual progress bars and milestone markers
- Total savings overview with progress ring
- 4 active goals: Emergency Fund, Vacation, New Laptop, Wedding Gift
- Completed goals section (collapsible)
- "Add Money" bottom sheet with source account selector
- "Add Goal" form with emoji/color pickers
- Estimated completion dates and deadline tracking

**Calendar.html:**
- Interactive monthly calendar view
- Colored dots per transaction type (expense=red, income=green, transfer=blue)
- Day detail view showing transactions for selected date
- Upcoming bills countdown
- Month navigation (prev/next)

**DebtTracker.html:**
- Track loans and credit card debt
- Payoff progress bars with timeline
- Snowball vs Avalanche strategy comparison toggle
- "Make Payment" flow
- Interest calculations
- Payoff timeline projections

**SplitExpense.html:**
- Split expenses with friends/family
- Balance summaries (who owes whom)
- Settle up flow
- Groups support
- Equal/unequal/percentage split options
- Activity history

#### Existing Pages Enhanced:

**AllTransactions.html — Edit/Delete Added:**
- Tap transaction → Detail bottom sheet (icon, name, amount, date, category, account, status, tags)
- "Edit" button → Edit form bottom sheet (pre-filled, segmented type selector, category/account dropdowns, date picker, status selector, tags input)
- "Delete" button → Confirmation dialog with warning
- Toast notifications (success green, error red)
- All existing search/filter/sort functionality preserved

**Accounts.html — Edit/Delete Added:**
- Tap account → Detail bottom sheet (balance, 30-day change, recent transactions)
- Edit account form (name, type, balance, icon, color)
- Delete with confirmation dialog
- Credit card detail view (used, limit, available, utilization %, payment history)
- FAB updated from `alert()` to proper "Add Account" bottom sheet form
- Toast notification system added

**MainMenu.html — Quick Access Grid Added:**
- 6 shortcut tiles linking to new pages:
  - Budgets (teal, savings icon)
  - Recurring (blue, event_repeat icon)
  - Goals (green, flag icon)
  - Calendar (amber, calendar_month icon)
  - Debts (red, credit_score icon)
  - Split (purple, group icon)
- CSS grid layout (3 columns), hover effects

**Settings.html — Enhanced:**
- Working theme toggle (Dark active, Light/System show "coming soon" toast)
- Accent color switching with checkmark
- Export CSV/JSON with toast feedback
- Import feature placeholder
- Clear data confirmation modal

---

## Final File Structure (12 files)

| File | Description | Nav Active |
|------|-------------|------------|
| `MainMenu.html` | Dashboard — overview, charts, accounts, credit cards, quick access | Home |
| `AllTransactions.html` | Transaction list — search, filter, sort, edit, delete | Transactions |
| `AddTransaction.html` | New transaction form with calculator | None |
| `Accounts.html` | Account balances, credit cards, edit/delete | Accounts |
| `Reports.html` | Charts, category breakdown, insights, forecast | Reports |
| `Settings.html` | Profile, appearance, notifications, data, security | Settings |
| `Budgets.html` | Monthly category budgets with progress tracking | None |
| `Recurring.html` | Recurring bills/subscriptions/EMI management | None |
| `Goals.html` | Savings goals with progress and milestones | None |
| `Calendar.html` | Monthly calendar view with transaction dots | None |
| `DebtTracker.html` | Loan & debt payoff tracking | None |
| `SplitExpense.html` | Split expenses with friends/family | None |

---

## Navigation Architecture

### Primary Navigation (Floating Nav Bar — all pages)
```
[Home] → MainMenu.html
[Transactions] → AllTransactions.html
[Accounts] → Accounts.html
[Reports] → Reports.html
[Settings] → Settings.html
```

### Secondary Navigation (Quick Access from MainMenu)
```
[Budgets] → Budgets.html
[Recurring] → Recurring.html
[Goals] → Goals.html
[Calendar] → Calendar.html
[Debts] → DebtTracker.html
[Split] → SplitExpense.html
```

### Page-Level Navigation
```
All sub-pages → Back button → MainMenu.html
MainMenu FAB (+) → AddTransaction.html
AllTransactions FAB (+) → AddTransaction.html
Header Settings icon → Settings.html
```

---

## Sample Data Used

### Transactions (20 entries)
- Grocery ₹2,450, Salary Mar ₹85,000, Netflix ₹649, Freelance ₹15,000
- Uber ₹320, Transfer ₹10,000, Electricity ₹1,850, Coffee ₹180
- Dividends ₹3,200, Gym ₹1,500, Dining ₹2,200, Books ₹450
- Rent ₹18,000, Client Pay ₹25,000, Petrol ₹1,200
- Salary Feb ₹85,000, Insurance ₹3,500, Shopping ₹4,200
- Salary Jan ₹82,000, NY Dinner ₹3,800

### Accounts
- Cash, SBI Savings, HDFC Checking, UPI (GPay), Digital Wallet (Paytm)

### Credit Cards
- Axis (₹1,90,000 limit), Federal (₹70,000), HDFC (₹1,16,000), ICICI (₹1,60,000), SBI (₹80,000)

### Goals
- Emergency Fund: ₹5,00,000 target, ₹2,00,000 saved
- Vacation Fund: ₹1,00,000 target, ₹45,000 saved
- New Laptop: ₹80,000 target, ₹30,000 saved
- Wedding Gift: ₹70,000 target, ₹10,000 saved

### Session 8 — Full Feature Implementation & Architecture Overhaul

#### New File: `fintrack-data.js` — Shared Data Layer
A central JavaScript module providing localStorage-backed persistence for the entire app.

**Key exports:**
- `FT` — CRUD for transactions, accounts, credit cards, budgets, goals, templates, settings, notifications, net worth history
- `FTTheme` — theme management (`init()`, `apply(theme)`) with Dark/Light/System support
- `FTSearch` — global full-text search across transactions (`query(text)`)
- `FTInsights` — spending insights engine (`generate()`) — month-over-month comparisons, top category, savings rate
- `FTGoalMilestones` — milestone check notifications at 25/50/75/100% (`check(goal, prevSaved)`)
- `FTBudgetRollover` — carry unused budget to next month (`apply()`)
- `ftToast(msg, type, dur)` — toast notification utility
- `ftFmt(n)` / `ftFmtShort(n)` — ₹ currency formatters with en-IN locale

**Default seed data on first load:**
- 20 transactions spanning 3 months
- 5 accounts, 5 credit cards, 7 budgets, 4 goals, 4 transaction templates
- Milestones and notifications system ready

**Auto-theme IIFE** runs on script load to prevent white flash before DOM is ready.

---

#### Features Added Across All Pages

**1. LocalStorage Persistence** (all 13 pages)
- All data now reads/writes via `FT` object
- Changes to transactions, accounts, budgets, goals persist across page reloads and navigation
- Import/Export JSON and CSV fully functional in Settings

**2. Dark/Light/System Theme Switching** (all 13 pages)
- `FTTheme.init()` called on every page load
- Theme persists via `FT.setSetting('theme', value)`
- Light theme CSS variables added to all pages
- System theme tracks `prefers-color-scheme` media query with auto-update listener
- Onboarding allows user to pick initial theme

**3. Global Search Overlay** (`MainMenu.html`)
- Ctrl+K keyboard shortcut opens floating search overlay
- Real-time full-text search across all transactions via `FTSearch.query()`
- Shows transaction name, amount, date, category, account in results
- Escape or click-outside closes overlay

**4. Spending Insights Engine** (`MainMenu.html`)
- `FTInsights.generate()` computes:
  - Month-over-month spending change (↑↓ percentage)
  - Top spending category this month
  - Savings rate (income vs expenses)
  - Budget alert if any budget exceeded
- Displayed as icon + text insight cards on dashboard

**5. Swipe Gestures on Transactions** (`AllTransactions.html`)
- Touch swipe-left on any transaction item reveals Edit and Delete action buttons
- Smooth CSS transition, auto-closes when another item is swiped
- Tapping item text navigates to detail sheet (no swipe interference)

**6. Bulk Select & Delete** (`AllTransactions.html`)
- Checklist button in top bar enters bulk mode
- Checkboxes appear on all transaction items
- Selection count shown in floating bottom bar
- Bulk delete with confirmation
- Exit button cancels bulk mode

**7. Transaction Templates** (`AddTransaction.html`)
- 4 pre-defined templates: Salary Credit, Grocery, Rent, Petrol
- Templates pre-fill name, type, category, amount
- Access via URL param `?template=<id>` (e.g., from MainMenu shortcuts)

**8. Budget Rollover** (`Budgets.html`, `Settings.html`)
- Toggle in Settings to carry unused budget to next month
- State stored in `FT.getSetting('budgetRollover')`
- `FTBudgetRollover.apply()` adds unused amounts to following month budgets

**9. Goal Milestone Notifications** (`Goals.html`)
- When adding money to a goal, `FTGoalMilestones.check()` compares old vs new saved %
- Toast notifications fire at 25%, 50%, 75%, 100% milestones
- Milestone message includes goal name and milestone level

**10. Category Drill-Down in Reports** (`Reports.html`)
- Clicking a category in the donut chart legend opens a bottom sheet
- Shows all transactions for that category with amounts and dates
- Chevron icon on each legend item indicates drill-down

**11. Custom Date Range** (`Reports.html`)
- "Custom" button in period selector (alongside 1W/1M/3M/6M/1Y)
- Opens date picker row with From/To inputs
- Charts re-render filtered to selected range

**12. PDF Export** (`Reports.html`)
- Export PDF button (download icon) in top bar
- Calls `window.print()` — browser print dialog for PDF save

**13. Net Worth Timeline** (`Accounts.html`)
- `FT.pushNWSnapshot()` called on page load
- Saves dated snapshot of current net worth to localStorage
- History accessible via `FT.getNWHistory()` for future chart

**14. Onboarding Flow** (`Onboarding.html` — NEW FILE)
- 5-step first-run experience shown on first app launch
- Step 0: Welcome screen with feature highlights (analytics, goals, budget alerts, private)
- Step 1: Name input (saved to `FT.setSetting('userName', name)`)
- Step 2: Theme selection (Dark/Light/System) with live preview
- Step 3: Currency selection (INR/USD/EUR/GBP)
- Step 4: Summary stats + "Start Tracking" CTA
- Progress dots animate through slides
- After completion, sets `onboardingDone: true` and redirects to `MainMenu.html`
- If already onboarded, auto-redirects to `MainMenu.html`

**15. Notification System** (`MainMenu.html`)
- Notification bell shows unread badge count
- Tapping bell opens bottom sheet listing all notifications
- `FT.markAllRead()` clears badge on open
- Goal milestone notifications auto-added to notification list

**16. PWA Support** (all 13 pages — NEW FILES)
- `manifest.json` — app name, icons, theme color, shortcuts to Add Transaction + Reports
- `service-worker.js` — cache-first strategy for local files, stale-while-revalidate for CDN
- Offline capability: app usable without internet after first load
- Install prompt: browser shows "Add to Home Screen" on mobile
- App icons: `icons/icon-192.png`, `icons/icon-512.png`
- All HTML pages linked with `<link rel="manifest">`, Apple meta tags, SW registration script

**17. Chart Animations** (all chart pages)
- `animation: { duration: 600 }` added to all Chart.js configurations
- Smooth fade-in on page load and data change

---

#### Files Modified in Session 8

| File | Changes |
|------|---------|
| `fintrack-data.js` | **NEW** — shared data layer, all localStorage CRUD |
| `manifest.json` | **NEW** — PWA manifest |
| `service-worker.js` | **NEW** — offline caching service worker |
| `icons/icon-192.png` | **NEW** — PWA app icon 192×192 |
| `icons/icon-512.png` | **NEW** — PWA app icon 512×512 |
| `Onboarding.html` | **NEW** — 5-step first-run flow |
| `MainMenu.html` | localStorage data, global search, insights, notifications, onboarding guard |
| `AllTransactions.html` | localStorage data, swipe gestures, bulk select/delete |
| `AddTransaction.html` | localStorage save, transaction templates |
| `Accounts.html` | localStorage data, FTTheme, NW snapshot |
| `Reports.html` | localStorage data, custom date range, category drill-down, PDF export |
| `Settings.html` | localStorage settings, theme persistence, CSV/JSON export/import, budget rollover toggle |
| `Goals.html` | localStorage data, milestone notifications |
| `Budgets.html` | localStorage data, budget rollover |
| `Recurring.html` | FTTheme.init, manifest, SW registration |
| `Calendar.html` | FTTheme.init, manifest, SW registration |
| `DebtTracker.html` | FTTheme.init, manifest, SW registration |
| `SplitExpense.html` | FTTheme.init, manifest, SW registration |

---

## Final File Structure (Session 8 — 18 files)

| File | Description | Nav Active |
|------|-------------|------------|
| `MainMenu.html` | Dashboard — overview, charts, accounts, credit cards, quick access, insights | Home |
| `AllTransactions.html` | Transaction list — search, filter, sort, edit, delete, swipe, bulk select | Transactions |
| `AddTransaction.html` | New transaction form with calculator and templates | None |
| `Accounts.html` | Account balances, credit cards, edit/delete, NW snapshot | Accounts |
| `Reports.html` | Charts, category drill-down, custom date range, PDF export | Reports |
| `Settings.html` | Profile, theme, notifications, data export/import, budget rollover | Settings |
| `Budgets.html` | Monthly category budgets with progress tracking and rollover | None |
| `Recurring.html` | Recurring bills/subscriptions/EMI management | None |
| `Goals.html` | Savings goals with progress, milestones and notifications | None |
| `Calendar.html` | Monthly calendar view with transaction dots | None |
| `DebtTracker.html` | Loan & debt payoff tracking | None |
| `SplitExpense.html` | Split expenses with friends/family | None |
| `Onboarding.html` | First-run onboarding flow (5 steps) | None |
| `fintrack-data.js` | Shared data layer (localStorage, theme, search, insights) | — |
| `manifest.json` | PWA manifest | — |
| `service-worker.js` | Offline caching service worker | — |
| `icons/icon-192.png` | PWA app icon | — |
| `icons/icon-512.png` | PWA app icon | — |

---

## Architecture (Session 8)

```
All HTML Pages
    └── <script src="fintrack-data.js">
            ├── FT (localStorage CRUD — transactions, accounts, budgets, goals, etc.)
            ├── FTTheme (dark/light/system theme management)
            ├── FTSearch (full-text transaction search)
            ├── FTInsights (spending insights calculations)
            ├── FTGoalMilestones (milestone achievement notifications)
            ├── FTBudgetRollover (unused budget carry-forward)
            ├── ftToast() (notification toasts)
            └── ftFmt() / ftFmtShort() (₹ currency formatting)
```

---

### Session 9 — Supabase Cloud Sync + Bug Fixes

#### Supabase Integration (localStorage-first, sync in background)

**New file: `fintrack-sync.js`**
A complete Supabase sync layer that sits on top of `fintrack-data.js`. Strategy: localStorage is always read/written immediately (instant, offline-capable), and every mutation is replicated to Supabase in the background.

Key design decisions:
- **No login required** — each browser gets a unique `device_id` (UUID stored in localStorage). All data is scoped to that device via Row Level Security.
- **Offline queue** — failed writes (due to no internet) are saved to `ft_sync_queue` in localStorage and drained automatically when the device comes back online.
- **Pull on page load** — when a page opens, the latest data is fetched from Supabase and merged into localStorage (remote wins, so data stays current after using on another browser).
- **Full push on import** — when importing a JSON backup, all data is pushed to Supabase in batches of 100 rows.
- **Sync status indicator** — a small pill badge appears bottom-right showing `⟳ Syncing...`, `✓ Synced`, `● Offline`, or `⚠ Sync error`.

Hooks added to `fintrack-data.js` (via `_sync()` helper called after every mutation):

| Hook | Triggered by |
|------|-------------|
| `onAddTx` | `FT.addTX()` |
| `onUpdateTx` | `FT.updateTX()` |
| `onDeleteTx` | `FT.deleteTX()` |
| `onBulkDeleteTx` | `FT.bulkDeleteTX()` |
| `onAddAcc` / `onUpdateAcc` / `onDeleteAcc` | Account CRUD |
| `onAddBudget` / `onUpdateBudget` / `onDeleteBudget` | Budget CRUD |
| `onAddGoal` / `onUpdateGoal` / `onDeleteGoal` | Goal CRUD |
| `onSettingsChange` | `FT.setSettings()` / `FT.setSetting()` |
| `onNWSnapshot` | `FT.pushNWSnapshot()` |

**New file: `supabase-schema.sql`**
Full PostgreSQL schema to run once in the Supabase SQL Editor. Creates:
- `ft_users` — device-based identity (no auth required)
- `ft_transactions`, `ft_accounts`, `ft_credit_cards`, `ft_budgets`, `ft_goals` — core data tables
- `ft_settings` — one row per user, stores theme/currency/preferences + extra JSONB for future fields
- `ft_nw_history` — daily net worth snapshots with unique constraint on (user_id, date)
- Row Level Security policies on all tables — each device can only access its own rows
- `ft_current_user_id()` helper function for RLS — reads `x-device-id` from request headers
- `trigger_set_updated_at()` auto-trigger — updates `updated_at` on every row change

**New file: `SUPABASE_SETUP.md`**
Step-by-step guide for connecting the app to Supabase: create project, run schema, copy API keys, paste into `fintrack-sync.js`, open app.

**`fintrack-sync.js` added to all 13 HTML pages** — inserted immediately after `fintrack-data.js` script tag. The sync layer auto-initialises on `DOMContentLoaded` and is skipped silently if the URL/key placeholders haven't been replaced.

---

#### Bug Fixes

**Bug 1 — Settings.html: "ALERTS" text overlapping UI**
- `<span class="material-symbols-rounded">alerts</span>` — `alerts` is not a valid Material Symbols icon name, so it rendered as the literal text "ALERTS" floating over the Budget Alerts row.
- **Fix:** Changed to `notification_important` (valid icon).

**Bug 2 — Recurring.html: "prime" text rendering in Amazon Prime row**
- `<span class="material-symbols-rounded">prime</span>` — `prime` is not a valid Material Symbols icon name, rendered as plain text.
- **Fix:** Changed to `local_shipping` (valid icon).

---

#### Files Modified in Session 9

| File | Changes |
|------|---------|
| `fintrack-sync.js` | **NEW** — Supabase sync layer with offline queue, pull-on-load, push-on-mutation |
| `supabase-schema.sql` | **NEW** — PostgreSQL schema with all tables, RLS, and triggers |
| `SUPABASE_SETUP.md` | **NEW** — Setup guide (create project → run SQL → paste keys → done) |
| `fintrack-data.js` | Added `_sync()` hook helper; all mutation methods now call sync layer; `importJSON` triggers `FTSync.pushAll()` |
| All 13 HTML pages | Added `<script src="fintrack-sync.js">` after `fintrack-data.js` |
| `Settings.html` | Fixed broken `alerts` icon → `notification_important` |
| `Recurring.html` | Fixed broken `prime` icon → `local_shipping` |

---

## Final File Structure (Session 9 — 21 files)

| File | Description | Nav Active |
|------|-------------|------------|
| `MainMenu.html` | Dashboard — overview, charts, accounts, credit cards, quick access, insights | Home |
| `AllTransactions.html` | Transaction list — search, filter, sort, edit, delete, swipe, bulk select | Transactions |
| `AddTransaction.html` | New transaction form with calculator and templates | None |
| `Accounts.html` | Account balances, credit cards, edit/delete, NW snapshot | Accounts |
| `Reports.html` | Charts, category drill-down, custom date range, PDF export | Reports |
| `Settings.html` | Profile, theme, notifications, data export/import, budget rollover | Settings |
| `Budgets.html` | Monthly category budgets with progress tracking and rollover | None |
| `Recurring.html` | Recurring bills/subscriptions/EMI management | None |
| `Goals.html` | Savings goals with progress, milestones and notifications | None |
| `Calendar.html` | Monthly calendar view with transaction dots | None |
| `DebtTracker.html` | Loan & debt payoff tracking | None |
| `SplitExpense.html` | Split expenses with friends/family | None |
| `Onboarding.html` | First-run onboarding flow (5 steps) | None |
| `fintrack-data.js` | Shared data layer (localStorage CRUD, theme, search, insights) + sync hooks | — |
| `fintrack-sync.js` | Supabase cloud sync layer (offline-first, background replication) | — |
| `supabase-schema.sql` | PostgreSQL schema for Supabase — run once to set up database | — |
| `SUPABASE_SETUP.md` | Step-by-step Supabase setup guide | — |
| `manifest.json` | PWA manifest | — |
| `service-worker.js` | Offline caching service worker | — |
| `icons/icon-192.png` | PWA app icon | — |
| `icons/icon-512.png` | PWA app icon | — |

---

## Architecture (Session 9)

```
All HTML Pages
    └── <script src="fintrack-data.js">      ← localStorage CRUD + sync hooks
    └── <script src="fintrack-sync.js">      ← Supabase replication layer
            │
            ├── On page load  → FTSync.pullAll()   (Supabase → localStorage)
            ├── On mutation   → FTSync.onXxx()     (localStorage → Supabase, queued if offline)
            ├── On reconnect  → FTSync.drainQueue() (flush pending ops)
            └── On import     → FTSync.pushAll()   (full batch upload)
            │
            ▼
    Supabase PostgreSQL (free tier, device-scoped via RLS)
      ft_users · ft_transactions · ft_accounts · ft_credit_cards
      ft_budgets · ft_goals · ft_settings · ft_nw_history
```

---

## Known Issues & Limitations
1. Recurring transaction auto-creation not yet implemented (UI exists in Recurring.html)
2. Calendar.html transactions filtered by date only (no category filter)
3. Supabase sync requires manual key setup in `fintrack-sync.js` — not plug-and-play without configuration
4. No email/login auth — data is device-scoped; cross-device sync requires JSON export/import

---

## Potential Future Features
- Receipt scanner (camera capture + OCR)
- Multi-currency support with auto-conversion
- Recurring transaction auto-creation engine
- Email / Google auth via Supabase Auth for true multi-device sync
- Widgets / home screen summary
- AI spending analysis and recommendations
- Export to WhatsApp / share expense summaries

---

### Session 10 — Bug Fixes & Data Layer Migration

#### Bug Fixes

**Bug 1 — Accounts.html: Hardcoded data, CRUD not persisting**
- Account cards and credit card cards were hardcoded in HTML — not reading from `FT.getAccounts()` / `FT.getCreditCards()`.
- `saveEditAccount()`, `saveNewAccount()`, and `confirmDelete()` only showed toasts without actually saving/deleting data in localStorage.
- **Fix:** Replaced hardcoded HTML with dynamic `renderPage()` that reads from FT data layer. All CRUD operations now call `FT.addAccount()`, `FT.updateAccount()`, `FT.deleteAccount()` and re-render the page.

**Bug 2 — Settings.html: Theme storage conflict**
- Theme was saved via `localStorage.setItem('fintrack-theme', theme)` but `FTTheme.init()` reads from `FT.getSetting('theme')` (stored under `ft_settings` key). Theme changes in Settings didn't propagate to other pages.
- **Fix:** `switchTheme()` now uses `FT.setSetting('theme', theme)` and `FTTheme.apply(theme)` directly. Removed duplicate `_origSwitchTheme` wrapper.

**Bug 3 — Settings.html: Budget rollover toggle visual state**
- `toggleBudgetRollover()` updated the FT setting but didn't toggle the button's `on` CSS class or `data-state` attribute, so the toggle appeared stuck visually.
- **Fix:** Added `classList.toggle('on', newVal)` and `setAttribute('data-state', ...)` to keep visual state in sync.

**Bug 4 — Settings.html: Currency and accent color stored in separate localStorage keys**
- Currency was stored as `fintrack-currency` / `fintrack-currency-symbol` and accent color as `fintrack-accent-color` / `fintrack-accent-value` — all outside the FT settings system.
- **Fix:** Migrated to `FT.setSetting('currency')`, `FT.setSetting('currencySymbol')`, `FT.setSetting('accentColor')`, `FT.setSetting('accentName')`.

**Bug 5 — index.html: Onboarding bypass**
- `index.html` unconditionally redirected to `MainMenu.html` via `<meta http-equiv="refresh">` and `window.location.href`, bypassing the onboarding check that `MainMenu.html` performs.
- **Fix:** Now loads `fintrack-data.js` and checks `FT.getSetting('onboardingDone')` to route to either `Onboarding.html` or `MainMenu.html`.

#### Data Layer Migration — DebtTracker & SplitExpense

**fintrack-data.js — New CRUD Methods & Seed Data:**
- Added `DEFAULT_DEBTS` (4 entries: Home Loan, Personal Loan, Axis CC, ICICI CC) with fields: name, lender, type, icon, principal, outstanding, paid, interestRate, emi, tenure, startDate, interestPaid, nextDue.
- Added `DEFAULT_SPLITS` (4 entries: Dinner, Grocery, Movie, Uber) with fields: desc, total, paidBy, date, splitType, members, shares.
- Added `DEFAULT_SPLIT_FRIENDS` (5 entries: Rahul, Priya, Amit, Sneha, Vikram) with fields: name, phone, email, color.
- Added full CRUD: `getDebts/setDebts/addDebt/updateDebt/deleteDebt`, `getSplits/setSplits/addSplit/updateSplit/deleteSplit`, `getSplitFriends/setSplitFriends/addSplitFriend/deleteSplitFriend`.
- Updated `exportJSON()` / `importJSON()` / `clearAll()` to include debts, splits, and splitFriends.

**DebtTracker.html — Dynamic Rendering:**
- Replaced all 4 hardcoded debt cards with dynamic `renderDebts()` function reading from `FT.getDebts()`.
- Overview card (total debt, paid, remaining, monthly EMI, progress ring) computed dynamically.
- Strategy toggle (Snowball/Avalanche) re-sorts debt cards by outstanding amount or interest rate.
- Payoff timeline computed from outstanding/emi for each debt.
- "Add Debt" form now persists via `FT.addDebt()`.
- "Make Payment" deducts from debt outstanding via `FT.updateDebt()` and from selected account via `FT.updateAccount()`.
- Payment account dropdown populated dynamically from `FT.getAccounts()`.

**SplitExpense.html — Dynamic Rendering:**
- Replaced hardcoded friends (5), splits (4), and groups (2) with dynamic rendering from `FT.getSplitFriends()` and `FT.getSplits()`.
- Balance card (owed/owes/net) computed from split shares using `computeBalances()`.
- Friend cards show dynamic balance, recent split activity, and history.
- "Add Split" form: paid-by radio group and split-between checkboxes populated dynamically from friends list. Equal split shares computed automatically. Persists via `FT.addSplit()`.
- "Settle Up" creates a settlement split that zeroes out the balance with the selected friend.
- "Add Person" persists via `FT.addSplitFriend()` with auto-assigned color.
- Removed hardcoded Groups section (groups feature not yet backed by data layer).

#### Files Modified in Session 10

| File | Changes |
|------|---------|
| `fintrack-data.js` | Added DEFAULT_DEBTS, DEFAULT_SPLITS, DEFAULT_SPLIT_FRIENDS seed data; added debt/split/splitFriend CRUD methods; updated export/import/clearAll |
| `Accounts.html` | Replaced hardcoded account/credit card HTML with dynamic renderPage(); CRUD operations now persist via FT |
| `Settings.html` | Fixed theme storage to use FT.setSetting; fixed budget rollover toggle visual; migrated currency/accent to FT settings |
| `index.html` | Added onboarding check before redirect |
| `DebtTracker.html` | Replaced hardcoded debt cards with dynamic rendering; add/payment forms persist to FT |
| `SplitExpense.html` | Replaced hardcoded friends/splits/groups with dynamic rendering; add split/settle/add person persist to FT |

---

### Session 11 — Onboarding Theme Fix & Username Persistence

#### Bug Fixes

**Bug 1 — Onboarding.html: Missing light theme CSS**
- Onboarding page only had dark theme CSS variables in `:root`. When user selected "Light" theme during onboarding, `FTTheme.apply('light')` added the `.light-theme` class but there were no corresponding CSS rules to override the dark colors.
- The page stayed visually dark or broke with mixed colors when light theme was selected.
- **Fix:** Added `.light-theme` CSS block with proper light color variables (`--bg:#F5F5F5`, `--s1:#FFFFFF`, etc.) and overrides for all interactive elements (inputs, cards, buttons, dots, radio indicators). Removed hardcoded dark radial gradient from body background so it respects the CSS variable `--bg`.

**Bug 2 — MainMenu.html: Username hardcoded as "Darko"**
- The dashboard greeting (`Good morning, Darko`) had the name hardcoded in the string literal instead of reading from `FT.getSetting('userName')`.
- Even though Onboarding correctly saved the user's name via `FT.setSetting('userName', name)`, MainMenu never read it back.
- **Fix:** Greeting now reads `FT.getSetting('userName')` and falls back to "there" if no name is set.

#### Files Modified in Session 11

| File | Changes |
|------|---------|
| `Onboarding.html` | Added `.light-theme` CSS variables and element overrides; removed hardcoded dark radial gradient from body |
| `MainMenu.html` | Changed greeting from hardcoded "Darko" to dynamic `FT.getSetting('userName')` with fallback |

**Bug 3 — Onboarding.html: Layout and AMOLED theme overhaul**
- The onboarding screen had large empty space at the top, content was not vertically centered on mobile.
- The `theme-color` meta tag was `#1a1d27` instead of true AMOLED black `#000000`.
- Surface colors (`--s2:#141414`) were too bright for AMOLED dark look.
- The last slide had hardcoded "Darko" in the greeting instead of defaulting to "there".
- **Fix:** Complete redesign of Onboarding.html:
  - Set `theme-color` to `#000000` for AMOLED black status bar.
  - Updated CSS variables: `--bg:#000000`, `--s2:#111111`, `--s3:#1A1A1A` for true AMOLED dark surfaces.
  - Added `min-height:100dvh` for proper mobile viewport centering.
  - Set `html` and `body` background to `#000000` explicitly to prevent any white flash.
  - Improved spacing, padding, and font sizes for better mobile layout.
  - Default name display changed from "Darko" to "there".
  - Light theme uses `--s1:#FFFFFF` for card backgrounds (cleaner contrast).
  - Dark theme description updated to "AMOLED black".

| File | Changes |
|------|---------|
| `Onboarding.html` | Complete AMOLED dark theme redesign; fixed layout centering; updated theme-color meta; fixed default name |

### Session 9 — Platform Hardening, Auth, Validation, Offline, Docs

Implemented a broad upgrade pass covering architecture, security, offline behavior, accessibility, documentation, and contributor readiness.

**Authentication & session foundation**
- Added `Login.html` and `Signup.html` for local account creation/sign-in
- Added `fintrack-auth.js` for session handling, auth guards, and sign-out flow
- Updated `index.html` to route users through auth before onboarding/dashboard
- Added account/logout surface in `Settings.html`

**Config & sync readiness**
- Added `fintrack-config.example.js` for environment-style configuration
- Updated `fintrack-sync.js` to read Supabase settings from `window.FTConfig`
- Added validation for missing Supabase configuration to avoid silent sync failures

**Shared modules / maintainability**
- Added `fintrack-ui.js` for shared bootstrapping, service worker registration, focus styles, accessibility labels, and app-lock overlay
- Added `fintrack-validation.js` for reusable validation across entities and imports
- Included shared modules across app pages

**Data validation & safer imports**
- Added validation hooks to transaction, account, budget, goal, debt, and split creation flows in `fintrack-data.js`
- Added schema versioning and stronger import checks
- Included auth user export/import support for backup portability

**Security & privacy**
- Added app-lock passcode support via settings + unlock overlay
- Added guarded export/clear-data behavior when app lock is enabled
- Added optional protected JSON export wrapper flow

**Offline/PWA improvements**
- Added `Offline.html` fallback page
- Rebuilt `service-worker.js` to cache new auth/shared files and use offline fallback for navigation requests
- Updated `manifest.json` start URL and shortcuts

**Accessibility & UX polish**
- Added automatic ARIA labels for icon-only controls where possible
- Added focus-visible styling and reduced-motion support through shared UI module
- Added global signed-in session badge for authenticated app pages

**Insights & smart finance signals**
- Retained and surfaced the existing shared `FTInsights` engine as part of the hardening pass so dashboard insights remain a first-class feature

**Testing & docs**
- Added `README.md`
- Added `tests/run-tests.js` for validation/auth/data smoke coverage
- Expanded project memory so future sessions can understand the new structure quickly
