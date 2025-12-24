"""Core app models."""

from django.db import models
from django.utils import timezone


class Task(models.Model):
    """Example Task model demonstrating Django ORM patterns."""

    class Status(models.TextChoices):
        """Task status choices."""

        PENDING = "PENDING", "Pending"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    title = models.CharField(max_length=200, help_text="Task title")
    description = models.TextField(blank=True, help_text="Detailed description of the task")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        help_text="Current task status",
    )
    priority = models.IntegerField(default=0, help_text="Task priority (higher = more important)")
    due_date = models.DateTimeField(null=True, blank=True, help_text="Task due date")
    completed_at = models.DateTimeField(
        null=True, blank=True, help_text="When the task was completed"
    )
    created_at = models.DateTimeField(auto_now_add=True, help_text="When the task was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="When the task was last updated")

    class Meta:
        """Model metadata."""

        ordering = ["-priority", "-created_at"]
        verbose_name = "Task"
        verbose_name_plural = "Tasks"
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["-priority"]),
        ]

    def __str__(self) -> str:
        """Return string representation."""
        return f"{self.title} ({self.get_status_display()})"

    def mark_completed(self) -> None:
        """Mark the task as completed."""
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.save(update_fields=["status", "completed_at", "updated_at"])

    def mark_in_progress(self) -> None:
        """Mark the task as in progress."""
        self.status = self.Status.IN_PROGRESS
        self.save(update_fields=["status", "updated_at"])

    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue."""
        if self.due_date and self.status != self.Status.COMPLETED:
            return timezone.now() > self.due_date
        return False
