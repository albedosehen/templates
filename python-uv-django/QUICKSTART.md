# Django Quick Start Guide

This guide will help you quickly get started with the Django 6.0+ template using uv for package management.

## What is Django?

**Django** is a high-level Python web framework that enables rapid development of secure and maintainable websites. It follows the Model-View-Template (MVT) architectural pattern and comes with "batteries included" - many features are built-in.

### Key Components

#### 1. **Models**

- Define your data structure
- ORM (Object-Relational Mapping) for database operations
- Automatic database migrations

#### 2. **Views**

- Handle requests and return responses
- Process business logic
- Can be function-based or class-based

#### 3. **URLs**

- Route URLs to views
- Support for path parameters and query strings
- Named URL patterns for reverse resolution

#### 4. **Django REST Framework**

- Build powerful Web APIs
- Serializers for converting Python objects to JSON
- ViewSets for RESTful endpoints

## 5-Minute Setup

### Step 1: Install uv

```shell
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Step 2: Create Virtual Environment

```shell
cd python-uv-django
uv venv
```

Activate the virtual environment:

```shell
# On macOS/Linux
source .venv/bin/activate

# On Windows
.venv\Scripts\activate
```

### Step 3: Install Dependencies

```shell
uv pip install -e ".[dev]"
```

### Step 4: Configure Environment

Copy the example environment file:

```shell
cp .env.example .env
```

Edit `.env` and set your `SECRET_KEY`:

```env
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

### Step 5: Run Migrations

```shell
python src/manage.py migrate
```

### Step 6: Create Superuser

```shell
python src/manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 7: Start Development Server

```shell
python src/manage.py runserver
```

Open your browser to [http://localhost:8000](http://localhost:8000)

## Try It Out

### Admin Interface

1. Navigate to [http://localhost:8000/admin/](http://localhost:8000/admin/)
2. Log in with your superuser credentials
3. Explore the Task management interface

### API Endpoints

The template includes a complete REST API for Task management:

#### List all tasks

```shell
curl http://localhost:8000/api/tasks/
```

Response:

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Sample Task",
      "description": "This is a sample task",
      "status": "PENDING",
      "priority": 5,
      "due_date": null,
      "completed_at": null,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "is_overdue": false
    }
  ]
}
```

#### Create a new task

```shell
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete documentation",
    "description": "Write comprehensive docs",
    "priority": 10
  }'
```

#### Get task details

```shell
curl http://localhost:8000/api/tasks/1/
```

#### Update a task

```shell
curl -X PATCH http://localhost:8000/api/tasks/1/ \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'
```

#### Complete a task

```shell
curl -X POST http://localhost:8000/api/tasks/1/complete/
```

#### Start a task

```shell
curl -X POST http://localhost:8000/api/tasks/1/start/
```

#### Get statistics

```shell
curl http://localhost:8000/api/tasks/statistics/
```

Response:

```json
{
  "total": 10,
  "pending": 3,
  "in_progress": 4,
  "completed": 2,
  "cancelled": 1
}
```

#### Filter tasks

```shell
# By status
curl "http://localhost:8000/api/tasks/?status=COMPLETED"

# Search
curl "http://localhost:8000/api/tasks/?search=documentation"

# Overdue tasks only
curl "http://localhost:8000/api/tasks/?overdue=true"

# Order by priority
curl "http://localhost:8000/api/tasks/?ordering=-priority"
```

## Using Docker

### Docker Compose (Recommended)

Start all services (Django, PostgreSQL, Redis):

```shell
docker-compose up
```

The application will be available at [http://localhost:8000](http://localhost:8000)

Run migrations in Docker:

```shell
docker-compose exec web python src/manage.py migrate
```

Create superuser in Docker:

```shell
docker-compose exec web python src/manage.py createsuperuser
```

### Docker Only

Build production image:

```shell
docker build --target production -t django-app:latest .
```

Build development image:

```shell
docker build --target development -t django-app:dev .
```

## Common Django Commands

### Database Operations

```shell
# Create migrations for model changes
python src/manage.py makemigrations

# Apply migrations
python src/manage.py migrate

# Show migration status
python src/manage.py showmigrations

# Create a new app
python src/manage.py startapp myapp
```

### Data Management

```shell
# Create superuser
python src/manage.py createsuperuser

# Load initial data
python src/manage.py loaddata initial_data.json

# Export data
python src/manage.py dumpdata apps.core --indent 2 > data.json

# Open Django shell
python src/manage.py shell
```

### Development

```shell
# Run development server
python src/manage.py runserver

# Run on different port
python src/manage.py runserver 8080

# Run on all interfaces
python src/manage.py runserver 0.0.0.0:8000

# Collect static files
python src/manage.py collectstatic

# Run system checks
python src/manage.py check
```

## Testing

### Run All Tests

```shell
uv run pytest
```

### Run with Coverage

```shell
uv run pytest --cov=src --cov-report=term-missing
```

### Run Specific Tests

```shell
# Test a specific file
uv run pytest tests/apps/core/test_models.py

# Test a specific class
uv run pytest tests/apps/core/test_models.py::TestTaskModel

# Test a specific function
uv run pytest tests/apps/core/test_models.py::TestTaskModel::test_create_task
```

### Run in Watch Mode

```shell
uv run pytest-watch
```

## Code Quality

### Linting

```shell
# Check for issues
uv run ruff check .

# Auto-fix issues
uv run ruff check --fix .
```

### Formatting

```shell
# Format code
uv run black .

# Check formatting
uv run black --check .
```

### Type Checking

```shell
uv run mypy src
```

### Run All Checks

```shell
uv run ruff check . && \
uv run black --check . && \
uv run mypy src && \
uv run pytest --cov=src
```

## Project Structure

```shell
python-uv-django/
├── src/                           # Application source code
│   ├── manage.py                  # Django management script
│   ├── config/                    # Project configuration
│   │   ├── settings/              # Settings split by environment
│   │   │   ├── base.py           # Shared settings
│   │   │   ├── development.py    # Dev settings
│   │   │   └── production.py     # Prod settings
│   │   ├── urls.py               # Root URL configuration
│   │   ├── wsgi.py               # WSGI application
│   │   └── asgi.py               # ASGI application
│   ├── apps/                      # Django applications
│   │   ├── core/                  # Core app with Task model
│   │   │   ├── models.py         # Database models
│   │   │   ├── views.py          # View functions/classes
│   │   │   ├── urls.py           # URL patterns
│   │   │   ├── admin.py          # Admin configuration
│   │   │   ├── serializers.py    # DRF serializers
│   │   │   └── migrations/       # Database migrations
│   │   └── api/                   # API app
│   │       ├── views.py          # API ViewSets
│   │       └── urls.py           # API URL configuration
│   └── utils/                     # Utility modules
│       └── logger.py             # Django-aware logging
├── tests/                         # Test suite
│   ├── conftest.py               # Pytest fixtures
│   ├── apps/                      # App-specific tests
│   │   ├── core/                 # Core app tests
│   │   └── api/                  # API tests
│   └── config/                    # Configuration tests
├── .env.example                   # Environment variables template
├── docker-compose.yml             # Multi-service Docker setup
├── Dockerfile                     # Multi-stage Docker build
└── pyproject.toml                # Project configuration
```

## Best Practices

### DO

1. **Use migrations for all model changes**

   ```shell
   python src/manage.py makemigrations
   python src/manage.py migrate
   ```

2. **Keep secrets in environment variables**

   ```python
   SECRET_KEY = os.getenv("SECRET_KEY")
   ```

3. **Use Django's built-in security features**
   - CSRF protection (enabled by default)
   - SQL injection protection (use ORM)
   - XSS protection (template auto-escaping)

4. **Write tests for your code**

   ```python
   @pytest.mark.django_db
   def test_task_creation(task_factory):
       task = task_factory(title="Test")
       assert task.title == "Test"
   ```

5. **Use Django's timezone-aware datetime**

   ```python
   from django.utils import timezone
   task.completed_at = timezone.now()
   ```

### DON'T

1. **Don't commit sensitive data**
   - Keep `.env` out of version control
   - Use `.env.example` as template

2. **Don't run with DEBUG=True in production**

   ```python
   # production.py
   DEBUG = False
   ```

3. **Don't use raw SQL without good reason**

   ```python
   # Avoid
   cursor.execute("SELECT * FROM tasks")

   # Prefer
   Task.objects.all()
   ```

4. **Don't forget to set ALLOWED_HOSTS in production**

   ```python
   ALLOWED_HOSTS = ['example.com', 'www.example.com']
   ```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | (required) | Django secret key for cryptographic signing |
| `DEBUG` | `True` | Enable/disable debug mode |
| `DATABASE_URL` | `sqlite:///db.sqlite3` | Database connection string |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated list of allowed hosts |
| `LOG_LEVEL` | `INFO` | Logging verbosity level |
| `CORS_ALLOWED_ORIGINS` | `` | Comma-separated CORS origins |
| `EMAIL_HOST` | `` | SMTP server hostname |
| `EMAIL_PORT` | `587` | SMTP server port |
| `REDIS_URL` | `` | Redis connection URL (optional) |

## Troubleshooting

### "ModuleNotFoundError: No module named 'django'"

**Cause**: Virtual environment not activated or dependencies not installed

**Fix**:

```shell
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv pip install -e ".[dev]"
```

### "OperationalError: no such table"

**Cause**: Migrations not applied

**Fix**:

```shell
python src/manage.py migrate
```

### "CSRF token missing or incorrect"

**Cause**: CSRF protection blocking POST request

**Fix**: For API requests, use Django's CSRF exemption or include CSRF token. For testing:

```shell
# Include CSRF token in cookie
curl -X POST http://localhost:8000/api/tasks/ \
  -H "X-CSRFToken: your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task"}'
```

### Port 8000 already in use

**Cause**: Another process using port 8000

**Fix**:

```shell
# Run on different port
python src/manage.py runserver 8001

# Or find and kill the process
# On Linux/Mac
lsof -ti:8000 | xargs kill -9

# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## Next Steps

1. **Customize the Task model**
   - Edit [`src/apps/core/models.py`](python-uv-django/src/apps/core/models.py)
   - Run `makemigrations` and `migrate`

2. **Add your own apps**

   ```shell
   cd src
   python manage.py startapp myapp
   ```

3. **Explore Django admin**
   - Customize `admin.py` files
   - Add filters, search fields, actions

4. **Build your API**
   - Create serializers in `serializers.py`
   - Define ViewSets in `views.py`
   - Register routes in `urls.py`

5. **Deploy to production**
   - See main [`README.md`](python-uv-django/README.md) for deployment guide

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [uv Package Manager](https://github.com/astral-sh/uv)
- [Django Best Practices](https://django-best-practices.readthedocs.io/)

## Summary

You now have a complete Django project with:

- **Django 6.0+**: Latest stable version
- **REST API**: Fully functional with Django REST Framework
- **Database**: PostgreSQL support with SQLite for development
- **Testing**: Comprehensive test suite with pytest
- **Docker**: Multi-service setup with PostgreSQL and Redis
- **Code Quality**: Linting, formatting, type checking
- **CI/CD**: GitHub Actions workflow

Follow the best practices outlined to build secure, maintainable Django applications. Happy coding!
