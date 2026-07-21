"""Parse the small subset of Strapi REST query params the frontend uses
(+ a safe margin): populate, filters, fields, pagination, sort."""
import re

# client camelCase field → model column, for filtering & sorting on typed cols
FIELD_MAP = {
    "slug": "slug",
    "title": "title",
    "documentId": "document_id",
    "isFeatured": "is_featured",
    "sortOrder": "sort_order",
    "publishedOn": "published_on",
    "publishedAt": "published_at",
    "updatedAt": "updated_at",
    "readTime": "read_time",
}

OP_MAP = {
    "$eq": "exact",
    "$eqi": "iexact",
    "$in": "in",
    "$contains": "icontains",
    "$ne": "exact",  # handled with exclude
    "$null": "isnull",
    "$gt": "gt",
    "$gte": "gte",
    "$lt": "lt",
    "$lte": "lte",
}

MAX_PAGE_SIZE = 200
DEFAULT_PAGE_SIZE = 25

_filter_re = re.compile(r"^filters\[(?P<field>[^\]]+)\]\[(?P<op>\$[a-zA-Z]+)\]$")
_fields_re = re.compile(r"^fields\[\d+\]$")
_sort_re = re.compile(r"^sort\[\d+\]$")


def parse_filters(params):
    """Return (filter_kwargs, exclude_kwargs) for the ORM."""
    filters, excludes = {}, {}
    for raw_key in params.keys():
        m = _filter_re.match(raw_key)
        if not m:
            continue
        field = FIELD_MAP.get(m.group("field"))
        op = m.group("op")
        if field is None or op not in OP_MAP:
            continue
        value = params.get(raw_key)
        lookup = OP_MAP[op]

        if op == "$in":
            value = params.getlist(raw_key) or [v for v in value.split(",")]
        elif op == "$null":
            value = str(value).lower() in ("1", "true", "yes")

        key = f"{field}__{lookup}"
        if op == "$ne":
            excludes[f"{field}__exact"] = value
        else:
            filters[key] = value
    return filters, excludes


def parse_fields(params):
    """Return the list of requested scalar fields, or None if unrestricted."""
    fields = []
    for raw_key in params.keys():
        if _fields_re.match(raw_key) or raw_key == "fields":
            fields.extend(params.getlist(raw_key))
    return fields or None


def parse_pagination(params):
    page = params.get("pagination[page]", "1")
    page_size = params.get("pagination[pageSize]", str(DEFAULT_PAGE_SIZE))
    try:
        page = max(1, int(page))
    except (TypeError, ValueError):
        page = 1
    try:
        page_size = int(page_size)
    except (TypeError, ValueError):
        page_size = DEFAULT_PAGE_SIZE
    page_size = max(1, min(page_size, MAX_PAGE_SIZE))
    return page, page_size


def parse_sort(params):
    """Return a list of ORM order_by tokens. Falls back to the default model
    ordering when absent."""
    tokens = []
    raw = []
    for raw_key in params.keys():
        if _sort_re.match(raw_key) or raw_key == "sort":
            raw.extend(params.getlist(raw_key))
    for item in raw:
        # forms: "field", "field:asc", "field:desc"
        field, _, direction = item.partition(":")
        col = FIELD_MAP.get(field.strip())
        if not col:
            continue
        tokens.append(f"-{col}" if direction.strip().lower() == "desc" else col)
    return tokens
