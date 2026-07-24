"""BunnyCDN media pipeline.

Every uploaded image is:
  1. compressed — resized to at most BUNNY_IMAGE_MAX_DIM px on the long edge and
     re-encoded as WebP (quality BUNNY_IMAGE_QUALITY, alpha preserved);
  2. pushed to Bunny storage under ``cms/<collection api_uid>/`` (or
     ``cms/general/`` when the asset isn't tied to a collection);
  3. served from ``BUNNY_CDN_BASE_URL`` — the asset's ``cdn_url``.

All uploads are best-effort: if Bunny is unreachable the asset keeps working
from local MEDIA storage and a warning is logged.
"""
import logging
import uuid
from io import BytesIO

import requests
from django.conf import settings
from django.utils.text import slugify
from PIL import Image

logger = logging.getLogger("blog_cms")


def compress_image(fileobj, *, max_dim=None, quality=None):
    """Return (webp_bytes, width, height) for an uploaded image file."""
    max_dim = max_dim or settings.BUNNY_IMAGE_MAX_DIM
    quality = quality or settings.BUNNY_IMAGE_QUALITY

    img = Image.open(fileobj)
    # Preserve transparency; flatten everything else to RGB.
    if "A" in img.getbands() or img.mode == "P":
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")

    w, h = img.size
    longest = max(w, h)
    if longest > max_dim:
        scale = max_dim / longest
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    buf = BytesIO()
    img.save(buf, "WEBP", quality=quality, method=6)
    return buf.getvalue(), img.width, img.height


def build_storage_path(original_name: str, collection_uid: str | None) -> str:
    """cms/<collection>/<slug>-<8charuid>.webp — unique, so no cache purging needed."""
    stem = original_name.rsplit("/", 1)[-1]
    stem = stem.rsplit(".", 1)[0]
    safe = slugify(stem)[:60] or "image"
    folder = collection_uid or "general"
    return f"cms/{folder}/{safe}-{uuid.uuid4().hex[:8]}.webp"


def upload_bytes(path: str, data: bytes) -> str:
    """PUT bytes to Bunny storage; return the public CDN URL. Raises on failure."""
    url = f"https://{settings.BUNNY_STORAGE_ENDPOINT}/{settings.BUNNY_STORAGE_ZONE}/{path}"
    resp = requests.put(
        url,
        data=data,
        headers={"AccessKey": settings.BUNNY_STORAGE_PASSWORD, "Content-Type": "application/octet-stream"},
        timeout=30,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Bunny upload failed ({resp.status_code}): {resp.text[:200]}")
    return f"{settings.BUNNY_CDN_BASE_URL}/{path}"


def delete_path(path: str) -> None:
    """Best-effort delete of a storage object (used when an asset is removed)."""
    url = f"https://{settings.BUNNY_STORAGE_ENDPOINT}/{settings.BUNNY_STORAGE_ZONE}/{path}"
    try:
        requests.delete(url, headers={"AccessKey": settings.BUNNY_STORAGE_PASSWORD}, timeout=15)
    except Exception as exc:  # pragma: no cover
        logger.warning("Bunny delete failed for %s: %s", path, exc)


def process_asset(asset) -> bool:
    """Compress + upload a MediaAsset's file to Bunny and stamp its cdn_url.

    Returns True on success. Best-effort — failures leave the asset serving
    from local media and log a warning.
    """
    if not settings.BUNNY_ENABLED:
        return False
    if not asset.file:
        return False
    try:
        asset.file.open("rb")
        data, w, h = compress_image(asset.file)
        collection_uid = asset.collection.api_uid if asset.collection_id else None
        path = build_storage_path(asset.file.name, collection_uid)
        cdn_url = upload_bytes(path, data)
    except Exception as exc:
        logger.warning("Bunny processing failed for asset %s: %s", asset.pk, exc)
        return False

    # queryset update → no post_save recursion
    type(asset).objects.filter(pk=asset.pk).update(
        cdn_url=cdn_url,
        storage_path=path,
        width=w,
        height=h,
        size=len(data),
        mime="image/webp",
    )
    # refresh in-memory copy for any caller holding the instance
    asset.cdn_url = cdn_url
    asset.storage_path = path
    asset.width, asset.height, asset.size, asset.mime = w, h, len(data), "image/webp"
    logger.info("Asset %s pushed to CDN: %s (%d bytes)", asset.pk, cdn_url, len(data))
    return True
