from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        # Import the signal handlers so Django registers them when the app
        # starts up.  Without this, the @receiver decorators in models.py
        # are only active if models.py happens to be imported early — which
        # is non-deterministic and means some users never get a Profile row.
        import users.models  # noqa: F401  — side-effect import triggers @receiver
