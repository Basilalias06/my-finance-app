(function(global){
  const USERS_KEY = 'ft_auth_users';
  const SESSION_KEY = 'ft_auth_session';
  const PUBLIC_PAGES = new Set(['Login.html','Signup.html','Onboarding.html','Offline.html','index.html']);

  function read(key, fallback){
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch(e){ return fallback; }
  }
  function write(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function hash(value){ return btoa(unescape(encodeURIComponent(value))).replace(/=/g,''); }
  function users(){ return read(USERS_KEY, []); }
  function session(){ return read(SESSION_KEY, null); }

  function signUp({name, email, password}){
    email = (email || '').trim().toLowerCase();
    const existing = users().find(u => u.email === email);
    if(existing) throw new Error('An account already exists for that email.');
    if(!name || !email || !password) throw new Error('Name, email, and password are required.');
    const record = { id: 'usr_' + Date.now(), name: name.trim(), email, passwordHash: hash(password), createdAt: new Date().toISOString() };
    const next = users(); next.push(record); write(USERS_KEY, next);
    write(SESSION_KEY, { id: record.id, name: record.name, email: record.email, signedInAt: new Date().toISOString() });
    if(global.FT && FT.setSetting){ FT.setSetting('userName', record.name); FT.setSetting('userEmail', record.email); }
    return record;
  }

  function signIn({email, password}){
    email = (email || '').trim().toLowerCase();
    const record = users().find(u => u.email === email && u.passwordHash === hash(password || ''));
    if(!record) throw new Error('Invalid email or password.');
    const current = { id: record.id, name: record.name, email: record.email, signedInAt: new Date().toISOString() };
    write(SESSION_KEY, current);
    if(global.FT && FT.setSetting){ FT.setSetting('userName', record.name); FT.setSetting('userEmail', record.email); }
    return current;
  }

  function signOut(){ localStorage.removeItem(SESSION_KEY); }
  function isAuthenticated(){ return !!session(); }
  function currentUser(){ return session(); }
  function isPublicPage(pathname){ return PUBLIC_PAGES.has(pathname.split('/').pop()); }
  function requireAuth(){
    const page = location.pathname.split('/').pop() || 'index.html';
    const configRequiresAuth = !(global.FTConfig && global.FTConfig.requireAuth === false);
    if(!configRequiresAuth || isPublicPage(page)) return true;
    if(!isAuthenticated()) {
      const next = encodeURIComponent(page);
      location.replace('Login.html?next=' + next);
      return false;
    }
    return true;
  }

  function setPasscode(passcode){ if(global.FT) FT.setSetting('appLockPasscode', hash(passcode)); FT.setSetting('appLockEnabled', true); }
  function clearPasscode(){ if(global.FT) { FT.setSetting('appLockEnabled', false); FT.setSetting('appLockPasscode', ''); } }
  function appLockEnabled(){ return !!(global.FT && FT.getSetting('appLockEnabled')); }
  function verifyPasscode(passcode){ return !!(global.FT && hash(passcode) === FT.getSetting('appLockPasscode')); }

  global.FTAuth = { signUp, signIn, signOut, isAuthenticated, currentUser, requireAuth, PUBLIC_PAGES, setPasscode, clearPasscode, appLockEnabled, verifyPasscode };
})(window);
