from django.apps import AppConfig


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "content"

    def ready(self):
        # Register publish/delete signals that trigger frontend revalidation.
        from . import signals  # noqa: F401
