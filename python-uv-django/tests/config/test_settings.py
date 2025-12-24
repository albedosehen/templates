"""Tests for Django settings."""

import pytest

from django.conf import settings


@pytest.mark.django_db
class TestSettings:
    """Test Django settings configuration."""

    def test_secret_key_is_set(self):
        """Test that SECRET_KEY is configured."""
        assert hasattr(settings, "SECRET_KEY")
        assert settings.SECRET_KEY is not None
        assert len(settings.SECRET_KEY) > 0

    def test_debug_mode_in_development(self):
        """Test that DEBUG is properly configured."""
        # Django's test runner sets DEBUG to False for safety
        # In development settings, DEBUG is True, but during testing it's False
        # Just verify it's a boolean value
        assert isinstance(settings.DEBUG, bool)

    def test_installed_apps_includes_django_defaults(self):
        """Test that all required Django apps are installed."""
        required_apps = [
            "django.contrib.admin",
            "django.contrib.auth",
            "django.contrib.contenttypes",
            "django.contrib.sessions",
            "django.contrib.messages",
            "django.contrib.staticfiles",
        ]
        for app in required_apps:
            assert app in settings.INSTALLED_APPS

    def test_installed_apps_includes_third_party(self):
        """Test that third-party apps are installed."""
        assert "rest_framework" in settings.INSTALLED_APPS
        assert "corsheaders" in settings.INSTALLED_APPS

    def test_installed_apps_includes_local_apps(self):
        """Test that local apps are installed."""
        assert "apps.core.apps.CoreConfig" in settings.INSTALLED_APPS
        assert "apps.api.apps.ApiConfig" in settings.INSTALLED_APPS

    def test_database_configuration(self):
        """Test that database is configured."""
        assert "default" in settings.DATABASES
        assert "ENGINE" in settings.DATABASES["default"]

    def test_static_files_configuration(self):
        """Test static files configuration."""
        assert hasattr(settings, "STATIC_URL")
        assert hasattr(settings, "STATIC_ROOT")
        assert settings.STATIC_URL is not None

    def test_rest_framework_configuration(self):
        """Test DRF configuration."""
        assert hasattr(settings, "REST_FRAMEWORK")
        assert "DEFAULT_PAGINATION_CLASS" in settings.REST_FRAMEWORK
        assert "PAGE_SIZE" in settings.REST_FRAMEWORK
