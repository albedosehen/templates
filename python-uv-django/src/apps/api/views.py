"""API views using Django REST Framework."""

from __future__ import annotations

from typing import Any

from django.db.models import QuerySet
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.models import Task
from apps.core.selectors import TaskSelector
from apps.core.serializers import TaskCreateSerializer, TaskSerializer, TaskUpdateSerializer
from apps.core.services import TaskService


class TaskViewSet(viewsets.ModelViewSet):  # type: ignore[type-arg]
    """ViewSet for Task model API endpoints."""

    queryset = Task.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["title", "priority", "due_date", "created_at", "status"]
    ordering = ["-priority", "-created_at"]

    def get_serializer_class(self) -> type[serializers.Serializer[Any]]:
        """Return appropriate serializer class based on action."""
        if self.action == "create":
            return TaskCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return TaskUpdateSerializer
        return TaskSerializer

    def get_queryset(self) -> QuerySet[Task]:
        """Override queryset to add filtering by status."""
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter overdue tasks
        overdue = self.request.query_params.get("overdue")
        if overdue and overdue.lower() == "true":
            from django.utils import timezone

            queryset = queryset.filter(due_date__lt=timezone.now()).exclude(
                status=Task.Status.COMPLETED
            )

        return queryset

    @action(detail=True, methods=["post"])
    def complete(self, request: Request, pk: int | None = None) -> Response:
        """Mark a task as completed using service layer."""
        task = self.get_object()
        task = TaskService.complete_task(task)
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def start(self, request: Request, pk: int | None = None) -> Response:
        """Mark a task as in progress using service layer."""
        task = self.get_object()
        task = TaskService.start_task(task)
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def pending(self, request: Request) -> Response:
        """Get all pending tasks using selector layer."""
        pending_tasks = TaskSelector.get_pending_tasks()
        serializer = self.get_serializer(pending_tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def statistics(self, request: Request) -> Response:
        """Get task statistics using selector layer."""
        queryset = self.get_queryset()
        stats = {
            "total": queryset.count(),
            "pending": TaskSelector.get_pending_tasks().count(),
            "in_progress": queryset.filter(status=Task.Status.IN_PROGRESS).count(),
            "completed": TaskSelector.get_completed_tasks().count(),
            "cancelled": queryset.filter(status=Task.Status.CANCELLED).count(),
            "overdue": TaskSelector.get_overdue_tasks().count(),
        }
        return Response(stats)
