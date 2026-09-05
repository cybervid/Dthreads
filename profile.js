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


/* ── Profile data (localStorage) ────────────────────────────── */
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

/**
 * Populate the form with any saved profile data, and sync the avatar info.
 */
function populateForm() {
  const p = loadProfile();

  const fields = {
    'pf-firstname': p.firstname || '',
    'pf-lastname':  p.lastname  || '',
    'pf-email':     p.email     || '',
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

  // Sync sidebar avatar display
  const fullName = [p.firstname, p.lastname].filter(Boolean).join(' ');
  const avatarName = $('#avatarName');
  const avatarEmail = $('#avatarEmail');
  const avatarInitials = $('#avatarInitials');

  if (avatarName)    avatarName.textContent    = fullName  || 'D Threads User';
  if (avatarEmail)   avatarEmail.textContent   = p.email   || 'user@dthreads.com';
  if (avatarInitials) {
    const initials = [p.firstname?.[0], p.lastname?.[0]].filter(Boolean).join('').toUpperCase();
    avatarInitials.textContent = initials || 'DT';
  }
}

populateForm();


/* ── Account form ────────────────────────────────────────────── */
const accountForm   = $('#accountForm');
const accountSaveBtn = $('#accountSaveBtn');
const submitBtnText  = accountSaveBtn?.querySelector('.submit-btn-text');

function validateField(input, errEl) {
  const val = input.value.trim();
  let msg = '';
  if (input.required && !val) msg = 'This field is required.';
  else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    msg = 'Please enter a valid email address.';
  }
  if (errEl) errEl.textContent = msg;
  input.classList.toggle('invalid', !!msg);
  return !msg;
}

if (accountForm) {
  // Live validation
  accountForm.querySelectorAll('.form-input').forEach(input => {
    const errEl = $(`#${input.id}-err`);
    if (!errEl) return;
    input.addEventListener('blur', () => validateField(input, errEl));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input, errEl);
    });
  });

  // Also update avatar preview in real-time
  const fnInput = $('#pf-firstname');
  const lnInput = $('#pf-lastname');
  const emInput = $('#pf-email');

  [fnInput, lnInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      const fn = fnInput?.value.trim() || '';
      const ln = lnInput?.value.trim() || '';
      const fullName = [fn, ln].filter(Boolean).join(' ');
      const avatarName = $('#avatarName');
      const avatarInitials = $('#avatarInitials');
      if (avatarName) avatarName.textContent = fullName || 'D Threads User';
      if (avatarInitials) {
        const init = [fn[0], ln[0]].filter(Boolean).join('').toUpperCase();
        avatarInitials.textContent = init || 'DT';
      }
    });
  });

  if (emInput) {
    emInput.addEventListener('input', () => {
      const avatarEmail = $('#avatarEmail');
      if (avatarEmail) avatarEmail.textContent = emInput.value.trim() || 'user@dthreads.com';
    });
  }

  accountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fieldsToValidate = [
      { input: $('#pf-firstname'), err: $('#pf-firstname-err') },
      { input: $('#pf-lastname'),  err: $('#pf-lastname-err') },
      { input: $('#pf-email'),     err: $('#pf-email-err') },
    ];

    const allValid = fieldsToValidate.every(({ input, err }) => validateField(input, err));
    if (!allValid) {
      const first = accountForm.querySelector('.form-input.invalid');
      if (first) first.focus();
      return;
    }

    // Saving state
    accountSaveBtn.classList.add('saving');
    if (submitBtnText) submitBtnText.textContent = 'Saving…';

    setTimeout(() => {
      // Persist to localStorage
      saveProfile({
        firstname: $('#pf-firstname').value.trim(),
        lastname:  $('#pf-lastname').value.trim(),
        email:     $('#pf-email').value.trim(),
        phone:     $('#pf-phone').value.trim(),
        address:   $('#pf-address').value.trim(),
        city:      $('#pf-city').value.trim(),
        state:     $('#pf-state').value.trim(),
        zip:       $('#pf-zip').value.trim(),
        country:   $('#pf-country').value,
      });

      accountSaveBtn.classList.remove('saving');
      accountSaveBtn.classList.add('saved');
      if (submitBtnText) submitBtnText.textContent = '✅ Settings Updated!';
      showToast('✅ Settings updated successfully!', 'cyan');

      setTimeout(() => {
        accountSaveBtn.classList.remove('saved');
        if (submitBtnText) submitBtnText.textContent = 'Save Changes ✦';
      }, 3000);
    }, 900);
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

if (securityForm) {
  securityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentPw  = $('#pf-current-pw');
    const newPw      = $('#pf-new-pw');
    const confirmPw  = $('#pf-confirm-pw');
    const currentErr = $('#pf-current-pw-err');
    const newPwErr   = $('#pf-new-pw-err');
    const confirmErr = $('#pf-confirm-pw-err');

    let valid = true;

    // Current password required
    if (!currentPw.value.trim()) {
      if (currentErr) currentErr.textContent = 'Please enter your current password.';
      currentPw.classList.add('invalid');
      valid = false;
    } else {
      if (currentErr) currentErr.textContent = '';
      currentPw.classList.remove('invalid');
    }

    // New password: check rules
    const rules = checkStrength(newPw.value);
    if (!newPw.value || !rules.length) {
      if (newPwErr) newPwErr.textContent = 'Password must be at least 8 characters.';
      newPw.classList.add('invalid');
      valid = false;
    } else {
      if (newPwErr) newPwErr.textContent = '';
      newPw.classList.remove('invalid');
    }

    // Confirm must match
    if (confirmPw.value !== newPw.value) {
      if (confirmErr) confirmErr.textContent = 'Passwords do not match.';
      confirmPw.classList.add('invalid');
      valid = false;
    } else {
      if (confirmErr) confirmErr.textContent = '';
      confirmPw.classList.remove('invalid');
    }

    if (!valid) return;

    securitySaveBtn.disabled = true;
    if (secBtnText) secBtnText.textContent = 'Updating…';

    setTimeout(() => {
      securityForm.reset();
      checkStrength(''); // reset bar
      securitySaveBtn.disabled = false;
      if (secBtnText) secBtnText.textContent = '✅ Password Updated!';
      showToast('🔐 Password updated successfully!', 'cyan');
      setTimeout(() => {
        if (secBtnText) secBtnText.textContent = 'Update Password 🔐';
      }, 3000);
    }, 1000);
  });
}


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
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
  });
}


/* ── Logout ──────────────────────────────────────────────────── */
const logoutBtn = $('#logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    showToast('👋 Logged out successfully.', 'cyan');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}


/* ── Navbar scroll glow ──────────────────────────────────────── */
const navbar = $('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(0,243,255,0.2)'
      : 'var(--border)';
  }, { passive: true });
}
