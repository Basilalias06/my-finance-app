/**
 * FinTrack — Shared Data Layer (Session 8)
 * Provides localStorage persistence, shared transaction/account data,
 * theme management, and utility functions used across all pages.
 */

// ─────────────────────────────────────────────
//  DEFAULT SEED DATA
// ─────────────────────────────────────────────
const DEFAULT_TRANSACTIONS = [
  {id:"t1",n:"Grocery",ty:"expense",a:2450,cat:"Food & Dining",acc:"UPI",d:"2026-03-17T10:30",note:"",tags:[]},
  {id:"t2",n:"Salary Mar",ty:"income",a:85000,cat:"Salary",acc:"Bank Account",d:"2026-03-17T09:00",note:"",tags:[]},
  {id:"t3",n:"Netflix",ty:"expense",a:649,cat:"Entertainment",acc:"Credit Card",d:"2026-03-16T14:20",note:"Subscription",tags:["subscription"]},
  {id:"t4",n:"Freelance",ty:"income",a:15000,cat:"Freelance",acc:"Bank Account",d:"2026-03-15T16:45",note:"",tags:[]},
  {id:"t5",n:"Uber",ty:"expense",a:320,cat:"Transport",acc:"UPI",d:"2026-03-15T08:30",note:"",tags:[]},
  {id:"t6",n:"Transfer",ty:"transfer",a:10000,cat:"Transfer",acc:"Bank Account",d:"2026-03-14T11:00",note:"To savings",tags:[]},
  {id:"t7",n:"Electricity",ty:"expense",a:1850,cat:"Bills",acc:"UPI",d:"2026-03-12T18:10",note:"",tags:["bill"]},
  {id:"t8",n:"Coffee",ty:"expense",a:180,cat:"Food & Dining",acc:"Cash",d:"2026-03-12T11:00",note:"",tags:[]},
  {id:"t9",n:"Dividends",ty:"income",a:3200,cat:"Investments",acc:"Bank Account",d:"2026-03-10T09:15",note:"",tags:[]},
  {id:"t10",n:"Gym",ty:"expense",a:1500,cat:"Health",acc:"Credit Card",d:"2026-03-08T07:00",note:"Monthly membership",tags:["subscription"]},
  {id:"t11",n:"Dining",ty:"expense",a:2200,cat:"Food & Dining",acc:"Credit Card",d:"2026-03-05T20:30",note:"",tags:[]},
  {id:"t12",n:"Books",ty:"expense",a:450,cat:"Education",acc:"UPI",d:"2026-03-03T15:00",note:"",tags:[]},
  {id:"t13",n:"Rent",ty:"expense",a:18000,cat:"Housing",acc:"Bank Account",d:"2026-03-01T10:00",note:"March rent",tags:["bill"]},
  {id:"t14",n:"Client Pay",ty:"income",a:25000,cat:"Freelance",acc:"Bank Account",d:"2026-02-28T14:00",note:"",tags:[]},
  {id:"t15",n:"Petrol",ty:"expense",a:1200,cat:"Transport",acc:"Cash",d:"2026-02-26T16:30",note:"",tags:[]},
  {id:"t16",n:"Salary Feb",ty:"income",a:85000,cat:"Salary",acc:"Bank Account",d:"2026-02-15T09:00",note:"",tags:[]},
  {id:"t17",n:"Insurance",ty:"expense",a:3500,cat:"Insurance",acc:"Bank Account",d:"2026-02-10T10:00",note:"",tags:["bill"]},
  {id:"t18",n:"Shopping",ty:"expense",a:4200,cat:"Shopping",acc:"Credit Card",d:"2026-02-05T16:00",note:"",tags:[]},
  {id:"t19",n:"Salary Jan",ty:"income",a:82000,cat:"Salary",acc:"Bank Account",d:"2026-01-15T09:00",note:"",tags:[]},
  {id:"t20",n:"NY Dinner",ty:"expense",a:3800,cat:"Food & Dining",acc:"Credit Card",d:"2026-01-01T21:00",note:"New Year dinner",tags:[]},
];

const DEFAULT_ACCOUNTS = [
  {id:"acc1",name:"Cash",icon:"💰",type:"cash",balance:12500,color:"#E8B06E"},
  {id:"acc2",name:"SBI Savings",icon:"🏦",type:"savings",balance:145000,color:"#7ECEC6"},
  {id:"acc3",name:"HDFC Checking",icon:"🏦",type:"checking",balance:68000,color:"#82B5E8"},
  {id:"acc4",name:"UPI / GPay",icon:"⚡",type:"upi",balance:8200,color:"#96CC98"},
  {id:"acc5",name:"Paytm Wallet",icon:"🔐",type:"wallet",balance:3400,color:"#C293D8"},
];

const DEFAULT_CREDIT_CARDS = [
  {id:"cc1",name:"Axis Credit Card",limit:190000,used:10663.54,billing:17,color:"#E88E8E"},
  {id:"cc2",name:"Federal Credit Card",limit:70000,used:0,billing:17,color:"#82B5E8"},
  {id:"cc3",name:"HDFC Credit Card",limit:116000,used:0,billing:17,color:"#96CC98"},
  {id:"cc4",name:"ICICI Credit Card",limit:160000,used:5399.20,billing:17,color:"#E8B06E"},
  {id:"cc5",name:"SBI Credit Card",limit:80000,used:0,billing:17,color:"#C293D8"},
];

const DEFAULT_BUDGETS = [
  {id:"b1",cat:"Food & Dining",limit:8000,spent:4830,color:"#E88E8E",icon:"restaurant",rollover:0},
  {id:"b2",cat:"Transport",limit:3000,spent:1520,color:"#82B5E8",icon:"directions_car",rollover:0},
  {id:"b3",cat:"Entertainment",limit:2000,spent:649,color:"#C293D8",icon:"movie",rollover:0},
  {id:"b4",cat:"Bills",limit:25000,spent:19850,color:"#E8B06E",icon:"receipt",rollover:0},
  {id:"b5",cat:"Shopping",limit:5000,spent:4200,color:"#7ECEC6",icon:"shopping_bag",rollover:0},
  {id:"b6",cat:"Health",limit:3000,spent:1500,color:"#96CC98",icon:"favorite",rollover:0},
  {id:"b7",cat:"Education",limit:2000,spent:450,color:"#A18870",icon:"school",rollover:0},
];

const DEFAULT_GOALS = [
  {id:"g1",name:"Emergency Fund",emoji:"🛡️",target:500000,saved:200000,deadline:"2026-12-31",color:"#7ECEC6",milestones:[25,50,75,100]},
  {id:"g2",name:"Vacation Fund",emoji:"✈️",target:100000,saved:45000,deadline:"2026-09-30",color:"#82B5E8",milestones:[25,50,75,100]},
  {id:"g3",name:"New Laptop",emoji:"💻",target:80000,saved:30000,deadline:"2026-06-30",color:"#96CC98",milestones:[25,50,75,100]},
  {id:"g4",name:"Wedding Gift",emoji:"💍",target:70000,saved:10000,deadline:"2026-11-15",color:"#E8B06E",milestones:[25,50,75,100]},
];

const DEFAULT_TEMPLATES = [
  {id:"tpl1",name:"Monthly Rent",ty:"expense",a:18000,cat:"Housing",acc:"Bank Account",note:"Monthly rent"},
  {id:"tpl2",name:"Salary Credit",ty:"income",a:85000,cat:"Salary",acc:"Bank Account",note:""},
  {id:"tpl3",name:"Netflix Sub",ty:"expense",a:649,cat:"Entertainment",acc:"Credit Card",note:"Subscription"},
  {id:"tpl4",name:"Gym Membership",ty:"expense",a:1500,cat:"Health",acc:"Credit Card",note:"Monthly membership"},
];

const DEFAULT_SETTINGS = {
  theme: "dark",          // dark | light | system
  accentColor: "#80CBC4",
  currency: "INR",
  locale: "en-IN",
  dateFormat: "DD/MM/YYYY",
  weekStart: "monday",
  financialYearStart: "april",
  notifications: {
    dailyReminder: false,
    budgetAlerts: true,
    billReminders: true,
    weeklySummary: false,
  },
  budgetRollover: false,
  onboardingDone: false,
  dashboardWidgets: ["overview","accounts","creditcards","categories","incomevexpense","networth","daily","quickaccess"],
};

// ─────────────────────────────────────────────
//  STORAGE HELPERS
// ─────────────────────────────────────────────
const FT = {
  // ── Read / Write ──────────────────────────
  _get(key, def) {
    try {
      const v = localStorage.getItem("ft_" + key);
      return v !== null ? JSON.parse(v) : def;
    } catch(e) { return def; }
  },
  _set(key, val) {
    try { localStorage.setItem("ft_" + key, JSON.stringify(val)); } catch(e) {}
  },

  // ── Sync hook helper (calls FTSync if loaded) ─
  _sync(fn, ...args) {
    if (typeof FTSync !== "undefined" && FTSync[fn]) {
      try { FTSync[fn](...args); } catch(e) {}
    }
  },

  // ── Transactions ──────────────────────────
  getTX()        { return this._get("transactions", DEFAULT_TRANSACTIONS); },
  setTX(arr)     { this._set("transactions", arr); },
  addTX(tx)      { const a=this.getTX(); tx.id="t"+Date.now(); a.unshift(tx); this.setTX(a); this._sync("onAddTx", tx); return tx; },
  updateTX(id,d) { const a=this.getTX().map(t=>t.id===id?{...t,...d}:t); this.setTX(a); const updated=a.find(t=>t.id===id); this._sync("onUpdateTx", id, updated); },
  deleteTX(id)   { this.setTX(this.getTX().filter(t=>t.id!==id)); this._sync("onDeleteTx", id); },
  bulkDeleteTX(ids){ this.setTX(this.getTX().filter(t=>!ids.includes(t.id))); this._sync("onBulkDeleteTx", ids); },

  // ── Accounts ──────────────────────────────
  getAccounts()    { return this._get("accounts", DEFAULT_ACCOUNTS); },
  setAccounts(arr) { this._set("accounts", arr); },
  addAccount(acc)  { const a=this.getAccounts(); acc.id="acc"+Date.now(); a.push(acc); this.setAccounts(a); this._sync("onAddAcc", acc); return acc; },
  updateAccount(id,d){ const a=this.getAccounts().map(x=>x.id===id?{...x,...d}:x); this.setAccounts(a); const updated=a.find(x=>x.id===id); this._sync("onUpdateAcc", id, updated); },
  deleteAccount(id){ this.setAccounts(this.getAccounts().filter(x=>x.id!==id)); this._sync("onDeleteAcc", id); },

  // ── Credit Cards ──────────────────────────
  getCreditCards()    { return this._get("creditCards", DEFAULT_CREDIT_CARDS); },
  setCreditCards(arr) { this._set("creditCards", arr); },

  // ── Budgets ───────────────────────────────
  getBudgets()      { return this._get("budgets", DEFAULT_BUDGETS); },
  setBudgets(arr)   { this._set("budgets", arr); },
  addBudget(b)      { const a=this.getBudgets(); b.id="b"+Date.now(); a.push(b); this.setBudgets(a); this._sync("onAddBudget", b); return b; },
  updateBudget(id,d){ const a=this.getBudgets().map(x=>x.id===id?{...x,...d}:x); this.setBudgets(a); const updated=a.find(x=>x.id===id); this._sync("onUpdateBudget", id, updated); },
  deleteBudget(id)  { this.setBudgets(this.getBudgets().filter(x=>x.id!==id)); this._sync("onDeleteBudget", id); },

  // ── Goals ─────────────────────────────────
  getGoals()      { return this._get("goals", DEFAULT_GOALS); },
  setGoals(arr)   { this._set("goals", arr); },
  addGoal(g)      { const a=this.getGoals(); g.id="g"+Date.now(); a.push(g); this.setGoals(a); this._sync("onAddGoal", g); return g; },
  updateGoal(id,d){ const a=this.getGoals().map(x=>x.id===id?{...x,...d}:x); this.setGoals(a); const updated=a.find(x=>x.id===id); this._sync("onUpdateGoal", id, updated); },
  deleteGoal(id)  { this.setGoals(this.getGoals().filter(x=>x.id!==id)); this._sync("onDeleteGoal", id); },

  // ── Templates ─────────────────────────────
  getTemplates()      { return this._get("templates", DEFAULT_TEMPLATES); },
  setTemplates(arr)   { this._set("templates", arr); },
  addTemplate(t)      { const a=this.getTemplates(); t.id="tpl"+Date.now(); a.push(t); this.setTemplates(a); return t; },
  deleteTemplate(id)  { this.setTemplates(this.getTemplates().filter(x=>x.id!==id)); },

  // ── Settings ──────────────────────────────
  getSettings()    { return {...DEFAULT_SETTINGS, ...this._get("settings", {})}; },
  setSettings(obj) { this._set("settings", {...this.getSettings(),...obj}); this._sync("onSettingsChange"); },
  getSetting(key)  { return this.getSettings()[key]; },
  setSetting(key,v){ this.setSettings({[key]:v}); },

  // ── Net Worth History ─────────────────────
  getNWHistory()   { return this._get("nwHistory", []); },
  pushNWSnapshot() {
    const accs = this.getAccounts();
    const net = accs.reduce((s,a)=>s+a.balance,0);
    const hist = this.getNWHistory();
    const snap = {date:new Date().toISOString().slice(0,10), value:net};
    hist.push(snap);
    if(hist.length > 365) hist.shift();
    this._set("nwHistory", hist);
    this._sync("onNWSnapshot", snap);
  },

  // ── Notifications (goal milestones) ───────
  getNotifications()   { return this._get("notifications", []); },
  addNotification(n)   {
    const arr = this.getNotifications();
    arr.unshift({id:"n"+Date.now(), ...n, read:false, ts:new Date().toISOString()});
    if(arr.length > 50) arr.pop();
    this._set("notifications", arr);
  },
  markAllRead()        { this._set("notifications", this.getNotifications().map(n=>({...n,read:true}))); },
  getUnreadCount()     { return this.getNotifications().filter(n=>!n.read).length; },

  // ── Data Export ───────────────────────────
  exportCSV() {
    const tx = this.getTX();
    const header = "ID,Name,Type,Amount,Category,Account,Date,Note,Tags";
    const rows = tx.map(t=>[
      t.id, `"${t.n}"`, t.ty, t.a, `"${t.cat}"`, `"${t.acc}"`,
      t.d, `"${t.note||""}"`, `"${(t.tags||[]).join(';')}"`
    ].join(","));
    return [header,...rows].join("\n");
  },
  exportJSON() {
    return JSON.stringify({
      transactions: this.getTX(),
      accounts: this.getAccounts(),
      budgets: this.getBudgets(),
      goals: this.getGoals(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  },
  importJSON(str) {
    try {
      const data = JSON.parse(str);
      if(data.transactions) this.setTX(data.transactions);
      if(data.accounts)     this.setAccounts(data.accounts);
      if(data.budgets)      this.setBudgets(data.budgets);
      if(data.goals)        this.setGoals(data.goals);
      if(data.settings)     this._set("settings", {...this.getSettings(), ...data.settings});
      // Push everything to Supabase after import
      if(typeof FTSync !== "undefined") setTimeout(() => FTSync.pushAll().catch(()=>{}), 500);
      return true;
    } catch(e) { return false; }
  },
  clearAll() {
    ["transactions","accounts","creditCards","budgets","goals","templates",
     "settings","nwHistory","notifications"].forEach(k=>localStorage.removeItem("ft_"+k));
  },
};

// ─────────────────────────────────────────────
//  THEME MANAGER
// ─────────────────────────────────────────────
const FTTheme = {
  apply(theme) {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
    const isDark = theme === "dark" || (theme === "system" && prefersDark);
    root.classList.toggle("light-theme", !isDark);
    root.classList.toggle("dark-theme", isDark);
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    // Apply accent color
    const accent = FT.getSetting("accentColor") || "#80CBC4";
    root.style.setProperty("--accent-custom", accent);
  },
  init() {
    const theme = FT.getSetting("theme") || "dark";
    this.apply(theme);
    // Listen for system preference changes
    window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", () => {
      if(FT.getSetting("theme") === "system") this.apply("system");
    });
  },
};

// ─────────────────────────────────────────────
//  GLOBAL SEARCH
// ─────────────────────────────────────────────
const FTSearch = {
  query(q) {
    if(!q || q.trim().length < 2) return [];
    const s = q.toLowerCase();
    const tx = FT.getTX();
    return tx.filter(t =>
      t.n.toLowerCase().includes(s) ||
      t.cat.toLowerCase().includes(s) ||
      t.acc.toLowerCase().includes(s) ||
      (t.note && t.note.toLowerCase().includes(s)) ||
      (t.tags && t.tags.some(tag=>tag.toLowerCase().includes(s)))
    ).slice(0, 20);
  }
};

// ─────────────────────────────────────────────
//  SPENDING INSIGHTS ENGINE
// ─────────────────────────────────────────────
const FTInsights = {
  generate() {
    const tx = FT.getTX();
    const now = new Date();
    const thisMonth = tx.filter(t=>{
      const d=new Date(t.d); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    });
    const lastMonth = tx.filter(t=>{
      const d=new Date(t.d);
      const lm = new Date(now.getFullYear(), now.getMonth()-1, 1);
      return d.getMonth()===lm.getMonth()&&d.getFullYear()===lm.getFullYear();
    });

    const insights = [];

    // Total spending comparison
    const tmExp = thisMonth.filter(t=>t.ty==="expense").reduce((s,t)=>s+t.a,0);
    const lmExp = lastMonth.filter(t=>t.ty==="expense").reduce((s,t)=>s+t.a,0);
    if(lmExp > 0) {
      const pct = Math.round(((tmExp - lmExp) / lmExp) * 100);
      if(pct > 10) insights.push({icon:"trending_up",color:"var(--exp)",text:`Spending up ${pct}% vs last month (₹${(tmExp-lmExp).toLocaleString('en-IN')})`});
      else if(pct < -10) insights.push({icon:"trending_down",color:"var(--inc)",text:`Great! Spending down ${Math.abs(pct)}% vs last month`});
      else insights.push({icon:"trending_flat",color:"var(--tra)",text:`Spending is stable vs last month`});
    }

    // Top category
    const cats = {};
    thisMonth.filter(t=>t.ty==="expense").forEach(t=>{ cats[t.cat]=(cats[t.cat]||0)+t.a; });
    const topCat = Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];
    if(topCat) insights.push({icon:"category",color:"var(--warn)",text:`Top spend: ${topCat[0]} — ₹${topCat[1].toLocaleString('en-IN')}`});

    // Savings rate
    const tmInc = thisMonth.filter(t=>t.ty==="income").reduce((s,t)=>s+t.a,0);
    if(tmInc > 0) {
      const rate = Math.round(((tmInc - tmExp) / tmInc) * 100);
      if(rate > 0) insights.push({icon:"savings",color:"var(--inc)",text:`Savings rate this month: ${rate}%`});
      else insights.push({icon:"warning",color:"var(--exp)",text:`Overspending! Expenses exceed income by ₹${Math.abs(tmInc-tmExp).toLocaleString('en-IN')}`});
    }

    // Budget alerts
    const budgets = FT.getBudgets();
    budgets.forEach(b => {
      const pct = b.limit > 0 ? (b.spent/b.limit)*100 : 0;
      if(pct >= 90) insights.push({icon:"error",color:"var(--exp)",text:`${b.cat} budget at ${Math.round(pct)}% — only ₹${(b.limit-b.spent).toLocaleString('en-IN')} left`});
    });

    return insights.slice(0, 5);
  }
};

// ─────────────────────────────────────────────
//  GOAL MILESTONE CHECKER
// ─────────────────────────────────────────────
const FTGoalMilestones = {
  check(goal, prevSaved) {
    const pct = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
    const prevPct = goal.target > 0 ? (prevSaved / goal.target) * 100 : 0;
    const milestones = goal.milestones || [25, 50, 75, 100];
    milestones.forEach(m => {
      if(pct >= m && prevPct < m) {
        FT.addNotification({
          title: `Goal Milestone: ${goal.name}`,
          body: `You've reached ${m}% of your ${goal.name} goal! 🎉`,
          type: "milestone",
          goalId: goal.id,
        });
      }
    });
  }
};

// ─────────────────────────────────────────────
//  BUDGET ROLLOVER
// ─────────────────────────────────────────────
const FTBudgetRollover = {
  apply() {
    if(!FT.getSetting("budgetRollover")) return;
    const budgets = FT.getBudgets();
    const updated = budgets.map(b => {
      const unused = Math.max(0, b.limit - b.spent);
      return {...b, rollover: (b.rollover || 0) + unused};
    });
    FT.setBudgets(updated);
  }
};

// ─────────────────────────────────────────────
//  TOAST HELPER (available globally)
// ─────────────────────────────────────────────
function ftToast(msg, type="info", dur=2800) {
  const colors = {success:"#96CC98",error:"#E88E8E",info:"#80CBC4",warn:"#E8B06E"};
  const icons  = {success:"check_circle",error:"error",info:"info",warn:"warning"};
  let el = document.getElementById("ft-toast");
  if(!el){
    el = document.createElement("div");
    el.id = "ft-toast";
    el.style.cssText = [
      "position:fixed","bottom:90px","left:50%","transform:translateX(-50%) translateY(20px)",
      "background:#1E1E1E","color:#EAEAEA","padding:11px 18px","border-radius:100px",
      "font-size:13px","font-weight:500","display:flex","align-items:center","gap:8px",
      "box-shadow:0 8px 32px rgba(0,0,0,0.7)","z-index:9999","opacity:0",
      "transition:all .3s cubic-bezier(.2,0,0,1)","pointer-events:none",
      "font-family:'Google Sans Text',sans-serif","white-space:nowrap","max-width:90vw"
    ].join(";");
    document.body.appendChild(el);
  }
  el.innerHTML = `<span style="font-family:'Material Symbols Rounded';font-size:16px;color:${colors[type]}">${icons[type]}</span>${msg}`;
  el.style.border = `1px solid ${colors[type]}33`;
  requestAnimationFrame(()=>{
    el.style.opacity="1";
    el.style.transform="translateX(-50%) translateY(0)";
  });
  clearTimeout(el._t);
  el._t = setTimeout(()=>{
    el.style.opacity="0";
    el.style.transform="translateX(-50%) translateY(10px)";
  }, dur);
}

// ─────────────────────────────────────────────
//  FORMAT HELPERS
// ─────────────────────────────────────────────
function ftFmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2});
}
function ftFmtShort(n) {
  n = Number(n);
  if(Math.abs(n) >= 1e5) return "₹" + (n/1e5).toFixed(1) + "L";
  if(Math.abs(n) >= 1e3) return "₹" + (n/1e3).toFixed(1) + "K";
  return "₹" + n.toFixed(0);
}
function ftFmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"});
}
function ftGenId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

// ─────────────────────────────────────────────
//  AUTO-INIT THEME ON LOAD
// ─────────────────────────────────────────────
(function() {
  // Apply theme immediately to avoid flash
  const s = FT.getSettings();
  const prefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
  const isDark = s.theme === "dark" || (s.theme === "system" && prefersDark);
  if(!isDark) {
    document.documentElement.classList.add("light-theme");
  }
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.documentElement.style.setProperty("--accent-custom", s.accentColor || "#80CBC4");
})();
