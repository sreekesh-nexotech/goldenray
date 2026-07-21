"""Public, Strapi-compatible delivery API.

    GET /api/<api_uid>?populate=*&pagination[pageSize]=100
    GET /api/<api_uid>?populate=*&filters[slug][$eq]=<slug>
    GET /api/<api_uid>?fields[0]=slug

Serves **published** entries only. Response is the Strapi v5 flat envelope
`{ data: [...], meta: { pagination } }`.
"""
from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Collection
from content.selectors import published_entries

from .query import parse_fields, parse_filters, parse_pagination, parse_sort
from .serializers import build_entry_fields_only, build_entry_payload


class CollectionDeliveryView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # public endpoint, no auth attempted

    def get(self, request, api_uid: str):
        if not Collection.objects.filter(api_uid=api_uid, is_active=True).exists():
            raise Http404(f"Unknown collection '{api_uid}'")

        qs = published_entries(api_uid)

        # filters[...]
        filters, excludes = parse_filters(request.query_params)
        if filters:
            qs = qs.filter(**filters)
        if excludes:
            qs = qs.exclude(**excludes)

        # sort[...]
        sort_tokens = parse_sort(request.query_params)
        if sort_tokens:
            qs = qs.order_by(*sort_tokens)

        total = qs.count()

        # pagination[...]
        page, page_size = parse_pagination(request.query_params)
        start = (page - 1) * page_size
        entries = list(qs[start:start + page_size])

        # fields[...] — scalars only (e.g. slugs) when present
        fields = parse_fields(request.query_params)
        if fields:
            data = [build_entry_fields_only(e, fields) for e in entries]
        else:
            data = [build_entry_payload(e) for e in entries]

        page_count = (total + page_size - 1) // page_size if page_size else 1
        body = {
            "data": data,
            "meta": {
                "pagination": {
                    "page": page,
                    "pageSize": page_size,
                    "pageCount": page_count,
                    "total": total,
                }
            },
        }
        resp = Response(body)
        # Published content is highly cacheable.
        resp["Cache-Control"] = "public, max-age=60, stale-while-revalidate=600"
        return resp
