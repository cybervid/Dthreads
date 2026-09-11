/* ================================================================
   D THREADS — profile.js
   Profile Settings page logic
   ================================================================ */

'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const PROFILE_KEY = 'dthreads_profile';

/* ── Toast ───────────────────────────────────────────────────── */
const toast = $('#toast');
let toastTimer;

function showToast(msg, color = 'cyan') {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.borderColor = color === 'pink' ? 'var(--border-pink)' : 'var(--border-cyan)';
  toast.style.boxShadow   = color === 'pink' ? 'var(--pink-glow)'   : 'var(--cyan-glow)';
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ── Navbar ──────────────────────────────────────────────────── */
const hamburgerBtn = $('#hamburgerBtn');
const navLinks     = $('#navLinks');
const accountBtn   = $('#accountBtn');
const accountMenu  = $('#accountDropdown .dropdown-menu');
const helpBtn      = $('#helpBtn');
const helpMenu     = $('#helpDropdown .dropdown-menu');

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', open);
    hamburgerBtn.setAttribute('aria-expanded', String(open));
  });
}

function closeAllDropdowns() {
  [accountMenu, helpMenu].forEach(m => m && m.classList.remove('open'));
  [accountBtn, helpBtn].forEach(b => b && b.setAttribute('aria-expanded', 'false'));
}

if (accountBtn && accountMenu) {
  accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (helpMenu) helpMenu.classList.remove('open');
    accountMenu.classList.toggle('open');
    accountBtn.setAttribute('aria-expanded', String(accountMenu.classList.contains('open')));
  });
}

if (helpBtn && helpMenu) {
  helpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (accountMenu) accountMenu.classList.remove('open');
    helpMenu.classList.toggle('open');
    helpBtn.setAttribute('aria-expanded', String(helpMenu.classList.contains('open')));
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) closeAllDropdowns();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllDropdowns();
});


/* ── Scroll reveal ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

$$('.reveal').forEach(el => revealObserver.observe(el));


/* ── Sidebar navigation ──────────────────────────────────────── */
const sidebarItems = $$('.sidebar-nav-item[data-target]');

sidebarItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;

    // Deactivate all
    sidebarItems.forEach(b => {
      b.classList.remove('active');
      b.removeAttribute('aria-current');
    });

    // Activate clicked
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'true');

    // Hide all panels
    $$('.profile-panel').forEach(panel => panel.hidden = true);

    // Show target panel
    const target = $(`#${targetId}`);
    if (target) {
      target.hidden = false;
      // Observe any newly visible .reveal elements
      $$('.reveal', target).forEach(el => revealObserver.observe(el));
    }
  });
});


/* ── Profile data (localStorage — guest/preferences only) ───── */
// NOTE: For authenticated users, ALL form fields are pre-filled server-side
// by Django's form widgets from the database. localStorage is only used for:
//   1. Guest users (no session) filling in fields before signing up
//   2. The Preferences toggles (which have no server-side model yet)
// localStorage must NOT overwrite server-rendered values for logged-in users.

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProfile(data) {
  const existing = loadProfile();
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...existing, ...data }));
}

function getServerUser() {
  try {
    const el = document.getElementById('serverUserData');
    return el ? JSON.parse(el.textContent) : { isAuthenticated: false };
  } catch {
    return { isAuthenticated: false };
  }
}

/**
 * Only runs for GUEST (unauthenticated) users.
 * Authenticated users have their fields filled by Django — we must not
 * touch them or we'll overwrite the correct DB values with stale
 * localStorage data from a previous session or a different user.
 */
function populateForm() {
  const server = getServerUser();

  // Authenticated: server already filled every form field correctly.
  // The sidebar avatar is also rendered server-side. Nothing to do.
  if (server.isAuthenticated) return;

  // Guest only — fill from localStorage so a returning guest's draft is restored.
  const p = loadProfile();

  const fields = {
    'pf-firstname': p.firstname || '',
    'pf-lastname':  p.lastname  || '',
    'pf-phone':     p.phone     || '',
    'pf-address':   p.address   || '',
    'pf-city':      p.city      || '',
    'pf-state':     p.state     || '',
    'pf-zip':       p.zip       || '',
    'pf-country':   p.country   || '',
  };

  Object.entries(fields).forEach(([id, val]) => {
    const el = $(`#${id}`);
    if (el) el.value = val;
  });

  // Update sidebar avatar for guest
  const firstname = p.firstname || '';
  const lastname  = p.lastname  || '';
  const email     = p.email     || '';
  const fullName  = [firstname, lastname].filter(Boolean).join(' ');

  const avatarName     = $('#avatarName');
  const avatarEmail    = $('#avatarEmail');
  const avatarInitials = $('#avatarInitials');

  if (avatarName)     avatarName.textContent  = fullName || 'D Threads User';
  if (avatarEmail)    avatarEmail.textContent = email    || 'user@dthreads.com';
  if (avatarInitials) {
    const init = [firstname[0], lastname[0]].filter(Boolean).join('').toUpperCase();
    avatarInitials.textContent = init || 'DT';
  }
}

populateForm();

/* ── Anti-autofill guard ─────────────────────────────────────── */
// Chrome's "Addresses and more" autofill fires after DOMContentLoaded,
// overwriting server-rendered values even when autocomplete="new-password".
// This guard captures the server-correct values immediately on script load
// (before Chrome touches them), then restores them after a short delay.
(function antiAutofill() {
  const server = getServerUser();
  if (!server.isAuthenticated) return; // guests have no server values to protect

  // Snapshot each field's server-rendered value right now, before autofill fires
  const fieldIds = [
    'pf-firstname', 'pf-lastname', 'pf-phone',
    'pf-address', 'pf-city', 'pf-state', 'pf-zip',
  ];

  const serverValues = {};
  fieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) serverValues[id] = el.value;
  });

  // Also snapshot the country <select>
  const countryEl = document.getElementById('pf-country');
  if (countryEl) serverValues['pf-country'] = countryEl.value;

  // Restore server values after autofill has had a chance to run
  // 300ms covers Chrome's typical autofill delay window
  setTimeout(() => {
    Object.entries(serverValues).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el && el.value !== val) {
        el.value = val;
      }
    });
  }, 300);
})();


/* ── Account form ────────────────────────────────────────────── */
const accountForm    = $('#accountForm');
const accountSaveBtn = $('#accountSaveBtn');
const submitBtnText  = accountSaveBtn?.querySelector('.submit-btn-text');

// The account form now does a real server POST — no e.preventDefault().
// We keep live client-side validation as a UX aid, but the server is
// the authoritative validator.

function validateField(input, errEl) {
  const val = input.value.trim();
  let msg = '';
  if (input.required && !val) msg = 'This field is required.';
  if (errEl) errEl.textContent = msg;
  input.classList.toggle('invalid', !!msg);
  return !msg;
}

if (accountForm) {
  // Live validation on blur / re-check after first invalid
  accountForm.querySelectorAll('.form-input').forEach(input => {
    if (input.readOnly || input.disabled) return; // skip email
    const errEl = $(`#${input.id}-err`);
    if (!errEl) return;
    input.addEventListener('blur', () => validateField(input, errEl));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input, errEl);
    });
  });

  // Real-time avatar preview when user types their name
  const fnInput = $('#pf-firstname');
  const lnInput = $('#pf-lastname');

  [fnInput, lnInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      const fn = fnInput?.value.trim() || '';
      const ln = lnInput?.value.trim() || '';
      const fullName = [fn, ln].filter(Boolean).join(' ');
      const avatarName     = $('#avatarName');
      const avatarInitials = $('#avatarInitials');
      if (avatarName)     avatarName.textContent = fullName || 'D Threads User';
      if (avatarInitials) {
        const init = [fn[0], ln[0]].filter(Boolean).join('').toUpperCase();
        avatarInitials.textContent = init || 'DT';
      }
    });
  });

  // Show saving state on submit (visual feedback before page reloads)
  accountForm.addEventListener('submit', () => {
    if (accountSaveBtn) {
      accountSaveBtn.classList.add('saving');
      if (submitBtnText) submitBtnText.textContent = 'Saving…';
    }
  });
}


/* ── Avatar upload ───────────────────────────────────────────── */
const avatarUpload = $('#avatarUpload');
const avatarPhoto  = $('#avatarPhoto');
const avatarInit   = $('#avatarInitials');

if (avatarUpload) {
  avatarUpload.addEventListener('change', () => {
    const file = avatarUpload.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('❌ Please upload an image file.', 'pink');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (avatarPhoto) {
        avatarPhoto.src = ev.target.result;
        avatarPhoto.hidden = false;
      }
      if (avatarInit) avatarInit.style.display = 'none';
      showToast('🖼️ Profile photo updated!', 'cyan');
    };
    reader.readAsDataURL(file);
  });
}


/* ── Password strength meter ─────────────────────────────────── */
const newPwInput     = $('#pf-new-pw');
const strengthFill   = $('#pwStrengthFill');
const strengthLabel  = $('#pwStrengthLabel');

const tipLength  = $('#tip-length');
const tipUpper   = $('#tip-upper');
const tipNumber  = $('#tip-number');
const tipSpecial = $('#tip-special');

function checkStrength(pw) {
  const rules = {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^a-zA-Z0-9]/.test(pw),
  };

  // Update tip items
  if (tipLength)  tipLength.classList.toggle('met',  rules.length);
  if (tipUpper)   tipUpper.classList.toggle('met',   rules.upper);
  if (tipNumber)  tipNumber.classList.toggle('met',  rules.number);
  if (tipSpecial) tipSpecial.classList.toggle('met', rules.special);

  const score = Object.values(rules).filter(Boolean).length;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const level  = score;

  if (strengthFill) {
    strengthFill.setAttribute('data-level', pw ? String(level) : '');
    strengthFill.style.width = pw ? `${score * 25}%` : '0%';
  }

  if (strengthLabel) {
    strengthLabel.textContent = pw ? labels[level] : '';
    strengthLabel.setAttribute('data-level', pw ? String(level) : '');
  }

  return rules;
}

if (newPwInput) {
  newPwInput.addEventListener('input', () => checkStrength(newPwInput.value));
}


/* ── Password toggle (show/hide) ─────────────────────────────── */
$$('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = $(`#${targetId}`);
    if (!input) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
    // Swap eye icon opacity
    const eye = btn.querySelector('.eye-icon');
    if (eye) eye.style.opacity = isText ? '1' : '0.5';
  });
});


/* ── Security form ───────────────────────────────────────────── */
const securityForm    = $('#securityForm');
const securitySaveBtn = $('#securitySaveBtn');
const secBtnText      = securitySaveBtn?.querySelector('.submit-btn-text');

// The security form POSTs to /password-change/ — Django's PasswordChangeForm
// handles all server-side validation.  We keep lightweight client-side checks
// as a UX guard before the form is even submitted.
if (securityForm) {
  securityForm.addEventListener('submit', (e) => {
    const currentPw  = $('#pf-current-pw');
    const newPw      = $('#pf-new-pw');
    const confirmPw  = $('#pf-confirm-pw');
    const currentErr = $('#pf-current-pw-err');
    const newPwErr   = $('#pf-new-pw-err');
    const confirmErr = $('#pf-confirm-pw-err');

    let valid = true;

    if (!currentPw.value.trim()) {
      if (currentErr) currentErr.textContent = 'Please enter your current password.';
      currentPw.classList.add('invalid');
      valid = false;
    } else {
      if (currentErr) currentErr.textContent = '';
      currentPw.classList.remove('invalid');
    }

    const rules = checkStrength(newPw.value);
    if (!newPw.value || !rules.length) {
      if (newPwErr) newPwErr.textContent = 'Password must be at least 8 characters.';
      newPw.classList.add('invalid');
      valid = false;
    } else {
      if (newPwErr) newPwErr.textContent = '';
      newPw.classList.remove('invalid');
    }

    if (confirmPw.value !== newPw.value) {
      if (confirmErr) confirmErr.textContent = 'Passwords do not match.';
      confirmPw.classList.add('invalid');
      valid = false;
    } else {
      if (confirmErr) confirmErr.textContent = '';
      confirmPw.classList.remove('invalid');
    }

    if (!valid) {
      e.preventDefault(); // block submission only when local checks fail
      const first = securityForm.querySelector('.form-input.invalid');
      if (first) first.focus();
      return;
    }

    // Local checks passed — show loading state and let the real POST fire
    if (securitySaveBtn) {
      securitySaveBtn.disabled = true;
      if (secBtnText) secBtnText.textContent = 'Updating…';
    }
    // Do NOT call e.preventDefault() — the browser POST proceeds normally
  });
}


/* ── Page-load flags (toasts + panel routing) ────────────────── */
// Read the JSON island injected by the template to decide what to show
// on arrival, including post-redirect success/error states.
(function handlePageFlags() {
  let flags = {};
  try {
    const el = document.getElementById('pageFlags');
    if (el) flags = JSON.parse(el.textContent);
  } catch { /* ignore parse errors */ }

  const openPanel = (targetId) => {
    sidebarItems.forEach(b => {
      const active = b.dataset.target === targetId;
      b.classList.toggle('active', active);
      if (active) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    $$('.profile-panel').forEach(panel => {
      panel.hidden = panel.id !== targetId;
    });
  };

  if (flags.profileSaved) {
    showToast('✅ Profile updated successfully!', 'cyan');
    // Stay on account section (already default)
  }

  if (flags.pwChanged) {
    openPanel('security-section');
    showToast('🔐 Password updated successfully!', 'cyan');
    // Also visually mark the button as success briefly
    if (securitySaveBtn && secBtnText) {
      securitySaveBtn.classList.add('saved');
      secBtnText.textContent = '✅ Password Updated!';
      setTimeout(() => {
        securitySaveBtn.classList.remove('saved');
        secBtnText.textContent = 'Update Password 🔐';
      }, 3000);
    }
  }

  if (flags.pwError) {
    openPanel('security-section');
    // Show each error message from Django as a toast (there's usually just one)
    const msgs = flags.djangoMessages || [];
    if (msgs.length) {
      msgs.forEach((m, i) => {
        setTimeout(() => showToast(`❌ ${m.text}`, 'pink'), i * 400);
      });
    } else {
      showToast('❌ Password update failed. Please try again.', 'pink');
    }
  }

  if (flags.profileErrors) {
    // Stay on account section and show a toast so it's obvious
    showToast('⚠️ Please fix the errors and try again.', 'pink');
  }
})();


/* ── 2FA toggle ──────────────────────────────────────────────── */
const tfaToggle = $('#tfaToggle');
let tfaEnabled  = false;

if (tfaToggle) {
  tfaToggle.addEventListener('click', () => {
    tfaEnabled = !tfaEnabled;
    tfaToggle.textContent = tfaEnabled ? 'Disable 2FA' : 'Enable 2FA';
    tfaToggle.classList.toggle('active', tfaEnabled);
    tfaToggle.setAttribute('aria-pressed', String(tfaEnabled));
    showToast(
      tfaEnabled
        ? '🔒 Two-factor authentication enabled!'
        : '🔓 Two-factor authentication disabled.',
      tfaEnabled ? 'cyan' : 'pink'
    );
  });
}


/* ── Preferences save ────────────────────────────────────────── */
const prefsSaveBtn = $('#prefsSaveBtn');

if (prefsSaveBtn) {
  prefsSaveBtn.addEventListener('click', () => {
    const prefs = {
      orders: $('#pref-orders')?.checked ?? true,
      drops:  $('#pref-drops')?.checked  ?? true,
      promos: $('#pref-promos')?.checked ?? false,
      sms:    $('#pref-sms')?.checked    ?? false,
    };
    saveProfile({ prefs });
    showToast('⚙️ Preferences saved!', 'cyan');
  });
}

// Restore saved preferences
(function restorePrefs() {
  const p = loadProfile();
  if (!p.prefs) return;
  if (typeof p.prefs.orders !== 'undefined') {
    const el = $('#pref-orders');
    if (el) el.checked = p.prefs.orders;
  }
  if (typeof p.prefs.drops !== 'undefined') {
    const el = $('#pref-drops');
    if (el) el.checked = p.prefs.drops;
  }
  if (typeof p.prefs.promos !== 'undefined') {
    const el = $('#pref-promos');
    if (el) el.checked = p.prefs.promos;
  }
  if (typeof p.prefs.sms !== 'undefined') {
    const el = $('#pref-sms');
    if (el) el.checked = p.prefs.sms;
  }
})();


/* ── Delete account ──────────────────────────────────────────── */
const deleteBtn = $('#deleteAccountBtn');

if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account?\n\nThis action cannot be undone.'
    );
    if (!confirmed) return;
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem('dthreads_cart');
    showToast('🗑️ Account deleted. Redirecting…', 'pink');
    setTimeout(() => { window.location.href = '/'; }, 2000);
  });
}


/* ── Logout ──────────────────────────────────────────────────── */
// Logout is now handled by the <a href="/logout/"> link in the navbar template.
// No JS handler needed.


/* ── Navbar scroll glow ──────────────────────────────────────── */
const navbar = $('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(0,243,255,0.2)'
      : 'var(--border)';
  }, { passive: true });
}
