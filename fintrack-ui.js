(function(global){
  const FTUI = {
    init(){
      this.applyA11y();
      this.applyReducedMotionSupport();
      this.registerServiceWorker();
      if(global.FTTheme && !location.pathname.endsWith('Onboarding.html')) FTTheme.init();
      if(global.FTAuth) FTAuth.requireAuth();
      this.injectSessionBadge();
      this.maybeShowAppLock();
    },
    applyA11y(){
      document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
        if(!el.getAttribute('aria-label')) {
          const label = el.getAttribute('title') || el.textContent.trim() || el.getAttribute('placeholder');
          if(label) el.setAttribute('aria-label', label);
        }
      });
      document.querySelectorAll('.modal-overlay,.sheet,.bottom-sheet').forEach(el => {
        if(!el.hasAttribute('role')) el.setAttribute('role', 'dialog');
        if(!el.hasAttribute('aria-modal')) el.setAttribute('aria-modal', 'true');
      });
    },
    applyReducedMotionSupport(){
      if(document.getElementById('ft-reduced-motion-style')) return;
      const style = document.createElement('style');
      style.id = 'ft-reduced-motion-style';
      style.textContent = '@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important;}} button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--accent-custom, #80CBC4);outline-offset:2px;}';
      document.head.appendChild(style);
    },
    registerServiceWorker(){
      if(!('serviceWorker' in navigator) || global.__ftSwRegistered) return;
      global.__ftSwRegistered = true;
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('[SW] Registration failed:', err));
      }, { once: true });
    },
    injectSessionBadge(){
      const user = global.FTAuth && FTAuth.currentUser && FTAuth.currentUser();
      if(!user || document.getElementById('ft-session-badge')) return;
      const badge = document.createElement('div');
      badge.id = 'ft-session-badge';
      badge.style.cssText = 'position:fixed;top:12px;right:12px;z-index:9998;background:rgba(16,16,16,.92);color:#EAEAEA;border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:8px 12px;font:12px/1.2 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.28)';
      badge.textContent = user.name + ' • ' + user.email;
      if(location.pathname.endsWith('Login.html') || location.pathname.endsWith('Signup.html')) return;
      document.body.appendChild(badge);
    },
    maybeShowAppLock(){
      if(!global.FTAuth || !FTAuth.appLockEnabled() || sessionStorage.getItem('ft_unlock_ok') === '1') return;
      const overlay = document.createElement('div');
      overlay.id = 'ft-lock-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:24px';
      overlay.innerHTML = '<form id="ft-lock-form" style="width:min(100%,360px);background:#111;border:1px solid #222;border-radius:24px;padding:24px;color:#EAEAEA;display:grid;gap:12px"><h2 style="margin:0;font:700 24px Google Sans,system-ui">Unlock FinTrack</h2><p style="margin:0;color:#B8B8B8">Enter your 4-digit app passcode to continue.</p><input id="ft-lock-input" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="••••" aria-label="App passcode" style="padding:14px 16px;border-radius:14px;border:1px solid #333;background:#1A1A1A;color:#fff;font-size:18px;letter-spacing:6px;text-align:center"><button style="padding:14px;border:none;border-radius:999px;background:#80CBC4;color:#00201E;font-weight:700;cursor:pointer">Unlock</button><div id="ft-lock-error" style="min-height:18px;color:#EF9A9A;font-size:12px"></div></form>';
      document.body.appendChild(overlay);
      const form = overlay.querySelector('#ft-lock-form');
      const input = overlay.querySelector('#ft-lock-input');
      const error = overlay.querySelector('#ft-lock-error');
      input.focus();
      form.addEventListener('submit', e => {
        e.preventDefault();
        if(FTAuth.verifyPasscode(input.value)) {
          sessionStorage.setItem('ft_unlock_ok', '1');
          overlay.remove();
        } else {
          error.textContent = 'Incorrect passcode. Please try again.';
          input.select();
        }
      });
    }
  };
  global.FTUI = FTUI;
  document.addEventListener('DOMContentLoaded', () => FTUI.init());
})(window);
