"""Tests for core app models."""

import pytest

from django.utils import timezone

from apps.core.models import Task


@pytest.mark.django_db
class TestTaskModel:
    """Test Task model functionality."""

    def test_create_task(self, task_factory):
        """Test creating a task."""
        task = task_factory(title="Test Task", description="Test description")
        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == "Test description"
        assert task.status == Task.Status.PENDING

    def test_task_string_representation(self, sample_task):
        """Test task string representation."""
        expected = f"{sample_task.title} ({sample_task.get_status_display()})"
        assert str(sample_task) == expected

    def test_mark_completed(self, sample_task):
        """Test marking a task as completed."""
        sample_task.mark_completed()
        assert sample_task.status == Task.Status.COMPLETED
        assert sample_task.completed_at is not None

    def test_mark_in_progress(self, sample_task):
        """Test marking a task as in progress."""
        sample_task.mark_in_progress()
        assert sample_task.status == Task.Status.IN_PROGRESS

    def test_is_overdue_when_past_due_date(self, task_factory):
        """Test is_overdue property for overdue tasks."""
        past_date = timezone.now() - timezone.timedelta(days=1)
        task = task_factory(due_date=past_date, status=Task.Status.PENDING)
        assert task.is_overdue is True

    def test_is_not_overdue_when_future_due_date(self, task_factory):
        """Test is_overdue property for tasks with future due dates."""
        future_date = timezone.now() + timezone.timedelta(days=1)
        task = task_factory(due_date=future_date, status=Task.Status.PENDING)
        assert task.is_overdue is False

    def test_is_not_overdue_when_completed(self, task_factory):
        """Test is_overdue property for completed tasks."""
        past_date = timezone.now() - timezone.timedelta(days=1)
        task = task_factory(due_date=past_date, status=Task.Status.COMPLETED)
        assert task.is_overdue is False

    def test_task_ordering(self, db, task_factory):
        """Test that tasks are ordered by priority and created date."""
        task1 = task_factory(title="Low Priority", priority=1)
        task2 = task_factory(title="High Priority", priority=10)
        task3 = task_factory(title="Medium Priority", priority=5)

        tasks = list(Task.objects.all())
        assert tasks[0] == task2  # Highest priority first
        assert tasks[1] == task3
        assert tasks[2] == task1

    def test_task_status_choices(self):
        """Test that all status choices are available."""
        assert Task.Status.PENDING in Task.Status.values
        assert Task.Status.IN_PROGRESS in Task.Status.values
        assert Task.Status.COMPLETED in Task.Status.values
        assert Task.Status.CANCELLED in Task.Status.values
