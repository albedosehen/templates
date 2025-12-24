"""Django-aware logging utility module."""

import logging
import sys
from typing import Any

import django
from django.conf import settings


class DjangoLogger:
    """Django-aware logger wrapper.

    Provides a consistent interface for logging throughout the Django application.
    Automatically configures log level based on Django settings and provides
    context-aware logging with request tracking capabilities.
    """

    def __init__(self, name: str, level: str | None = None) -> None:
        """Initialize the Django logger.

        Args:
            name: Logger name, typically __name__ of the calling module
            level: Optional log level override, defaults to settings.LOG_LEVEL
        """
        self._logger = logging.getLogger(name)

        # Get log level from Django settings if available
        try:
            if django.conf.settings.configured:
                log_level = level or getattr(settings, "LOG_LEVEL", "INFO")
            else:
                log_level = level or "INFO"
        except Exception:
            log_level = level or "INFO"

        self._logger.setLevel(getattr(logging, log_level))

        # Configure handler if not already configured
        if not self._logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
            handler.setFormatter(formatter)
            self._logger.addHandler(handler)

    def debug(self, message: str, **kwargs: Any) -> None:
        """Log a debug message.

        Args:
            message: The message to log
            **kwargs: Additional context to include
        """
        self._logger.debug(message, extra=kwargs)

    def info(self, message: str, **kwargs: Any) -> None:
        """Log an info message.

        Args:
            message: The message to log
            **kwargs: Additional context to include
        """
        self._logger.info(message, extra=kwargs)

    def warning(self, message: str, **kwargs: Any) -> None:
        """Log a warning message.

        Args:
            message: The message to log
            **kwargs: Additional context to include
        """
        self._logger.warning(message, extra=kwargs)

    def error(self, message: str, exc_info: bool = False, **kwargs: Any) -> None:
        """Log an error message.

        Args:
            message: The message to log
            exc_info: Include exception information
            **kwargs: Additional context to include
        """
        self._logger.error(message, exc_info=exc_info, extra=kwargs)

    def critical(self, message: str, exc_info: bool = False, **kwargs: Any) -> None:
        """Log a critical message.

        Args:
            message: The message to log
            exc_info: Include exception information
            **kwargs: Additional context to include
        """
        self._logger.critical(message, exc_info=exc_info, extra=kwargs)

    def exception(self, message: str, **kwargs: Any) -> None:
        """Log an exception with traceback.

        Args:
            message: The message to log
            **kwargs: Additional context to include
        """
        self._logger.exception(message, extra=kwargs)


def get_logger(name: str) -> DjangoLogger:
    """Get a logger instance.

    Args:
        name: Logger name, typically __name__

    Returns:
        DjangoLogger instance
    """
    return DjangoLogger(name)
