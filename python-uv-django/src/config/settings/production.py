"""Production settings for Django project."""

import os

from .base import *  # noqa: F403

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Allowed hosts - set via environment variable
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

# Security settings for production
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Database - use PostgreSQL in production (required via DATABASE_URL)
if "DATABASE_URL" not in os.environ:
    raise ValueError("DATABASE_URL environment variable must be set in production")

# Email configuration for production
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@example.com")

# CORS - Strict in production
CORS_ALLOW_ALL_ORIGINS = False
if not CORS_ALLOWED_ORIGINS:  # noqa: F405
    raise ValueError("CORS_ALLOWED_ORIGINS must be configured in production")

# Logging - Less verbose in production
LOGGING["root"]["level"] = "WARNING"  # noqa: F405  # type: ignore[index]
LOGGING["loggers"]["django"]["level"] = "WARNING"  # noqa: F405  # type: ignore[index]
LOGGING["loggers"]["apps"]["level"] = "INFO"  # noqa: F405  # type: ignore[index]

# Add file-based logging in production
LOGGING["handlers"]["file"] = {  # noqa: F405  # type: ignore[index]
    "class": "logging.handlers.RotatingFileHandler",
    "filename": BASE_DIR / "logs" / "django.log",  # noqa: F405
    "maxBytes": 1024 * 1024 * 15,  # 15MB
    "backupCount": 10,
    "formatter": "verbose",
}

LOGGING["root"]["handlers"].append("file")  # noqa: F405  # type: ignore[index]
LOGGING["loggers"]["django"]["handlers"].append("file")  # noqa: F405  # type: ignore[index]
LOGGING["loggers"]["apps"]["handlers"].append("file")  # noqa: F405  # type: ignore[index]
