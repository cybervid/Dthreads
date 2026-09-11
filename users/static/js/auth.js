/**
 * D THREADS — auth.js
 * Handles client-side validation, password toggle, strength meter,
 * loading-spinner feedback, and neon toast notifications for
 * both login.html and signup.html.
 */

'use strict';

/* ── UTILITY: Toast ─────────────────────────────────────────────────────── */

/**
 * Show a neon toast notification.
 * @param {string} msg     - Message text
 * @param {'success'|'error'} type - Visual variant
 * @param {number} [duration=3500]  - Auto-hide delay in ms
 */
function showToast(msg, type = 'success', duration = 3500) {
  const toast   = document.getElementById('authToast');
  const iconEl  = document.getElementById('toastIcon');
  const msgEl   = document.getElementById('toastMsg');
  if (!toast) return;

  // Reset previous type classes
  toast.classList.remove('toast--success', 'toast--error', 'toast--hiding');

  iconEl.textContent = type === 'success' ? '✓' : '✕';
  msgEl.textContent  = msg;
  toast.classList.add(`toast--${type}`);
  toast.hidden = false;

  // Clear any pending hide timer
  if (toast._hideTimer) clearTimeout(toast._hideTimer);

  toast._hideTimer = setTimeout(() => {
    toast.classList.add('toast--hiding');
    toast.addEventListener('animationend', () => {
      toast.hidden = true;
      toast.classList.remove('toast--hiding');
    }, { once: true });
  }, duration);
}


/* ── UTILITY: Field error / valid state ─────────────────────────────────── */

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(`err-${fieldId.replace('id_', '')}`);
  if (!field) return;
  field.closest('.auth-field').classList.add('has-error');
  field.closest('.auth-field').classList.remove('is-valid');
  field.setAttribute('aria-invalid', 'true');
  if (errEl) errEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(`err-${fieldId.replace('id_', '')}`);
  if (!field) return;
  field.closest('.auth-field').classList.remove('has-error');
  field.setAttribute('aria-invalid', 'false');
  if (errEl) errEl.textContent = '';
}

function setValid(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  clearError(fieldId);
  field.closest('.auth-field').classList.add('is-valid');
}


/* ── UTILITY: Email validation ──────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}


/* ── PASSWORD TOGGLE ────────────────────────────────────────────────────── */
function initPasswordToggles() {
  document.querySelectorAll('.auth-pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      // Determine which input to toggle
      const targetId = btn.dataset.target || 'id_password';
      const input    = document.getElementById(targetId);
      if (!input) return;

      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';

      // Swap eye icons
      const eyeShow = btn.querySelector('.eye-show');
      const eyeHide = btn.querySelector('.eye-hide');
      if (eyeShow) eyeShow.style.display = isHidden ? 'none'  : '';
      if (eyeHide) eyeHide.style.display = isHidden ? ''      : 'none';

      btn.setAttribute('aria-pressed', String(isHidden));
      btn.setAttribute('aria-label',   isHidden ? 'Hide password' : 'Show password');
    });
  });
}


/* ── PASSWORD STRENGTH METER ────────────────────────────────────────────── */
function initStrengthMeter() {
  const pwInput    = document.getElementById('id_password1');
  const wrap       = document.getElementById('pw-strength-wrap');
  const fill       = document.getElementById('pwStrengthFill');
  const label      = document.getElementById('pw-strength-label');
  if (!pwInput || !wrap || !fill || !label) return;

  pwInput.addEventListener('input', () => {
    const val = pwInput.value;
    if (!val) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;

    let score = 0;
    if (val.length >= 8)                         score++;
    if (/[A-Z]/.test(val))                        score++;
    if (/[0-9]/.test(val))                        score++;
    if (/[^A-Za-z0-9]/.test(val))                 score++;

    const levels = ['s-weak', 's-fair', 's-good', 's-strong'];
    const names  = ['Weak',   'Fair',   'Good',   'Strong'];

    // Remove all level classes
    fill.classList.remove(...levels);
    label.classList.remove(...levels);

    const idx = Math.max(0, score - 1);
    fill.classList.add(levels[idx]);
    label.classList.add(levels[idx]);
    label.textContent = names[idx];
  });
}


/* ── SUBMIT SPINNER ─────────────────────────────────────────────────────── */
function setLoading(btn, isLoading) {
  const text    = btn.querySelector('.auth-btn-text');
  const spinner = btn.querySelector('.auth-btn-spinner');
  const status  = btn.nextElementSibling; // sr-only live region sibling

  btn.classList.toggle('loading', isLoading);
  btn.disabled = isLoading;

  if (text)    text.style.opacity   = isLoading ? '0' : '1';
  if (spinner) spinner.hidden       = !isLoading;
  if (status)  status.textContent   = isLoading ? 'Signing in…' : '';
}


/* ── LOGIN FORM VALIDATION ──────────────────────────────────────────────── */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('id_email');
  const pwInput    = document.getElementById('id_password');
  const submitBtn  = document.getElementById('loginSubmitBtn');

  // Real-time validation
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (!val) {
        setError('id_email', 'Email address is required.');
      } else if (!isValidEmail(val)) {
        setError('id_email', 'Please enter a valid email address.');
      } else {
        setValid('id_email');
      }
    });

    emailInput.addEventListener('input', () => {
      if (emailInput.closest('.auth-field').classList.contains('has-error')) {
        if (isValidEmail(emailInput.value.trim())) setValid('id_email');
      }
    });
  }

  if (pwInput) {
    pwInput.addEventListener('blur', () => {
      if (!pwInput.value) {
        setError('id_password', 'Password is required.');
      } else {
        clearError('id_password');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    let valid = true;

    // Validate email
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) {
      setError('id_email', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('id_email', 'Please enter a valid email address.');
      valid = false;
    }

    // Validate password
    const pw = pwInput ? pwInput.value : '';
    if (!pw) {
      setError('id_password', 'Password is required.');
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      // Focus first errored field
      const firstErr = form.querySelector('.has-error .auth-input');
      if (firstErr) firstErr.focus();
      showToast('Please fix the errors above.', 'error');
      return;
    }

    // Show loading state (form submits normally to Django)
    setLoading(submitBtn, true);
  });
}


/* ── SIGN-UP FORM VALIDATION ────────────────────────────────────────────── */
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const emailInput = document.getElementById('id_email');
  const pw1Input   = document.getElementById('id_password1');
  const pw2Input   = document.getElementById('id_password2');
  const submitBtn  = document.getElementById('signupSubmitBtn');

  // Real-time: email
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (!val) {
        setError('id_email', 'Email address is required.');
      } else if (!isValidEmail(val)) {
        setError('id_email', 'Please enter a valid email address.');
      } else {
        setValid('id_email');
      }
    });
  }

  // Real-time: confirm password match
  if (pw2Input) {
    pw2Input.addEventListener('input', () => {
      if (pw1Input && pw2Input.value && pw2Input.value !== pw1Input.value) {
        setError('id_password2', 'Passwords do not match.');
      } else if (pw2Input.value) {
        clearError('id_password2');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    let valid = true;

    // Email
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) {
      setError('id_email', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('id_email', 'Please enter a valid email address.');
      valid = false;
    }

    // Password 1
    const pw1 = pw1Input ? pw1Input.value : '';
    if (!pw1) {
      setError('id_password1', 'Please choose a password.');
      valid = false;
    } else if (pw1.length < 8) {
      setError('id_password1', 'Password must be at least 8 characters.');
      valid = false;
    }

    // Password 2
    const pw2 = pw2Input ? pw2Input.value : '';
    if (!pw2) {
      setError('id_password2', 'Please confirm your password.');
      valid = false;
    } else if (pw1 && pw2 !== pw1) {
      setError('id_password2', 'Passwords do not match.');
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      const firstErr = form.querySelector('.has-error .auth-input');
      if (firstErr) firstErr.focus();
      showToast('Please fix the errors above.', 'error');
      return;
    }

    setLoading(submitBtn, true);
  });
}


/* ── SHOW SERVER ERRORS VIA TOAST ───────────────────────────────────────── */
function initServerMsgToast() {
  const msgEl = document.querySelector('.auth-server-msg--error, .auth-server-msg--warning');
  if (msgEl) {
    // Show server error as toast too (nice UX reinforcement)
    showToast(msgEl.textContent.trim(), 'error', 5000);
  }
}


/* ── BOOT ───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initStrengthMeter();
  initLoginForm();
  initSignupForm();
  initServerMsgToast();
});
