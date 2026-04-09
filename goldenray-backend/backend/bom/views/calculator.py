from django.shortcuts import render, redirect
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods


@never_cache
@require_http_methods(["GET"])
def calculator_view(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return redirect("bom:login")
    return render(request, "bom/calculator.html", {
        "username": request.user.username,
    })
