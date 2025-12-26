"""Serializers for core app models."""

from __future__ import annotations

from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    """Serializer for Task model."""

    is_overdue = serializers.ReadOnlyField()

    class Meta:
        """Serializer meta configuration."""

        model = Task
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "due_date",
            "completed_at",
            "created_at",
            "updated_at",
            "is_overdue",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "completed_at", "is_overdue"]

    def validate_priority(self, value: int) -> int:
        """Validate priority is within acceptable range."""
        if value < 0:
            raise serializers.ValidationError("Priority must be a positive integer.")
        if value > 100:
            raise serializers.ValidationError("Priority cannot exceed 100.")
        return value


class TaskCreateSerializer(TaskSerializer):
    """Serializer for creating tasks."""

    class Meta(TaskSerializer.Meta):
        """Serializer meta configuration."""

        fields = [
            "title",
            "description",
            "status",
            "priority",
            "due_date",
        ]


class TaskUpdateSerializer(TaskSerializer):
    """Serializer for updating tasks."""

    class Meta(TaskSerializer.Meta):
        """Serializer meta configuration."""

        fields = [
            "title",
            "description",
            "status",
            "priority",
            "due_date",
        ]
