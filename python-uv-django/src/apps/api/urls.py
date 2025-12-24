"""API URL configuration."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "api"

# Create a router and register viewsets
router = DefaultRouter()
router.register(r"tasks", views.TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
]
