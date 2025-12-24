"""Type definitions and protocols for the application."""

from typing import Any, Protocol, TypeAlias

# Type aliases for common types
JSON = dict[str, Any]
Headers = dict[str, str]
QueryParams = dict[str, str | list[str]]


class Loggable(Protocol):
    """Protocol for objects that support logging operations."""

    def info(self, message: str) -> None:
        """Log an info message."""
        ...

    def error(self, message: str) -> None:
        """Log an error message."""
        ...

    def warning(self, message: str) -> None:
        """Log a warning message."""
        ...

    def debug(self, message: str) -> None:
        """Log a debug message."""
        ...


# Export commonly used types
__all__ = [
    "JSON",
    "Headers",
    "QueryParams",
    "Loggable",
]
