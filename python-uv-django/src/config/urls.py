"""URL configuration for the Django project."""

from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

# API router
router = DefaultRouter()

urlpatterns = [
    # Django admin
    path("admin/", admin.site.urls),
    # Core app URLs
    path("", include("apps.core.urls")),
    # API URLs
    path("api/", include("apps.api.urls")),
    # DRF browsable API auth
    path("api-auth/", include("rest_framework.urls")),
]

# Customize admin site
admin.site.site_header = "Django Application Admin"
admin.site.site_title = "Django Application"
admin.site.index_title = "Welcome to Django Application Administration"
