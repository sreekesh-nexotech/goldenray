from django.shortcuts import render, redirect
from django.views.decorators.cache import never_cache


@never_cache
def dashboard_view(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return redirect("bom:login")
    return render(request, "bom/dashboard.html")
