"""Tests for the configuration module."""

import os
from unittest.mock import patch

import pytest

from src.config import AppConfig


class TestAppConfig:
    """Test suite for AppConfig class."""

    def test_from_env_with_defaults(self) -> None:
        """Test configuration loading with default values."""
        with patch.dict(os.environ, {}, clear=True):
            config = AppConfig.from_env()

            assert config.environment == 'development'
            assert config.debug is True
            assert config.log_level == 'INFO'
            assert config.app_name == 'python-uv-simple'
            assert config.version == '0.1.0'

    def test_from_env_with_custom_values(self) -> None:
        """Test configuration loading with custom environment variables."""
        env_vars = {
            'ENVIRONMENT': 'production',
            'DEBUG': 'false',
            'LOG_LEVEL': 'WARNING',
            'APP_NAME': 'custom-app',
            'APP_VERSION': '1.0.0',
        }

        with patch.dict(os.environ, env_vars, clear=True):
            config = AppConfig.from_env()

            assert config.environment == 'production'
            assert config.debug is False
            assert config.log_level == 'WARNING'
            assert config.app_name == 'custom-app'
            assert config.version == '1.0.0'

    def test_from_env_with_invalid_environment(self) -> None:
        """Test configuration defaults to 'development' for invalid environment."""
        with patch.dict(os.environ, {'ENVIRONMENT': 'invalid'}, clear=True):
            config = AppConfig.from_env()
            assert config.environment == 'development'

    def test_from_env_with_invalid_log_level(self) -> None:
        """Test configuration defaults to 'INFO' for invalid log level."""
        with patch.dict(os.environ, {'LOG_LEVEL': 'INVALID'}, clear=True):
            config = AppConfig.from_env()
            assert config.log_level == 'INFO'

    @pytest.mark.parametrize(
        'debug_value,expected',
        [
            ('true', True),
            ('True', True),
            ('1', True),
            ('yes', True),
            ('false', False),
            ('False', False),
            ('0', False),
            ('no', False),
        ],
    )
    def test_debug_parsing(self, debug_value: str, expected: bool) -> None:
        """Test various debug value formats are parsed correctly."""
        with patch.dict(os.environ, {'DEBUG': debug_value}, clear=True):
            config = AppConfig.from_env()
            assert config.debug is expected

    def test_config_is_frozen(self) -> None:
        """Test that AppConfig is immutable (frozen dataclass)."""
        config = AppConfig.from_env()

        with pytest.raises(AttributeError):
            config.environment = 'staging'  # type: ignore[misc]
