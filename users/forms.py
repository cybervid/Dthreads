"""
D THREADS — forms.py

Authentication forms:
  - EmailAuthenticationForm  : Login with email + password
  - EmailUserCreationForm    : Sign up with email (email used as both
                               the display identifier AND the username)

Profile update forms:
  - UserUpdateForm    : Update first_name and last_name on auth.User.
                        Email is intentionally excluded — it is the login
                        key and can only be changed via support.
  - ProfileUpdateForm : Update phone, address, city, state, zip_code,
                        country on the Profile model.

Django's built-in User model uses `username` as the unique login key.
We map the user-visible "email" field onto the `username` field so
customers never see the word "username" anywhere in the UI.
"""

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from .models import Profile


# ── LOGIN ──────────────────────────────────────────────────────────────────
class EmailAuthenticationForm(forms.Form):
    """
    Authenticates a user by email + password.
    Stores the authenticated User object on self.user_cache so the view
    can call login() immediately after form.is_valid().
    """

    email = forms.EmailField(
        label='Email Address',
        widget=forms.EmailInput(attrs={
            'autocomplete': 'email',
            'placeholder': 'you@example.com',
        }),
    )
    password = forms.CharField(
        label='Password',
        strip=False,
        widget=forms.PasswordInput(attrs={
            'autocomplete': 'current-password',
            'placeholder': 'Enter your password',
        }),
    )

    def __init__(self, request=None, *args, **kwargs):
        self.request    = request
        self.user_cache = None
        super().__init__(*args, **kwargs)

    def clean(self):
        email    = self.cleaned_data.get('email', '').strip().lower()
        password = self.cleaned_data.get('password')

        if email and password:
            # Django's default User stores email-as-username in the
            # username column (normalised to lower-case on creation).
            self.user_cache = authenticate(
                self.request,
                username=email,
                password=password,
            )
            if self.user_cache is None:
                raise ValidationError(
                    'Invalid email or password. Please try again.',
                    code='invalid_login',
                )
            if not self.user_cache.is_active:
                raise ValidationError(
                    'This account has been deactivated.',
                    code='inactive',
                )
        return self.cleaned_data

    def get_user(self):
        return self.user_cache


# ── SIGN UP ────────────────────────────────────────────────────────────────
class EmailUserCreationForm(UserCreationForm):
    """
    Extends Django's UserCreationForm so the user enters an email address
    (not an invented username).  The email is normalised and stored in
    BOTH the username and email columns so the login form can find it.
    """

    email = forms.EmailField(
        label='Email Address',
        max_length=254,
        widget=forms.EmailInput(attrs={
            'autocomplete': 'email',
            'placeholder': 'you@example.com',
        }),
    )
    first_name = forms.CharField(
        label='First Name',
        max_length=30,
        required=False,
        widget=forms.TextInput(attrs={
            'autocomplete': 'given-name',
            'placeholder': 'First name',
        }),
    )
    last_name = forms.CharField(
        label='Last Name',
        max_length=150,
        required=False,
        widget=forms.TextInput(attrs={
            'autocomplete': 'family-name',
            'placeholder': 'Last name',
        }),
    )

    class Meta(UserCreationForm.Meta):
        model  = User
        # We deliberately exclude 'username' — it is set programmatically.
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data['email'].strip().lower()
        if User.objects.filter(username=email).exists():
            raise ValidationError(
                'An account with this email address already exists.'
            )
        return email

    def save(self, commit=True):
        user            = super().save(commit=False)
        email           = self.cleaned_data['email']
        user.username   = email          # username == email
        user.email      = email
        user.first_name = self.cleaned_data.get('first_name', '').strip()
        user.last_name  = self.cleaned_data.get('last_name', '').strip()
        if commit:
            user.save()
        return user


# ── PROFILE UPDATE ─────────────────────────────────────────────────────────

class UserUpdateForm(forms.ModelForm):
    """
    Lets an authenticated user update their first and last name.

    Email is deliberately absent from `fields`.  Django's ModelForm only
    processes fields listed here, so even if a malicious actor injects an
    email value in the POST body, the form will never read it, validate it,
    or save it.  The client-side readonly attribute is UX; this is the
    real security boundary.
    """

    first_name = forms.CharField(
        label='First Name',
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'First name',
            'autocomplete': 'new-password',
            'id': 'pf-firstname',
        }),
    )
    last_name = forms.CharField(
        label='Last Name',
        max_length=150,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Last name',
            'autocomplete': 'new-password',
            'id': 'pf-lastname',
        }),
    )

    class Meta:
        model  = User
        # email is NOT in this list — it cannot be changed via the profile page
        fields = ('first_name', 'last_name')


class ProfileUpdateForm(forms.ModelForm):
    """
    Lets an authenticated user update their contact and shipping details,
    stored on the Profile model (separate DB row from auth.User).
    """

    COUNTRY_CHOICES = [
        ('',     'Select country…'),
        ('NG',   'Nigeria'),
        ('GH',   'Ghana'),
        ('ZA',   'South Africa'),
        ('KE',   'Kenya'),
        ('GB',   'United Kingdom'),
        ('US',   'United States'),
        ('CA',   'Canada'),
        ('DE',   'Germany'),
        ('FR',   'France'),
        ('other','Other'),
    ]

    phone = forms.CharField(
        label='Phone Number',
        max_length=30,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': '+1 (555) 000-0000',
            'autocomplete': 'new-password',
            'id': 'pf-phone',
            'type': 'tel',
        }),
    )
    address = forms.CharField(
        label='Street Address',
        max_length=255,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': '123 Neon Street',
            'autocomplete': 'new-password',
            'id': 'pf-address',
        }),
    )
    city = forms.CharField(
        label='City',
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Lagos',
            'autocomplete': 'new-password',
            'id': 'pf-city',
        }),
    )
    state = forms.CharField(
        label='State / Region',
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'NG',
            'autocomplete': 'new-password',
            'id': 'pf-state',
        }),
    )
    zip_code = forms.CharField(
        label='ZIP / Postal Code',
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': '100001',
            'autocomplete': 'new-password',
            'id': 'pf-zip',
        }),
    )
    country = forms.ChoiceField(
        label='Country',
        choices=COUNTRY_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-input form-select',
            'autocomplete': 'off',
            'id': 'pf-country',
        }),
    )

    class Meta:
        model  = Profile
        fields = ('phone', 'address', 'city', 'state', 'zip_code', 'country')
