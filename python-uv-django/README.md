# Python UV Django Template

A comprehensive Django 6.0+ template using [uv](https://github.com/astral-sh/uv) for blazingly fast package management, with Django REST Framework for building powerful APIs. This template follows Django best practices and includes comprehensive tooling for development, testing, and deployment.

## Features

- **Fast Package Management**: Uses uv for lightning-fast dependency resolution and installation
- **Modern Python**: Built for Python 3.12 with modern features and type hints
- **Django 6.0+**: Latest Django with all modern features
- **REST API**: Django REST Framework pre-configured with ViewSets and serializers
- **Services/Selectors Pattern**: Clean architecture with separated business logic and query layers
- **PostgreSQL Ready**: Production-ready database configuration
- **Redis Support**: Caching and session storage ready
- **Comprehensive Testing**: pytest-django with factory-boy for test fixtures
- **Code Quality**: Integrated linting (ruff), formatting (black), and type checking (mypy with django-stubs)
- **Docker Support**: Multi-stage Dockerfile with docker-compose for PostgreSQL and Redis
- **CI/CD**: GitHub Actions workflow with PostgreSQL service
- **Django-Idiomatic Structure**: No Node.js patterns, pure Django best practices
- **Security**: Production-ready security settings and environment-based configuration
- **Admin Interface**: Customized Django admin for Task management

## Prerequisites

- Python 3.12 or higher
- [uv](https://github.com/astral-sh/uv) package manager
- Docker and Docker Compose (optional, for containerized development)
- PostgreSQL (optional, for local development without Docker)

### Installing uv

```bash
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Quick Start

See [`QUICKSTART.md`](./QUICKSTART.md) for a detailed getting started guide.

### TL;DR

```bash
# Clone and navigate to the project
cd python-uv-django

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"

# Configure environment
cp .env.example .env

# Run migrations
python src/manage.py migrate

# Create superuser
python src/manage.py createsuperuser

# Start development server
python src/manage.py runserver
```

Visit [http://localhost:8000](http://localhost:8000)

## Project Structure

```bash
python-uv-django/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD pipeline
├── src/
│   ├── manage.py                     # Django management script
│   ├── config/                       # Django project configuration
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py              # Shared settings
│   │   │   ├── development.py       # Development overrides
│   │   │   └── production.py        # Production settings
│   │   ├── urls.py                  # Root URL configuration
│   │   ├── wsgi.py                  # WSGI application
│   │   └── asgi.py                  # ASGI application
│   ├── apps/
│   │   ├── core/                    # Core application
│   │   │   ├── models.py            # Task model
│   │   │   ├── views.py             # Django views
│   │   │   ├── services.py          # Business logic layer
│   │   │   ├── selectors.py         # Query layer
│   │   │   ├── urls.py              # URL patterns
│   │   │   ├── admin.py             # Admin configuration
│   │   │   ├── serializers.py       # DRF serializers
│   │   │   └── migrations/          # Database migrations
│   │   └── api/                     # API application
│   │       ├── views.py             # API ViewSets
│   │       ├── urls.py              # API routes
│   │       └── serializers.py       # API serializers
│   └── common/                      # Shared Django utilities
│       ├── models.py                # Abstract base models
│       └── mixins.py                # Reusable model mixins (if needed)
├── tests/
│   ├── conftest.py                  # Pytest fixtures and configuration
│   ├── apps/
│   │   ├── core/
│   │   │   ├── test_models.py       # Model tests
│   │   │   ├── test_services.py     # Service layer tests
│   │   │   └── test_selectors.py    # Selector tests
│   │   └── api/
│   │       └── test_api.py          # API endpoint tests
│   └── config/
│       └── test_settings.py         # Settings tests
├── .env.example                      # Environment variables template
├── .dockerignore                     # Docker ignore patterns
├── .gitignore                        # Git ignore patterns
├── .python-version                   # Python version specification
├── docker-compose.yml                # Multi-service Docker setup
├── Dockerfile                        # Multi-stage Docker build
├── pyproject.toml                    # Project configuration and dependencies
├── QUICKSTART.md                     # Quick start guide
└── README.md                         # This file
```

### Key Directories

- **`src/config/`**: Django project configuration with environment-specific settings
- **`src/apps/core/`**: Main application with Task model, business logic (services), and queries (selectors)
- **`src/apps/api/`**: REST API implementation with DRF ViewSets
- **`src/common/`**: Shared Django code (abstract models, mixins, etc.)
- **`tests/`**: Comprehensive test suite with pytest-django

### Architecture Patterns

This template follows Django best practices with a **services/selectors pattern** for clean architecture:

- **Models** ([`models.py`](./src/apps/core/models.py)): Django ORM models only, minimal business logic
- **Selectors** ([`selectors.py`](./src/apps/core/selectors.py)): Query layer - functions that fetch data from the database
- **Services** ([`services.py`](./src/apps/core/services.py)): Business logic layer - functions that modify data or perform actions
- **Views**: Thin layer that calls services/selectors and returns responses
- **Common** ([`common/`](./src/common/)): Shared utilities like abstract base models

This separation makes code easier to test, reuse, and maintain.

## Available Commands

### Django Management

```bash
# Run development server
python src/manage.py runserver

# Create database migrations
python src/manage.py makemigrations

# Apply migrations
python src/manage.py migrate

# Create superuser
python src/manage.py createsuperuser

# Open Django shell
python src/manage.py shell

# Collect static files (production)
python src/manage.py collectstatic

# Run system checks
python src/manage.py check
```

### Testing

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=term-missing

# Run tests in watch mode
uv run pytest-watch

# Run specific test file
uv run pytest tests/apps/core/test_models.py

# Run specific test
uv run pytest tests/apps/api/test_api.py::TestTaskAPI::test_create_task
```

### Code Quality

#### Linting with Ruff

```bash
# Check for linting issues
uv run ruff check .

# Auto-fix linting issues
uv run ruff check --fix .
```

#### Formatting with Black

```bash
# Format code
uv run black .

# Check formatting without making changes
uv run black --check .
```

#### Type Checking with Mypy

```bash
# Run type checker
uv run mypy src
```

## Architecture

### Services/Selectors Pattern

This template implements a clean architecture pattern that separates concerns:

#### **Selectors** (Query Layer)

Selectors are functions that **fetch data** from the database. They should be pure query functions with no side effects.

**Example** ([`src/apps/core/selectors.py`](./src/apps/core/selectors.py)):

```python
from django.db.models import QuerySet
from django.utils import timezone
from apps.core.models import Task


class TaskSelector:
    """Selector for Task queries."""

    @staticmethod
    def get_pending_tasks() -> QuerySet[Task]:
        """Get all pending tasks."""
        return Task.objects.filter(status=Task.Status.PENDING)

    @staticmethod
    def get_completed_tasks() -> QuerySet[Task]:
        """Get all completed tasks."""
        return Task.objects.filter(status=Task.Status.COMPLETED)

    @staticmethod
    def get_overdue_tasks() -> QuerySet[Task]:
        """Get overdue tasks."""
        return Task.objects.filter(due_date__lt=timezone.now()).exclude(
            status=Task.Status.COMPLETED
        )
```

#### **Services** (Business Logic Layer)

Services are functions that **perform actions** or **modify data**. They contain business logic and orchestrate operations.

**Example** ([`src/apps/core/services.py`](./src/apps/core/services.py)):

```python
from apps.core.models import Task


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
```

#### **Using Services/Selectors in Views**

Views should be thin - they just call services/selectors and return responses:

```python
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, redirect
from apps.core.selectors import TaskSelector
from apps.core.services import TaskService

def task_list(request: HttpRequest) -> HttpResponse:
    """Display list of all tasks."""
    tasks = TaskSelector.get_pending_tasks()
    return render(request, "core/task_list.html", {"tasks": tasks})

def create_task_view(request: HttpRequest) -> HttpResponse:
    """Create a new task."""
    if request.method == "POST":
        task = TaskService.create_task(
            title=request.POST["title"],
            description=request.POST.get("description", ""),
        )
        return redirect("task-detail", task_id=task.id)
    return render(request, "core/task_create.html")
```

#### **Benefits of This Pattern**

- **Testability**: Services and selectors are easy to unit test
- **Reusability**: Business logic can be reused across views, APIs, management commands
- **Clarity**: Clear separation between queries (selectors) and actions (services)
- **Maintainability**: Business logic is centralized, not scattered across views

### Run All Quality Checks

```bash
uv run ruff check . && \
uv run black --check . && \
uv run mypy src && \
uv run pytest --cov=src
```

## Docker Usage

### Using Docker Compose (Recommended)

**Start all services** (Django, PostgreSQL, Redis):

```bash
docker-compose up
```

**Run migrations**:

```bash
docker-compose exec web python src/manage.py migrate
```

**Create superuser**:

```bash
docker-compose exec web python src/manage.py createsuperuser
```

**View logs**:

```bash
docker-compose logs -f web
```

**Stop services**:

```bash
docker-compose down
```

### Using Docker Directly

**Build production image**:

```bash
docker build --target production -t django-app:latest .
```

**Build development image**:

```bash
docker build --target development -t django-app:dev .
```

**Run production container**:

```bash
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host/db \
  -e SECRET_KEY=your-secret-key \
  django-app:latest
```

## API Documentation

The template includes a fully functional REST API for Task management.

### Endpoints

#### Tasks API

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| GET | `/api/tasks/` | List all tasks (paginated) |
| POST | `/api/tasks/` | Create a new task |
| GET | `/api/tasks/{id}/` | Retrieve task details |
| PUT | `/api/tasks/{id}/` | Update task (full) |
| PATCH | `/api/tasks/{id}/` | Update task (partial) |
| DELETE | `/api/tasks/{id}/` | Delete task |
| POST | `/api/tasks/{id}/complete/` | Mark task as completed |
| POST | `/api/tasks/{id}/start/` | Mark task as in progress |
| GET | `/api/tasks/statistics/` | Get task statistics |

#### Query Parameters

- `?status=PENDING` - Filter by status
- `?search=keyword` - Search in title and description
- `?ordering=-priority` - Order by field (prefix with `-` for descending)
- `?overdue=true` - Show only overdue tasks

### Example API Calls

**List tasks:**

```bash
curl http://localhost:8000/api/tasks/
```

**Create task:**

```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the Django template",
    "priority": 10,
    "due_date": "2024-12-31T23:59:59Z"
  }'
```

**Update task:**

```bash
curl -X PATCH http://localhost:8000/api/tasks/1/ \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'
```

**Complete task:**

```bash
curl -X POST http://localhost:8000/api/tasks/1/complete/
```

**Get statistics:**

```bash
curl http://localhost:8000/api/tasks/statistics/
```

### Browsable API

Django REST Framework provides a browsable API interface. Navigate to:

- [http://localhost:8000/api/](http://localhost:8000/api/) - API root
- [http://localhost:8000/api/tasks/](http://localhost:8000/api/tasks/) - Tasks endpoint

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DJANGO_SETTINGS_MODULE=config.settings.development
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/django_db

# Logging
LOG_LEVEL=DEBUG

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Email (production)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-password
```

### Settings Modules

The template uses environment-specific settings:

- **`base.py`**: Shared settings for all environments
- **`development.py`**: Development-specific settings (DEBUG=True, SQLite, etc.)
- **`production.py`**: Production settings (DEBUG=False, security settings, etc.)

Switch between environments:

```bash
# Development (default)
export DJANGO_SETTINGS_MODULE=config.settings.development

# Production
export DJANGO_SETTINGS_MODULE=config.settings.production
```

## Database Migrations

### Creating Migrations

After modifying models:

```bash
python src/manage.py makemigrations
```

### Applying Migrations

```bash
python src/manage.py migrate
```

### Viewing Migration Status

```bash
python src/manage.py showmigrations
```

### Rolling Back Migrations

```bash
# Rollback to specific migration
python src/manage.py migrate core 0001

# Rollback all migrations for an app
python src/manage.py migrate core zero
```

## Development Guidelines

### Code Style

- Follow PEP 8 style guide
- Use type hints throughout the codebase
- Maximum line length: 100 characters
- Use docstrings for all public modules, classes, and functions

### Django Best Practices

1. **Always use Django's ORM** instead of raw SQL
2. **Use migrations** for all database schema changes
3. **Keep views thin** - move business logic to models or utils
4. **Use Django's built-in tools** - don't reinvent the wheel
5. **Write tests** for all new features and bug fixes

### Type Hints

This project uses static type checking with mypy and django-stubs:

```python
from django.http import HttpRequest, HttpResponse

def my_view(request: HttpRequest) -> HttpResponse:
    """Process request and return response."""
    # Implementation
    return HttpResponse("Hello")
```

### Writing Tests

Write comprehensive tests using pytest-django:

```python
import pytest
from apps.core.models import Task

@pytest.mark.django_db
def test_task_creation(task_factory):
    """Test creating a task."""
    task = task_factory(title="Test Task")
    assert task.title == "Test Task"
    assert task.status == Task.Status.PENDING
```

## Deployment

### Preparation

1. **Set production environment variables**:

   ```env
   DEBUG=False
   SECRET_KEY=<strong-random-key>
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```

2. **Collect static files**:

   ```bash
   python src/manage.py collectstatic --noinput
   ```

3. **Run migrations**:

   ```bash
   python src/manage.py migrate
   ```

### Using Gunicorn

The production Docker image uses Gunicorn:

```bash
gunicorn --bind 0.0.0.0:8000 --workers 4 --chdir src config.wsgi:application
```

### Environment Setup

For production deployment:

1. Use a production-grade database (PostgreSQL recommended)
2. Use Redis for caching and sessions
3. Set up a reverse proxy (Nginx, Apache, or cloud load balancer)
4. Configure SSL/TLS certificates
5. Set up monitoring and logging
6. Regular backups of database and media files

**Note**: The README.md file needs to exist for the [Dockerfile](./Dockerfile) COPY command and for [pyproject.toml](./pyproject.toml) readme reference to build successfully. You can adjust the files as needed to avoid the document requirement.

### Security Checklist

- [ ] `DEBUG = False` in production
- [ ] Strong `SECRET_KEY` (use secrets generator)
- [ ] Proper `ALLOWED_HOSTS` configuration
- [ ] HTTPS enabled (SSL/TLS)
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] Security middleware enabled
- [ ] Regular security updates

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. **Lints** code with ruff
2. **Formats** code with black
3. **Type checks** with mypy
4. **Runs Django system checks**
5. **Applies migrations** on PostgreSQL
6. **Runs tests** with coverage reporting
7. **Builds Docker images** (production and development)

## Adding Dependencies

### Runtime Dependencies

Add to the `dependencies` list in `pyproject.toml`:

```toml
dependencies = [
    "django>=5.0.0,<6.0.0",
    "your-new-package>=1.0.0",
]
```

Then install:

```bash
uv pip install -e .
```

### Development Dependencies

Add to `dev` optional dependencies:

```toml
[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "your-dev-package>=1.0.0",
]
```

Then install:

```bash
uv pip install -e ".[dev]"
```

## Troubleshooting

### Common Issues

#### "django.core.exceptions.ImproperlyConfigured: Set the SECRET_KEY environment variable"

**Solution**: Copy `.env.example` to `.env` and set `SECRET_KEY`

#### "django.db.utils.OperationalError: no such table"

**Solution**: Run migrations:

```bash
python src/manage.py migrate
```

#### "ModuleNotFoundError: No module named 'django'"

**Solution**: Activate virtual environment and install dependencies:

```bash
source .venv/bin/activate
uv pip install -e ".[dev]"
```

#### Port 8000 already in use

**Solution**: Use a different port or kill the existing process:

```bash
python src/manage.py runserver 8001
```

### Getting Help

- Check the [QUICKSTART.md](./QUICKSTART.md) guide
- Review Django documentation: <https://docs.djangoproject.com/>
- Check DRF documentation: <https://www.django-rest-framework.org/>
- Review uv documentation: <https://github.com/astral-sh/uv>

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run code quality checks:

   ```bash
   uv run ruff check --fix .
   uv run black .
   uv run mypy src
   uv run pytest
   ```

4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

[Your License Here]

## Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- Powered by [uv](https://github.com/astral-sh/uv)
- API built with [Django REST Framework](https://www.django-rest-framework.org/)

---

Built with ❤️ using Django 6.0+ and [uv](https://github.com/astral-sh/uv)
