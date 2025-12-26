"""Tests for core app selectors."""

import pytest

from django.utils import timezone

from apps.core.models import Task
from apps.core.selectors import TaskSelector


@pytest.mark.django_db
class TestTaskSelector:
    """Test TaskSelector functionality."""

    def test_get_pending_tasks(self, task_factory):
        """Test getting pending tasks."""
        task_factory(title="Pending 1", status=Task.Status.PENDING)
        task_factory(title="Pending 2", status=Task.Status.PENDING)
        task_factory(title="Completed", status=Task.Status.COMPLETED)
        task_factory(title="In Progress", status=Task.Status.IN_PROGRESS)

        pending_tasks = TaskSelector.get_pending_tasks()
        assert pending_tasks.count() == 2
        assert all(task.status == Task.Status.PENDING for task in pending_tasks)

    def test_get_completed_tasks(self, task_factory):
        """Test getting completed tasks."""
        task_factory(title="Pending", status=Task.Status.PENDING)
        task_factory(title="Completed 1", status=Task.Status.COMPLETED)
        task_factory(title="Completed 2", status=Task.Status.COMPLETED)

        completed_tasks = TaskSelector.get_completed_tasks()
        assert completed_tasks.count() == 2
        assert all(task.status == Task.Status.COMPLETED for task in completed_tasks)

    def test_get_overdue_tasks(self, task_factory):
        """Test getting overdue tasks."""
        past_date = timezone.now() - timezone.timedelta(days=1)
        future_date = timezone.now() + timezone.timedelta(days=1)

        # Overdue tasks
        task_factory(title="Overdue 1", due_date=past_date, status=Task.Status.PENDING)
        task_factory(title="Overdue 2", due_date=past_date, status=Task.Status.IN_PROGRESS)

        # Not overdue
        task_factory(title="Future", due_date=future_date, status=Task.Status.PENDING)
        task_factory(title="Completed Past", due_date=past_date, status=Task.Status.COMPLETED)
        task_factory(title="No Due Date", status=Task.Status.PENDING)

        overdue_tasks = TaskSelector.get_overdue_tasks()
        assert overdue_tasks.count() == 2
        for task in overdue_tasks:
            assert task.due_date < timezone.now()
            assert task.status != Task.Status.COMPLETED

    def test_get_overdue_tasks_empty(self, task_factory):
        """Test getting overdue tasks when there are none."""
        future_date = timezone.now() + timezone.timedelta(days=1)
        task_factory(title="Future", due_date=future_date, status=Task.Status.PENDING)

        overdue_tasks = TaskSelector.get_overdue_tasks()
        assert overdue_tasks.count() == 0
