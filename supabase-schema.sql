-- ============================================================
-- FinTrack — Supabase Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension (already enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- USERS TABLE (device-based, anonymous)
-- ─────────────────────────────────────────────
-- We use a device_id (UUID stored in localStorage) as the user identifier.
-- No login required. Each device gets its own isolated data.

CREATE TABLE IF NOT EXISTS ft_users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id   TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  last_seen   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_transactions (
  id          TEXT PRIMARY KEY,          -- e.g. "t1773864650691"
  user_id     UUID NOT NULL REFERENCES ft_users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('expense','income','transfer')),
  amount      NUMERIC(14,2) NOT NULL,
  category    TEXT NOT NULL,
  account     TEXT NOT NULL,
  date        TIMESTAMPTZ NOT NULL,
  note        TEXT DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  status      TEXT DEFAULT 'cleared',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tx_user ON ft_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tx_date ON ft_transactions(date DESC);

-- ─────────────────────────────────────────────
-- ACCOUNTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_accounts (
  id          TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES ft_users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT DEFAULT '🏦',
  type        TEXT DEFAULT 'savings',
  balance     NUMERIC(14,2) DEFAULT 0,
  color       TEXT DEFAULT '#80CBC4',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acc_user ON ft_accounts(user_id);

-- ─────────────────────────────────────────────
-- CREDIT CARDS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_credit_cards (
  id          TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES ft_users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  card_limit  NUMERIC(14,2) DEFAULT 0,
  used        NUMERIC(14,2) DEFAULT 0,
  billing_day INTEGER DEFAULT 17,
  color       TEXT DEFAULT '#E88E8E',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cc_user ON ft_credit_cards(user_id);

-- ─────────────────────────────────────────────
-- BUDGETS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_budgets (
  id          TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES ft_users(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,
  budget_limit NUMERIC(14,2) DEFAULT 0,
  spent       NUMERIC(14,2) DEFAULT 0,
  color       TEXT DEFAULT '#80CBC4',
  icon        TEXT DEFAULT 'receipt',
  rollover    NUMERIC(14,2) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bud_user ON ft_budgets(user_id);

-- ─────────────────────────────────────────────
-- GOALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_goals (
  id          TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES ft_users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '🎯',
  target      NUMERIC(14,2) DEFAULT 0,
  saved       NUMERIC(14,2) DEFAULT 0,
  deadline    DATE,
  color       TEXT DEFAULT '#80CBC4',
  milestones  INTEGER[] DEFAULT '{25,50,75,100}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goal_user ON ft_goals(user_id);

-- ─────────────────────────────────────────────
-- SETTINGS  (one row per user)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_settings (
  user_id           UUID PRIMARY KEY REFERENCES ft_users(id) ON DELETE CASCADE,
  theme             TEXT DEFAULT 'dark',
  accent_color      TEXT DEFAULT '#80CBC4',
  currency          TEXT DEFAULT 'INR',
  locale            TEXT DEFAULT 'en-IN',
  date_format       TEXT DEFAULT 'DD/MM/YYYY',
  week_start        TEXT DEFAULT 'monday',
  budget_rollover   BOOLEAN DEFAULT FALSE,
  onboarding_done   BOOLEAN DEFAULT FALSE,
  user_name         TEXT DEFAULT '',
  extra             JSONB DEFAULT '{}',  -- for any new settings added later
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- NET WORTH HISTORY
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ft_nw_history (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES ft_users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  value       NUMERIC(14,2) NOT NULL,
  UNIQUE (user_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_nwh_user ON ft_nw_history(user_id, snapshot_date DESC);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Each device can only read/write its own data
-- ─────────────────────────────────────────────

-- We use a custom JWT claim OR a session variable trick.
-- Simplest approach for anonymous: pass device_id via Supabase anon key + RLS using a helper function.

-- Helper function: returns the ft_users.id for the current device_id
-- (device_id is passed as a request header: x-device-id)
CREATE OR REPLACE FUNCTION ft_current_user_id()
RETURNS UUID AS $$
  SELECT id FROM ft_users WHERE device_id = current_setting('request.headers', true)::json->>'x-device-id'
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE ft_users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_accounts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_budgets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_goals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ft_nw_history  ENABLE ROW LEVEL SECURITY;

-- ft_users: device can see/update own row only
CREATE POLICY "users_own" ON ft_users FOR ALL USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- ft_transactions: user can only CRUD their own transactions
CREATE POLICY "tx_own" ON ft_transactions FOR ALL USING (user_id = ft_current_user_id());

-- ft_accounts
CREATE POLICY "acc_own" ON ft_accounts FOR ALL USING (user_id = ft_current_user_id());

-- ft_credit_cards
CREATE POLICY "cc_own" ON ft_credit_cards FOR ALL USING (user_id = ft_current_user_id());

-- ft_budgets
CREATE POLICY "bud_own" ON ft_budgets FOR ALL USING (user_id = ft_current_user_id());

-- ft_goals
CREATE POLICY "goal_own" ON ft_goals FOR ALL USING (user_id = ft_current_user_id());

-- ft_settings
CREATE POLICY "set_own" ON ft_settings FOR ALL USING (user_id = ft_current_user_id());

-- ft_nw_history
CREATE POLICY "nwh_own" ON ft_nw_history FOR ALL USING (user_id = ft_current_user_id());

-- ─────────────────────────────────────────────
-- UPDATED_AT auto-trigger (optional but nice)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_tx     BEFORE UPDATE ON ft_transactions  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_acc    BEFORE UPDATE ON ft_accounts       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_cc     BEFORE UPDATE ON ft_credit_cards   FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_bud    BEFORE UPDATE ON ft_budgets        FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_goal   BEFORE UPDATE ON ft_goals          FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_set    BEFORE UPDATE ON ft_settings       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
