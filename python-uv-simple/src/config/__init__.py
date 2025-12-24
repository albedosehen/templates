"""Configuration module for loading and managing application settings."""

import os
from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class AppConfig:
    """Application configuration loaded from environment variables.

    Attributes:
        environment: The deployment environment (development, staging, production)
        debug: Enable debug mode for detailed logging
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        app_name: Name of the application
        version: Application version
    """

    environment: Literal['development', 'staging', 'production']
    debug: bool
    log_level: Literal['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
    app_name: str
    version: str

    @classmethod
    def from_env(cls) -> 'AppConfig':
        """Create configuration from environment variables with defaults.

        Returns:
            AppConfig instance populated from environment variables
        """
        env = os.getenv('ENVIRONMENT', 'development')
        if env not in ('development', 'staging', 'production'):
            env = 'development'

        debug = os.getenv('DEBUG', 'true').lower() in ('true', '1', 'yes')

        log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
        if log_level not in ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'):
            log_level = 'INFO'

        return cls(
            environment=env,  # type: ignore[arg-type]
            debug=debug,
            log_level=log_level,  # type: ignore[arg-type]
            app_name=os.getenv('APP_NAME', 'python-uv-simple'),
            version=os.getenv('APP_VERSION', '0.1.0'),
        )


# Global configuration instance
config = AppConfig.from_env()
