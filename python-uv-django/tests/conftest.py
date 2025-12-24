"""Pytest configuration and fixtures for Django tests."""

import os
import sys
from pathlib import Path

import pytest

from rest_framework.test import APIClient

# Add the src directory to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / "src"
sys.path.insert(0, str(SRC_DIR))

# Configure Django settings for tests
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

import django

django.setup()


@pytest.fixture
def api_client():
    """Provide an API client for testing."""
    return APIClient()


@pytest.fixture
def authenticated_api_client(db, django_user_model):
    """Provide an authenticated API client for testing."""
    from django.contrib.auth import get_user_model

    User = get_user_model()
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpassword123",
    )
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def task_factory():
    """Factory for creating Task instances."""
    from apps.core.models import Task

    def create_task(**kwargs):
        defaults = {
            "title": "Test Task",
            "description": "Test description",
            "status": Task.Status.PENDING,
            "priority": 0,
        }
        defaults.update(kwargs)
        return Task.objects.create(**defaults)

    return create_task


@pytest.fixture
def sample_task(db, task_factory):
    """Provide a sample task for testing."""
    return task_factory()


@pytest.fixture
def multiple_tasks(db, task_factory):
    """Provide multiple tasks with different statuses."""
    from apps.core.models import Task

    return [
        task_factory(title="Pending Task", status=Task.Status.PENDING, priority=1),
        task_factory(title="In Progress Task", status=Task.Status.IN_PROGRESS, priority=2),
        task_factory(title="Completed Task", status=Task.Status.COMPLETED, priority=3),
    ]
