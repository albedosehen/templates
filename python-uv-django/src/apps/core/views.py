"""Core app views."""

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from .models import Task


def index(request: HttpRequest) -> HttpResponse:
    """Home page view."""
    task_count = Task.objects.count()
    pending_count = Task.objects.filter(status=Task.Status.PENDING).count()
    completed_count = Task.objects.filter(status=Task.Status.COMPLETED).count()

    context = {
        "task_count": task_count,
        "pending_count": pending_count,
        "completed_count": completed_count,
    }
    return render(request, "core/index.html", context)


class TaskListView(ListView):
    """List view for tasks."""

    model = Task
    template_name = "core/task_list.html"
    context_object_name = "tasks"
    paginate_by = 10

    def get_queryset(self):
        """Override queryset to add filtering."""
        queryset = super().get_queryset()
        status = self.request.GET.get("status")
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class TaskDetailView(DetailView):
    """Detail view for a single task."""

    model = Task
    template_name = "core/task_detail.html"
    context_object_name = "task"
