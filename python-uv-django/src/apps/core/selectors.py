"""Query layer for core app."""

from django.db.models import QuerySet
from django.utils import timezone

from .models import Task


class TaskSelector:
    """Selector for Task queries."""

    @staticmethod
    def get_pending_tasks() -> QuerySet[Task]:
        """Get all pending tasks."""
        return Task.objects.filter(status=Task.Status.PENDING)

    @staticmethod
    def get_completed_tasks() -> QuerySet[Task]:
        """Get all completed tasks."""
        return Task.objects.filter(status=Task.Status.COMPLETED)

    @staticmethod
    def get_overdue_tasks() -> QuerySet[Task]:
        """Get overdue tasks."""
        return Task.objects.filter(due_date__lt=timezone.now()).exclude(
            status=Task.Status.COMPLETED
        )
