"""
URL configuration for the D THREADS users/store app.
"""

from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('',          views.index,    name='index'),
    path('orders/',   views.orders,   name='orders'),
    path('profile/',  views.profile,  name='profile'),
    path('shipping/', views.shipping, name='shipping'),
]
