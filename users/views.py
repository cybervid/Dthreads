"""
Views for the D THREADS store.
All interactive logic (cart, modals, filters) runs client-side via JavaScript.
"""

from django.shortcuts import render


def index(request):
    """Home — hero, products, about, reviews, contact."""
    return render(request, 'store/index.html')


def orders(request):
    """My Orders — order history and tracking modal."""
    return render(request, 'store/orders.html')


def profile(request):
    """Profile Settings — account details, security, preferences."""
    return render(request, 'store/profile.html')


def shipping(request):
    """Shipping Policy — policy articles and contact support."""
    return render(request, 'store/shipping.html')
