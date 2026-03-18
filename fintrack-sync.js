/**
 * FinTrack — Supabase Sync Layer
 * ─────────────────────────────────────────────────────────
 * Strategy: localStorage-first, sync to Supabase in background.
 * - All reads come from localStorage (instant, works offline)
 * - All writes go to localStorage immediately, then replicate to Supabase
 * - On page load, fetches latest data from Supabase and merges into localStorage
 * - A pending queue handles writes that failed when offline
 * ─────────────────────────────────────────────────────────
 * SETUP:
 *   1. Run supabase-schema.sql in your Supabase SQL editor
 *   2. Replace SUPABASE_URL and SUPABASE_ANON_KEY below with your project values
 *   3. Include this file AFTER fintrack-data.js on every HTML page:
 *      <script src="fintrack-data.js"></script>
 *      <script src="fintrack-sync.js"></script>
 */

// ─────────────────────────────────────────────
//  !! CONFIGURE YOUR PROJECT HERE !!
// ─────────────────────────────────────────────
const SUPABASE_URL      = "https://YOUR_PROJECT_ID.supabase.co";   // ← paste yours
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";                          // ← paste yours
// ─────────────────────────────────────────────

const FTSync = (() => {

  // ── Device identity ──────────────────────────
  function getDeviceId() {
    let id = localStorage.getItem("ft_device_id");
    if (!id) {
      id = "dev_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("ft_device_id", id);
    }
    return id;
  }

  const DEVICE_ID = getDeviceId();
  let _userId = null;   // Supabase ft_users.id (UUID), resolved on first sync

  // ── Offline queue ─────────────────────────────
  // Pending ops that failed due to network issues are stored here
  function getPendingQueue() {
    try { return JSON.parse(localStorage.getItem("ft_sync_queue") || "[]"); }
    catch(e) { return []; }
  }
  function setPendingQueue(q) {
    localStorage.setItem("ft_sync_queue", JSON.stringify(q));
  }
  function enqueue(op) {
    const q = getPendingQueue();
    q.push({ ...op, queuedAt: new Date().toISOString() });
    if (q.length > 500) q.splice(0, q.length - 500); // cap size
    setPendingQueue(q);
  }
  function clearQueue() { localStorage.removeItem("ft_sync_queue"); }

  // ── HTTP helper ──────────────────────────────
  async function sb(path, method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + SUPABASE_ANON_KEY,
      "x-device-id": DEVICE_ID,
      "Prefer": method === "POST" ? "return=representation" : "return=minimal",
    };
    const opts = { method, headers };
    if (body !== null) opts.body = JSON.stringify(body);
    const res = await fetch(SUPABASE_URL + "/rest/v1/" + path, opts);
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(`Supabase ${method} ${path} → ${res.status}: ${err}`);
    }
    // 204 No Content (DELETE/PATCH with no return)
    if (res.status === 204) return null;
    return res.json().catch(() => null);
  }

  // ── Upsert helpers ────────────────────────────
  async function upsert(table, row) {
    return sb(table + "?on_conflict=id", "POST", row);
  }
  async function remove(table, id) {
    return sb(table + "?id=eq." + encodeURIComponent(id), "DELETE");
  }
  async function fetchAll(table) {
    return sb(table + "?user_id=eq." + _userId + "&order=id");
  }

  // ── Ensure user exists in Supabase ───────────
  async function ensureUser() {
    if (_userId) return _userId;
    // Try to find existing user by device_id
    let data = await sb("ft_users?device_id=eq." + encodeURIComponent(DEVICE_ID) + "&select=id");
    if (data && data.length > 0) {
      _userId = data[0].id;
    } else {
      // Create new user
      const created = await sb("ft_users", "POST", { device_id: DEVICE_ID });
      _userId = created && created[0] ? created[0].id : null;
    }
    if (_userId) {
      // Update last_seen
      sb("ft_users?device_id=eq." + encodeURIComponent(DEVICE_ID), "PATCH", { last_seen: new Date().toISOString() }).catch(()=>{});
    }
    return _userId;
  }

  // ── Map FT local format → Supabase row ───────
  function txToRow(t, userId) {
    return {
      id: t.id, user_id: userId,
      name: t.n, type: t.ty, amount: t.a,
      category: t.cat, account: t.acc,
      date: t.d, note: t.note || "",
      tags: t.tags || [], status: t.status || "cleared"
    };
  }
  function rowToTx(r) {
    return { id: r.id, n: r.name, ty: r.type, a: parseFloat(r.amount),
      cat: r.category, acc: r.account, d: r.date, note: r.note || "",
      tags: r.tags || [], status: r.status || "cleared" };
  }

  function accToRow(a, userId) {
    return { id: a.id, user_id: userId, name: a.name, icon: a.icon || "🏦",
      type: a.type || "savings", balance: a.balance || 0, color: a.color || "#80CBC4" };
  }
  function rowToAcc(r) {
    return { id: r.id, name: r.name, icon: r.icon, type: r.type,
      balance: parseFloat(r.balance), color: r.color };
  }

  function ccToRow(c, userId) {
    return { id: c.id, user_id: userId, name: c.name,
      card_limit: c.limit || 0, used: c.used || 0,
      billing_day: c.billing || 17, color: c.color || "#E88E8E" };
  }
  function rowToCC(r) {
    return { id: r.id, name: r.name, limit: parseFloat(r.card_limit),
      used: parseFloat(r.used), billing: r.billing_day, color: r.color };
  }

  function budToRow(b, userId) {
    return { id: b.id, user_id: userId, category: b.cat,
      budget_limit: b.limit || 0, spent: b.spent || 0,
      color: b.color || "#80CBC4", icon: b.icon || "receipt", rollover: b.rollover || 0 };
  }
  function rowToBud(r) {
    return { id: r.id, cat: r.category, limit: parseFloat(r.budget_limit),
      spent: parseFloat(r.spent), color: r.color, icon: r.icon, rollover: parseFloat(r.rollover || 0) };
  }

  function goalToRow(g, userId) {
    return { id: g.id, user_id: userId, name: g.name, emoji: g.emoji || "🎯",
      target: g.target || 0, saved: g.saved || 0, deadline: g.deadline || null,
      color: g.color || "#80CBC4", milestones: g.milestones || [25,50,75,100] };
  }
  function rowToGoal(r) {
    return { id: r.id, name: r.name, emoji: r.emoji, target: parseFloat(r.target),
      saved: parseFloat(r.saved), deadline: r.deadline, color: r.color,
      milestones: r.milestones || [25,50,75,100] };
  }

  function settingsToRow(s, userId) {
    return {
      user_id: userId,
      theme: s.theme || "dark",
      accent_color: s.accentColor || "#80CBC4",
      currency: s.currency || "INR",
      locale: s.locale || "en-IN",
      date_format: s.dateFormat || "DD/MM/YYYY",
      week_start: s.weekStart || "monday",
      budget_rollover: s.budgetRollover || false,
      onboarding_done: s.onboardingDone || false,
      user_name: s.userName || "",
      extra: JSON.stringify({ notifications: s.notifications || {}, dashboardWidgets: s.dashboardWidgets || [] })
    };
  }
  function rowToSettings(r) {
    let extra = {};
    try { extra = JSON.parse(r.extra || "{}"); } catch(e) {}
    return {
      theme: r.theme, accentColor: r.accent_color, currency: r.currency,
      locale: r.locale, dateFormat: r.date_format, weekStart: r.week_start,
      budgetRollover: r.budget_rollover, onboardingDone: r.onboarding_done,
      userName: r.user_name, notifications: extra.notifications || {},
      dashboardWidgets: extra.dashboardWidgets || []
    };
  }

  // ── PUSH: localStorage → Supabase ────────────
  // Called after each mutation (addTX, updateTX, etc.)

  async function pushTx(tx, op = "upsert") {
    await ensureUser();
    if (!_userId) return;
    if (op === "delete") {
      await remove("ft_transactions", tx.id);
    } else {
      await upsert("ft_transactions", txToRow(tx, _userId));
    }
  }

  async function pushAccount(acc, op = "upsert") {
    await ensureUser();
    if (!_userId) return;
    if (op === "delete") await remove("ft_accounts", acc.id);
    else await upsert("ft_accounts", accToRow(acc, _userId));
  }

  async function pushCC(cc, op = "upsert") {
    await ensureUser();
    if (!_userId) return;
    if (op === "delete") await remove("ft_credit_cards", cc.id);
    else await upsert("ft_credit_cards", ccToRow(cc, _userId));
  }

  async function pushBudget(b, op = "upsert") {
    await ensureUser();
    if (!_userId) return;
    if (op === "delete") await remove("ft_budgets", b.id);
    else await upsert("ft_budgets", budToRow(b, _userId));
  }

  async function pushGoal(g, op = "upsert") {
    await ensureUser();
    if (!_userId) return;
    if (op === "delete") await remove("ft_goals", g.id);
    else await upsert("ft_goals", goalToRow(g, _userId));
  }

  async function pushSettings() {
    await ensureUser();
    if (!_userId) return;
    const s = FT.getSettings();
    await sb("ft_settings?user_id=eq." + _userId, "DELETE").catch(()=>{});
    await sb("ft_settings", "POST", settingsToRow(s, _userId));
  }

  async function pushNWSnapshot(snapshot) {
    await ensureUser();
    if (!_userId) return;
    await sb("ft_nw_history", "POST", {
      user_id: _userId,
      snapshot_date: snapshot.date,
      value: snapshot.value
    }).catch(()=>{});  // ignore unique constraint conflicts (same day)
  }

  // ── PULL: Supabase → localStorage ────────────
  // Called on page load; merges remote data into local.
  // Remote wins (cloud is source of truth after first sync).

  async function pullAll() {
    await ensureUser();
    if (!_userId) return;

    const [txRows, accRows, ccRows, budRows, goalRows, setRows] = await Promise.all([
      fetchAll("ft_transactions"),
      fetchAll("ft_accounts"),
      fetchAll("ft_credit_cards"),
      fetchAll("ft_budgets"),
      fetchAll("ft_goals"),
      sb("ft_settings?user_id=eq." + _userId)
    ]);

    if (txRows   && txRows.length)   FT.setTX(txRows.map(rowToTx));
    if (accRows  && accRows.length)  FT.setAccounts(accRows.map(rowToAcc));
    if (ccRows   && ccRows.length)   FT.setCreditCards(ccRows.map(rowToCC));
    if (budRows  && budRows.length)  FT.setBudgets(budRows.map(rowToBud));
    if (goalRows && goalRows.length) FT.setGoals(goalRows.map(rowToGoal));
    if (setRows  && setRows.length)  FT.setSettings(rowToSettings(setRows[0]));

    console.log("[FTSync] Pull complete — tx:", txRows?.length, "accounts:", accRows?.length);
  }

  // ── PUSH ALL: localStorage → Supabase ────────
  // Full sync push — used for initial upload or after import

  async function pushAll() {
    await ensureUser();
    if (!_userId) return;

    const txs     = FT.getTX();
    const accs    = FT.getAccounts();
    const ccs     = FT.getCreditCards();
    const budgets = FT.getBudgets();
    const goals   = FT.getGoals();

    // Batch upsert via array
    const batchUpsert = async (table, rows) => {
      if (!rows.length) return;
      // Split into chunks of 100
      for (let i = 0; i < rows.length; i += 100) {
        await sb(table + "?on_conflict=id", "POST", rows.slice(i, i + 100));
      }
    };

    await Promise.all([
      batchUpsert("ft_transactions",  txs.map(t   => txToRow(t, _userId))),
      batchUpsert("ft_accounts",      accs.map(a  => accToRow(a, _userId))),
      batchUpsert("ft_credit_cards",  ccs.map(c   => ccToRow(c, _userId))),
      batchUpsert("ft_budgets",       budgets.map(b => budToRow(b, _userId))),
      batchUpsert("ft_goals",         goals.map(g => goalToRow(g, _userId))),
      pushSettings()
    ]);

    console.log("[FTSync] Push all complete");
  }

  // ── Drain offline queue ───────────────────────
  async function drainQueue() {
    const q = getPendingQueue();
    if (!q.length) return;
    console.log("[FTSync] Draining", q.length, "queued ops...");
    const remaining = [];
    for (const op of q) {
      try {
        await ensureUser();
        if (!_userId) { remaining.push(op); continue; }
        const { table, action, payload } = op;
        if (action === "delete") await remove(table, payload.id);
        else await upsert(table, { ...payload, user_id: _userId });
      } catch(e) {
        remaining.push(op); // keep if still failing
      }
    }
    setPendingQueue(remaining);
    if (remaining.length < q.length) console.log("[FTSync] Drained", q.length - remaining.length, "ops");
  }

  // ── Safe push: catch errors, enqueue on failure ─
  function safePush(fn, table, action, payload) {
    fn().catch(err => {
      console.warn("[FTSync] Offline — queuing op:", action, table, err.message);
      enqueue({ table, action, payload });
    });
  }

  // ── Status indicator ─────────────────────────
  function showSyncStatus(status) {
    let indicator = document.getElementById("ft-sync-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "ft-sync-indicator";
      indicator.style.cssText = `
        position:fixed; bottom:80px; right:12px; z-index:9999;
        padding:4px 10px; border-radius:100px; font-size:11px; font-weight:600;
        pointer-events:none; transition:opacity .4s;
        font-family:-apple-system,sans-serif;
      `;
      document.body.appendChild(indicator);
    }
    if (status === "syncing") {
      indicator.textContent = "⟳ Syncing...";
      indicator.style.background = "rgba(130,181,232,0.25)";
      indicator.style.color = "#82B5E8";
      indicator.style.opacity = "1";
    } else if (status === "done") {
      indicator.textContent = "✓ Synced";
      indicator.style.background = "rgba(150,204,152,0.25)";
      indicator.style.color = "#96CC98";
      indicator.style.opacity = "1";
      setTimeout(() => { indicator.style.opacity = "0"; }, 2000);
    } else if (status === "offline") {
      indicator.textContent = "● Offline";
      indicator.style.background = "rgba(232,142,142,0.25)";
      indicator.style.color = "#E88E8E";
      indicator.style.opacity = "1";
    } else if (status === "error") {
      indicator.textContent = "⚠ Sync error";
      indicator.style.background = "rgba(232,176,110,0.25)";
      indicator.style.color = "#E8B06E";
      indicator.style.opacity = "1";
      setTimeout(() => { indicator.style.opacity = "0"; }, 4000);
    }
  }

  // ── Init: pull on page load ───────────────────
  async function init() {
    // Skip if not configured
    if (SUPABASE_URL === "https://YOUR_PROJECT_ID.supabase.co") {
      console.info("[FTSync] Not configured — skipping. Set SUPABASE_URL and SUPABASE_ANON_KEY in fintrack-sync.js");
      return;
    }

    if (!navigator.onLine) {
      showSyncStatus("offline");
      return;
    }

    showSyncStatus("syncing");

    try {
      await pullAll();
      await drainQueue();
      showSyncStatus("done");
    } catch(e) {
      console.warn("[FTSync] Sync failed:", e.message);
      showSyncStatus("error");
    }
  }

  // Listen for online event to drain queue
  window.addEventListener("online", () => {
    drainQueue().catch(()=>{});
    showSyncStatus("syncing");
    pullAll().then(() => showSyncStatus("done")).catch(() => showSyncStatus("error"));
  });
  window.addEventListener("offline", () => showSyncStatus("offline"));

  // ── Public API ────────────────────────────────
  return {
    init,
    pushAll,
    pullAll,

    // Called by fintrack-data.js hooks:
    onAddTx    : (tx)     => safePush(() => pushTx(tx, "upsert"),       "ft_transactions",  "upsert",  txToRow(tx, _userId)),
    onUpdateTx : (id, tx) => safePush(() => pushTx(tx, "upsert"),       "ft_transactions",  "upsert",  txToRow(tx, _userId)),
    onDeleteTx : (id)     => safePush(() => pushTx({id}, "delete"),     "ft_transactions",  "delete",  {id}),
    onBulkDeleteTx: (ids) => ids.forEach(id => safePush(() => pushTx({id}, "delete"), "ft_transactions", "delete", {id})),

    onAddAcc   : (acc)    => safePush(() => pushAccount(acc, "upsert"),  "ft_accounts",      "upsert",  accToRow(acc, _userId)),
    onUpdateAcc: (id, acc)=> safePush(() => pushAccount(acc, "upsert"),  "ft_accounts",      "upsert",  accToRow(acc, _userId)),
    onDeleteAcc: (id)     => safePush(() => pushAccount({id}, "delete"), "ft_accounts",      "delete",  {id}),

    onAddCC    : (cc)     => safePush(() => pushCC(cc, "upsert"),        "ft_credit_cards",  "upsert",  ccToRow(cc, _userId)),
    onDeleteCC : (id)     => safePush(() => pushCC({id}, "delete"),      "ft_credit_cards",  "delete",  {id}),

    onAddBudget   : (b)   => safePush(() => pushBudget(b, "upsert"),     "ft_budgets",       "upsert",  budToRow(b, _userId)),
    onUpdateBudget: (id,b)=> safePush(() => pushBudget(b, "upsert"),     "ft_budgets",       "upsert",  budToRow(b, _userId)),
    onDeleteBudget: (id)  => safePush(() => pushBudget({id}, "delete"),  "ft_budgets",       "delete",  {id}),

    onAddGoal   : (g)     => safePush(() => pushGoal(g, "upsert"),       "ft_goals",         "upsert",  goalToRow(g, _userId)),
    onUpdateGoal: (id, g) => safePush(() => pushGoal(g, "upsert"),       "ft_goals",         "upsert",  goalToRow(g, _userId)),
    onDeleteGoal: (id)    => safePush(() => pushGoal({id}, "delete"),    "ft_goals",         "delete",  {id}),

    onSettingsChange: ()  => safePush(() => pushSettings(),              "ft_settings",      "upsert",  {}),
    onNWSnapshot: (snap)  => safePush(() => pushNWSnapshot(snap),        "ft_nw_history",    "upsert",  snap),

    getDeviceId: () => DEVICE_ID,
    getUserId:   () => _userId,
    isConfigured: () => SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co",
    getPendingCount: () => getPendingQueue().length,
  };

})();

// Auto-init on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => FTSync.init());
