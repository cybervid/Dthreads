"""
Django settings for D THREADS — STORE project.
Reads all secrets from the .env file via python-dotenv.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ── Load .env ─────────────────────────────────────────────────────────────────
# Looks for .env in BASE_DIR (project root, next to manage.py)
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-fallback-key-change-in-production'
)

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# ── Installed applications ────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # D THREADS store app
    'users',
]

# ── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'STORE.urls'

# ── Templates ─────────────────────────────────────────────────────────────────
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,           # finds users/templates/ automatically
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'STORE.wsgi.application'

# ── Database — Supabase PostgreSQL ────────────────────────────────────────────
#
# Supabase exposes two connection poolers:
#   Transaction Pooler  port 5432  (default, best for short-lived connections)
#   Session Pooler      port 5432  (alternative, same host)
#   Direct connection   port 5432  (bypasses pooler — use for migrations)
#
# The credentials below come from .env → my_supabase_connnections file.
#
DATABASES = {
    'default': {
        'ENGINE':   os.environ.get('DB_ENGINE',   'django.db.backends.postgresql'),
        'NAME':     os.environ.get('DB_NAME',     'postgres'),
        'USER':     os.environ.get('DB_USER',     ''),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST':     os.environ.get('DB_HOST',     'localhost'),
        'PORT':     os.environ.get('DB_PORT',     '5432'),
        'OPTIONS': {
            # Required for Supabase transaction pooler — disables
            # server-side prepared statements which the pooler blocks.
            'options': '-c default_transaction_isolation=read\ committed',
            'sslmode': 'require',   # Supabase enforces TLS
        },
    }
}

# ── Password validation ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Internationalisation ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ── Static files ──────────────────────────────────────────────────────────────
# STATIC_URL     — URL prefix used in {% static '...' %} tags
# STATICFILES_DIRS — extra dirs scanned by collectstatic (source/ = product images)
# STATIC_ROOT    — destination for `python manage.py collectstatic` (production)
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / 'source',   # exposes /static/clothes/X.jpg, /static/cap/X.jpg etc.
]

STATIC_ROOT = BASE_DIR / 'staticfiles'

# ── Media files (user uploads) ────────────────────────────────────────────────
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ── Default primary key ───────────────────────────────────────────────────────
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Email (console backend for development) ───────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ── Authentication redirects ──────────────────────────────────────────────
# Where @login_required sends unauthenticated visitors
LOGIN_URL = '/login/'

# Where Django redirects after a successful login (if no ?next= param)
LOGIN_REDIRECT_URL = '/'

# Where Django redirects after calling LogoutView / logout()
LOGOUT_REDIRECT_URL = '/'
