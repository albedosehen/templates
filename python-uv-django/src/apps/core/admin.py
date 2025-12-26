"""Admin configuration for core app."""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.html import format_html

if TYPE_CHECKING:
    from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    """Admin interface for Task model."""

    list_display = (
        "title",
        "status_badge",
        "priority",
        "due_date",
        "created_at",
        "is_overdue_badge",
    )
    list_filter = ("status", "priority", "created_at", "due_date")
    search_fields = ("title", "description")
    readonly_fields = ("created_at", "updated_at", "completed_at")
    date_hierarchy = "created_at"
    ordering = ("-priority", "-created_at")

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": ("title", "description", "status", "priority"),
            },
        ),
        (
            "Dates",
            {
                "fields": ("due_date", "completed_at", "created_at", "updated_at"),
            },
        ),
    )

    actions = ["mark_as_completed", "mark_as_in_progress", "mark_as_pending"]

    @admin.display(description="Status")
    def status_badge(self, obj: Task) -> str:
        """Display status with color badge."""
        colors: dict[str, str] = {
            Task.Status.PENDING: "gray",
            Task.Status.IN_PROGRESS: "blue",
            Task.Status.COMPLETED: "green",
            Task.Status.CANCELLED: "red",
        }
        color = colors.get(obj.status, "gray")
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display(),
        )

    @admin.display(description="Overdue", boolean=True)
    def is_overdue_badge(self, obj: Task) -> bool:
        """Display overdue status."""
        return obj.is_overdue

    @admin.action(description="Mark selected tasks as completed")
    def mark_as_completed(self, request: HttpRequest, queryset: QuerySet[Task]) -> None:
        """Mark selected tasks as completed."""
        for task in queryset:
            task.mark_completed()
        self.message_user(request, f"{queryset.count()} tasks marked as completed.")

    @admin.action(description="Mark selected tasks as in progress")
    def mark_as_in_progress(self, request: HttpRequest, queryset: QuerySet[Task]) -> None:
        """Mark selected tasks as in progress."""
        for task in queryset:
            task.mark_in_progress()
        self.message_user(request, f"{queryset.count()} tasks marked as in progress.")

    @admin.action(description="Mark selected tasks as pending")
    def mark_as_pending(self, request: HttpRequest, queryset: QuerySet[Task]) -> None:
        """Mark selected tasks as pending."""
        queryset.update(status=Task.Status.PENDING)
        self.message_user(request, f"{queryset.count()} tasks marked as pending.")
