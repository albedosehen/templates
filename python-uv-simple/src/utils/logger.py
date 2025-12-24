"""Logging utility module."""

import logging
import sys

from src.config import config


class Logger:
    """Simple logger wrapper around Python's logging module.

    Provides a consistent interface for logging throughout the application.
    Automatically configures log level based on application configuration.
    """

    def __init__(self, name: str, level: str | None = None) -> None:
        """Initialize the logger.

        Args:
            name: Logger name, typically __name__ of the calling module
            level: Optional log level override, defaults to config.log_level
        """
        self._logger = logging.getLogger(name)
        log_level = level or config.log_level
        self._logger.setLevel(getattr(logging, log_level))

        # Configure handler if not already configured
        if not self._logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S',
            )
            handler.setFormatter(formatter)
            self._logger.addHandler(handler)

    def debug(self, message: str) -> None:
        """Log a debug message.

        Args:
            message: The message to log
        """
        self._logger.debug(message)

    def info(self, message: str) -> None:
        """Log an info message.

        Args:
            message: The message to log
        """
        self._logger.info(message)

    def warning(self, message: str) -> None:
        """Log a warning message.

        Args:
            message: The message to log
        """
        self._logger.warning(message)

    def error(self, message: str) -> None:
        """Log an error message.

        Args:
            message: The message to log
        """
        self._logger.error(message)

    def critical(self, message: str) -> None:
        """Log a critical message.

        Args:
            message: The message to log
        """
        self._logger.critical(message)
