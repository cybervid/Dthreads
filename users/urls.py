"""
URL configuration for the D THREADS users/store app.

Store pages
-----------
  /                → index
  /orders/         → orders
  /profile/        → profile
  /shipping/       → shipping

Authentication
--------------
  /login/          → login_view
  /signup/         → signup_view
  /logout/         → logout_view

Password Reset (Django built-in views, custom templates)
---------------------------------------------------------
  /password-reset/          → PasswordResetView        (enter email)
  /password-reset/done/     → PasswordResetDoneView    (check-email page)
  /reset/<uidb64>/<token>/  → PasswordResetConfirmView (choose new pw)
  /reset/done/              → PasswordResetCompleteView (success)
"""

from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

app_name = 'users'

urlpatterns = [
    # ── Store pages ──────────────────────────────────────────────────
    path('',                views.index,           name='index'),
    path('orders/',         views.orders,          name='orders'),
    path('profile/',        views.profile,         name='profile'),
    path('password-change/', views.password_change, name='password_change'),
    path('shipping/',       views.shipping,        name='shipping'),

    # ── Auth ─────────────────────────────────────────────────────────
    path('login/',   views.login_view,  name='login'),
    path('signup/',  views.signup_view, name='signup'),
    path('logout/',  views.logout_view, name='logout'),

    # ── Password reset (Django built-in flow) ─────────────────────────
    path(
        'password-reset/',
        auth_views.PasswordResetView.as_view(
            template_name='store/password_reset.html',
            email_template_name='store/email/password_reset_email.txt',
            subject_template_name='store/email/password_reset_subject.txt',
            success_url='/password-reset/done/',
        ),
        name='password_reset',
    ),
    path(
        'password-reset/done/',
        auth_views.PasswordResetDoneView.as_view(
            template_name='store/password_reset_done.html',
        ),
        name='password_reset_done',
    ),
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            template_name='store/password_reset_confirm.html',
            success_url='/reset/done/',
        ),
        name='password_reset_confirm',
    ),
    path(
        'reset/done/',
        auth_views.PasswordResetCompleteView.as_view(
            template_name='store/password_reset_complete.html',
        ),
        name='password_reset_complete',
    ),
]
