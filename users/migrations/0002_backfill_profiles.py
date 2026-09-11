"""
Data migration: create a blank Profile row for every User that doesn't
already have one.

This covers:
  - Users created before the Profile model existed (e.g. via
    createsuperuser or an earlier migration).
  - Users created after the model existed but before apps.py registered
    the post_save signal via ready(), meaning the signal never fired.
"""

from django.db import migrations


def create_missing_profiles(apps, schema_editor):
    User    = apps.get_model('auth', 'User')
    Profile = apps.get_model('users', 'Profile')

    # Build a set of user_ids that already have a profile so we can skip them.
    existing = set(Profile.objects.values_list('user_id', flat=True))

    profiles_to_create = [
        Profile(user=user)
        for user in User.objects.exclude(id__in=existing)
    ]

    if profiles_to_create:
        Profile.objects.bulk_create(profiles_to_create)


def reverse_migration(apps, schema_editor):
    # Reversing a backfill is a no-op — we leave the profiles in place
    # rather than risk deleting data.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_missing_profiles, reverse_migration),
    ]
