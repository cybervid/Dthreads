"""
Views for the D THREADS store.
Includes Django auth views: login, logout, sign-up, and password reset.
All interactive cart/product logic runs client-side via JavaScript.
"""

from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages
from django.shortcuts import render, redirect

from .forms import (
    EmailAuthenticationForm,
    EmailUserCreationForm,
    UserUpdateForm,
    ProfileUpdateForm,
)
from .models import Profile


# ── STORE PAGES ────────────────────────────────────────────────────────────

def index(request):
    """Home — hero, products, about, reviews, contact."""
    return render(request, 'store/index.html')


def orders(request):
    """My Orders — order history and tracking modal."""
    return render(request, 'store/orders.html')


@login_required
def profile(request):
    """
    Profile Settings — account details and shipping address.

    GET:  pre-fill UserUpdateForm + ProfileUpdateForm from the DB.
    POST: validate both forms; only save when *both* are valid so we
          never commit a partial update (e.g. name saved, bad zip not).
          Redirect with ?profile_saved=1 so the JS can show a toast
          without re-posting on browser refresh (Post/Redirect/Get).
    """
    # Ensure the Profile row always exists (guards against users created
    # before the signal was wired up, e.g. via createsuperuser).
    profile_obj, _ = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        user_form    = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, instance=profile_obj)

        # Only save when BOTH forms are valid — all or nothing.
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            # Force Django to discard the in-memory cached User object so
            # the next GET re-reads the freshly saved values from the DB.
            # Without this, request.user.first_name etc. would still hold
            # the pre-save values when the template renders after the redirect.
            request.user.refresh_from_db()
            return redirect(f"{request.path}?profile_saved=1")

        # If either form failed, fall through and re-render with errors.

    else:
        user_form    = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=profile_obj)

    context = {
        'user_form':    user_form,
        'profile_form': profile_form,
        # Keep passing these scalars for the sidebar avatar and the
        # readonly email display (email never enters either form).
        'first_name': request.user.first_name,
        'last_name':  request.user.last_name,
        'email':      request.user.email,
    }
    return render(request, 'store/profile.html', context)


@login_required
def password_change(request):
    """
    Change password using Django's built-in PasswordChangeForm.

    PasswordChangeForm validates the current password, enforces
    AUTH_PASSWORD_VALIDATORS, and hashes the new password.

    After a successful save we call update_session_auth_hash() so the
    user stays logged in (Django rotates the session hash on pw change).
    Then we redirect back to the profile security section with a flag
    so the JS can show a success toast.

    On failure, error messages are stored via Django's messages framework
    and we redirect back to the profile security section so the user
    never leaves the profile page.
    """
    form = PasswordChangeForm(user=request.user)

    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            user = form.save()
            # Keep the current session alive after the hash rotation.
            update_session_auth_hash(request, user)
            return redirect('/profile/?pw_changed=1#security-section')

        # Form invalid — collect all errors and pass them back via messages
        # so the profile page can display them without a separate error template.
        for field_errors in form.errors.values():
            for error in field_errors:
                messages.error(request, error)
        return redirect('/profile/?pw_error=1#security-section')

    # GET — shouldn't be reached in normal flow (form lives on profile page),
    # but handle gracefully just in case.
    return redirect('/profile/#security-section')


def shipping(request):
    """Shipping Policy — policy articles and contact support."""
    return render(request, 'store/shipping.html')


# ── AUTH VIEWS ─────────────────────────────────────────────────────────────

def login_view(request):
    """
    Display the login form (GET) or authenticate the user (POST).

    Flow:
      1. POST: validate EmailAuthenticationForm
      2. On success: call django.contrib.auth.login() to create session,
         redirect to LOGIN_REDIRECT_URL (defaults to '/')
      3. On failure: re-render login.html with error message
    """
    # Already logged in → go home
    if request.user.is_authenticated:
        return redirect('users:index')

    form = EmailAuthenticationForm(request=request)

    if request.method == 'POST':
        form = EmailAuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            # Honour ?next= redirect param (e.g. from @login_required)
            next_url = request.GET.get('next') or request.POST.get('next', '')
            return redirect(next_url if next_url else 'users:index')
        else:
            # Surface the first non-field error as a flash message so it
            # shows as both a banner inside the card AND a toast.
            for error in form.non_field_errors():
                messages.error(request, error)

    return render(request, 'store/login.html', {'form': form})


def signup_view(request):
    """
    Display the sign-up form (GET) or create a new user account (POST).

    Flow:
      1. POST: validate EmailUserCreationForm
      2. On success: save user, auto-login, redirect to home
      3. On failure: re-render signup.html with form errors
    """
    if request.user.is_authenticated:
        return redirect('users:index')

    form = EmailUserCreationForm()

    if request.method == 'POST':
        form = EmailUserCreationForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(
                request,
                f"Welcome to D Threads, {user.first_name or user.email}! "
                "Your account is ready."
            )
            return redirect('users:index')

    return render(request, 'store/signup.html', {'form': form})


def logout_view(request):
    """
    Log out the current user and redirect to the home page.
    Accepts both GET and POST (the existing navbar logout button
    currently fires a JS click — keeping GET support avoids breaking it).
    """
    logout(request)
    messages.info(request, "You've been signed out. See you next drop.")
    return redirect('users:index')
