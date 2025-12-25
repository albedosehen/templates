"""Tests for core app services."""

import pytest

from apps.core.models import Task
from apps.core.services import TaskService


@pytest.mark.django_db
class TestTaskService:
    """Test TaskService functionality."""

    def test_create_task(self):
        """Test creating a task through service."""
        task = TaskService.create_task(
            title="Test Task", description="Test description", priority=5
        )
        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == "Test description"
        assert task.priority == 5
        assert task.status == Task.Status.PENDING

    def test_create_task_with_defaults(self):
        """Test creating a task with default values."""
        task = TaskService.create_task(title="Test Task")
        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == ""
        assert task.priority == 0

    def test_complete_task(self, sample_task):
        """Test completing a task through service."""
        assert sample_task.status != Task.Status.COMPLETED
        assert sample_task.completed_at is None

        completed_task = TaskService.complete_task(sample_task)

        assert completed_task.status == Task.Status.COMPLETED
        assert completed_task.completed_at is not None

    def test_start_task(self, sample_task):
        """Test starting a task through service."""
        assert sample_task.status == Task.Status.PENDING

        started_task = TaskService.start_task(sample_task)

        assert started_task.status == Task.Status.IN_PROGRESS
