from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import never_cache


@never_cache
@require_http_methods(["GET", "POST"])
def login_view(request):
    if request.user.is_authenticated and request.user.is_superuser:
        return redirect("bom:dashboard")

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(request, username=username, password=password)

        if user is None:
            messages.error(request, "Invalid username or password.")
            return render(request, "bom/login.html", {"username": username})

        if not user.is_superuser:
            messages.error(request, "Access denied. This portal is restricted to superusers.")
            return render(request, "bom/login.html", {"username": username})

        login(request, user)
        next_url = request.GET.get("next", "")
        return redirect(next_url if next_url else "bom:dashboard")

    return render(request, "bom/login.html")


@require_http_methods(["POST", "GET"])
def logout_view(request):
    logout(request)
    return redirect("bom:login")
