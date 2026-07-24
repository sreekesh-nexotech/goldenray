from django.apps import AppConfig


class MediaConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "media"

    def ready(self):
        # Register CDN push/cleanup signals.
        from . import signals  # noqa: F401
