"""Development settings for Django project."""

from .base import *  # noqa: F403

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allow all hosts in development
ALLOWED_HOSTS = ["*"]

# Development-specific installed apps
# INSTALLED_APPS += [  # noqa: F405
#     "django_extensions",  # Optional: uncomment if you want django-extensions
# ]

# Database - SQLite for development (can be overridden with DATABASE_URL env var)
if "DATABASE_URL" not in os.environ:  # noqa: F405
    DATABASES = {  # noqa: F405
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",  # noqa: F405
        }
    }

# CORS - Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Email backend for development (prints to console)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Django Debug Toolbar (optional - uncomment to enable)
# INSTALLED_APPS += ["debug_toolbar"]
# MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")
# INTERNAL_IPS = ["127.0.0.1", "localhost"]

# Disable whitenoise compression in development for faster reloads
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

# More verbose logging in development
LOGGING["root"]["level"] = "DEBUG"  # noqa: F405
LOGGING["loggers"]["django"]["level"] = "DEBUG"  # noqa: F405
LOGGING["loggers"]["apps"]["level"] = "DEBUG"  # noqa: F405
