"""API views using Django REST Framework."""

from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.models import Task
from apps.core.serializers import TaskCreateSerializer, TaskSerializer, TaskUpdateSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for Task model API endpoints."""

    queryset = Task.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["title", "priority", "due_date", "created_at", "status"]
    ordering = ["-priority", "-created_at"]

    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action == "create":
            return TaskCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return TaskUpdateSerializer
        return TaskSerializer

    def get_queryset(self):
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
    def complete(self, request, pk=None):
        """Mark a task as completed."""
        task = self.get_object()
        task.mark_completed()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        """Mark a task as in progress."""
        task = self.get_object()
        task.mark_in_progress()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        """Get task statistics."""
        queryset = self.get_queryset()
        stats = {
            "total": queryset.count(),
            "pending": queryset.filter(status=Task.Status.PENDING).count(),
            "in_progress": queryset.filter(status=Task.Status.IN_PROGRESS).count(),
            "completed": queryset.filter(status=Task.Status.COMPLETED).count(),
            "cancelled": queryset.filter(status=Task.Status.CANCELLED).count(),
        }
        return Response(stats)
