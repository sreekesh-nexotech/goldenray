"""Instant-freshness bridge to the Next.js frontend.

On publish / unpublish / delete we ping the frontend's on-demand revalidation
route so the blog page rebuilds in seconds instead of waiting for ISR. Failures
are swallowed (best-effort) — the API is always live regardless.
"""
import logging

from django.conf import settings

logger = logging.getLogger("blog_cms")


def trigger_revalidate(slug: str | None = None) -> None:
    url = getattr(settings, "FRONTEND_REVALIDATE_URL", "")
    if not url:
        return
    payload = {"secret": getattr(settings, "FRONTEND_REVALIDATE_SECRET", "")}
    if slug:
        payload["slug"] = slug
    try:
        import requests  # local import so the dependency is optional

        requests.post(url, json=payload, timeout=3)
        logger.info("Revalidation pinged for slug=%s", slug or "*")
    except Exception as exc:  # pragma: no cover - best effort
        logger.warning("Revalidation ping failed: %s", exc)
