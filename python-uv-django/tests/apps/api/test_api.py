"""Tests for API endpoints."""

from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from apps.core.models import Task


@pytest.mark.django_db
class TestTaskAPI:
    """Test Task API endpoints."""

    def test_list_tasks(self, api_client, multiple_tasks):
        """Test retrieving a list of tasks."""
        url = reverse("api:task-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3

    def test_create_task(self, api_client):
        """Test creating a task via API."""
        url = reverse("api:task-list")
        data = {
            "title": "New Task",
            "description": "New task description",
            "priority": 5,
        }
        response = api_client.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "New Task"
        assert Task.objects.filter(title="New Task").exists()

    def test_retrieve_task(self, api_client, sample_task):
        """Test retrieving a single task."""
        url = reverse("api:task-detail", kwargs={"pk": sample_task.pk})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == sample_task.id
        assert response.data["title"] == sample_task.title

    def test_update_task(self, api_client, sample_task):
        """Test updating a task."""
        url = reverse("api:task-detail", kwargs={"pk": sample_task.pk})
        data = {
            "title": "Updated Task",
            "description": "Updated description",
            "status": Task.Status.IN_PROGRESS,
            "priority": 10,
        }
        response = api_client.put(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Updated Task"
        sample_task.refresh_from_db()
        assert sample_task.title == "Updated Task"

    def test_partial_update_task(self, api_client, sample_task):
        """Test partially updating a task."""
        url = reverse("api:task-detail", kwargs={"pk": sample_task.pk})
        data = {"priority": 15}
        response = api_client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["priority"] == 15
        sample_task.refresh_from_db()
        assert sample_task.priority == 15

    def test_delete_task(self, api_client, sample_task):
        """Test deleting a task."""
        url = reverse("api:task-detail", kwargs={"pk": sample_task.pk})
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Task.objects.filter(pk=sample_task.pk).exists()

    def test_complete_task_action(self, api_client, sample_task):
        """Test the complete task action."""
        url = reverse("api:task-complete", kwargs={"pk": sample_task.pk})
        response = api_client.post(url)

        assert response.status_code == status.HTTP_200_OK
        sample_task.refresh_from_db()
        assert sample_task.status == Task.Status.COMPLETED
        assert sample_task.completed_at is not None

    def test_start_task_action(self, api_client, sample_task):
        """Test the start task action."""
        url = reverse("api:task-start", kwargs={"pk": sample_task.pk})
        response = api_client.post(url)

        assert response.status_code == status.HTTP_200_OK
        sample_task.refresh_from_db()
        assert sample_task.status == Task.Status.IN_PROGRESS

    def test_pending_action(self, api_client, task_factory):
        """Test the pending action."""
        # Create a mix of pending and non-pending tasks
        pending_task_1 = task_factory(title="Pending Task 1", status=Task.Status.PENDING)
        pending_task_2 = task_factory(title="Pending Task 2", status=Task.Status.PENDING)
        task_factory(title="In Progress Task", status=Task.Status.IN_PROGRESS)
        task_factory(title="Completed Task", status=Task.Status.COMPLETED)
        task_factory(title="Cancelled Task", status=Task.Status.CANCELLED)

        url = reverse("api:task-pending")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        
        # Verify only pending tasks are returned
        returned_ids = [task["id"] for task in response.data]
        assert pending_task_1.id in returned_ids
        assert pending_task_2.id in returned_ids
        
        # Verify all returned tasks have pending status
        for task_data in response.data:
            assert task_data["status"] == Task.Status.PENDING

    def test_statistics_action(self, api_client, multiple_tasks):
        """Test the statistics action."""
        url = reverse("api:task-statistics")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert "total" in response.data
        assert response.data["total"] == 3
        assert response.data["pending"] == 1
        assert response.data["in_progress"] == 1
        assert response.data["completed"] == 1

    def test_filter_tasks_by_status(self, api_client, multiple_tasks):
        """Test filtering tasks by status."""
        url = reverse("api:task-list")
        response = api_client.get(url, {"status": Task.Status.COMPLETED})

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["status"] == Task.Status.COMPLETED

    def test_search_tasks(self, api_client, task_factory):
        """Test searching tasks."""
        task_factory(title="Python Development", description="Write Python code")
        task_factory(title="JavaScript Development", description="Write JS code")

        url = reverse("api:task-list")
        response = api_client.get(url, {"search": "Python"})

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert "Python" in response.data["results"][0]["title"]

    def test_ordering_tasks(self, api_client, task_factory):
        """Test ordering tasks."""
        task_factory(title="Task A", priority=1)
        task_factory(title="Task B", priority=5)
        task_factory(title="Task C", priority=3)

        url = reverse("api:task-list")
        response = api_client.get(url, {"ordering": "priority"})

        assert response.status_code == status.HTTP_200_OK
        priorities = [task["priority"] for task in response.data["results"]]
        assert priorities == sorted(priorities)
