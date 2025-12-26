"""Business logic layer for core app."""

from .models import Task


class TaskService:
    """Service for Task business logic."""

    @staticmethod
    def create_task(title: str, description: str = "", priority: int = 0) -> Task:
        """Create a new task."""
        return Task.objects.create(
            title=title,
            description=description,
            priority=priority,
        )

    @staticmethod
    def complete_task(task: Task) -> Task:
        """Mark task as completed."""
        task.mark_completed()
        return task

    @staticmethod
    def start_task(task: Task) -> Task:
        """Mark task as in progress."""
        task.mark_in_progress()
        return task
