"""
Models for the D THREADS store.

Profile extends Django's built-in User with shipping/contact fields.
A Profile row is automatically created (and never duplicated) whenever
a new User is saved, via the post_save signal below.
"""

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    """
    One-to-one extension of auth.User.
    Stores fields that don't belong on the core User object:
    phone number and shipping address components.

    Email lives on User.email (the login key) and is intentionally
    excluded from this model and from every update form — it cannot
    be changed through the profile page.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )

    # Contact
    phone = models.CharField(max_length=30, blank=True, default='')

    # Shipping address
    address = models.CharField(max_length=255, blank=True, default='')
    city    = models.CharField(max_length=100, blank=True, default='')
    state   = models.CharField(max_length=100, blank=True, default='')
    zip_code = models.CharField(max_length=20,  blank=True, default='')
    country  = models.CharField(max_length=10,  blank=True, default='')

    class Meta:
        verbose_name        = 'Profile'
        verbose_name_plural = 'Profiles'

    def __str__(self):
        return f'Profile({self.user.email})'


# ── Signals ────────────────────────────────────────────────────────────────

@receiver(post_save, sender=User)
def create_or_save_profile(sender, instance, created, **kwargs):
    """
    Automatically create a blank Profile whenever a new User is saved.
    For existing users, just call save() on the already-existing Profile
    so that any future per-save logic in Profile.save() still runs.
    """
    if created:
        Profile.objects.create(user=instance)
    else:
        # get_or_create guards against the edge case where a User row
        # existed before this signal was wired up (e.g. users created
        # via createsuperuser before this migration was applied).
        Profile.objects.get_or_create(user=instance)
