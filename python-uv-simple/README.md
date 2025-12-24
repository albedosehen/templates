# Python UV Simple

A modern Python 3.12 template using [uv](https://github.com/astral-sh/uv) for blazingly fast package management. This template follows best practices for Python development with comprehensive tooling for linting, formatting, type checking, and testing.

## Features

- **Fast Package Management**: Uses uv for lightning-fast dependency resolution and installation
- **Modern Python**: Built for Python 3.12 with modern features and type hints
- **Testing**: Comprehensive test suite with pytest and coverage reporting
- **Code Quality**: Integrated linting (ruff), formatting (black), and type checking (mypy)
- **Docker Support**: Multi-stage Dockerfile for both development and production
- **CI/CD**: GitHub Actions workflow for automated testing and building
- **Clean Architecture**: Well-organized project structure with separation of concerns

## Prerequisites

- Python 3.12 or higher
- [uv](https://github.com/astral-sh/uv) package manager

### Installing uv

```bash
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd python-uv-simple
   ```

2. **Create a virtual environment and install dependencies**

   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -e ".[dev]"
   ```

3. **Run the application**

   ```bash
   uv run python -m src
   ```

## Available Commands

### Development

Run the application:

```bash
uv run python -m src
```

Or using the installed script:

```bash
uv run python-uv-simple
```

### Testing

Run all tests:

```bash
uv run pytest
```

Run tests with coverage:

```bash
uv run pytest --cov=src --cov-report=term-missing
```

Run tests in watch mode:

```bash
uv run pytest-watch
```

Run specific test file:

```bash
uv run pytest tests/config/test_config.py
```

### Code Quality

#### Linting with Ruff

Check for linting issues:

```bash
uv run ruff check .
```

Auto-fix linting issues:

```bash
uv run ruff check --fix .
```

#### Formatting with Black

Format code:

```bash
uv run black .
```

Check formatting without making changes:

```bash
uv run black --check .
```

#### Type Checking with Mypy

Run type checker:

```bash
uv run mypy src
```

### Run All Checks

Before committing, run all quality checks:

```bash
uv run ruff check . && \
uv run black --check . && \
uv run mypy src && \
uv run pytest --cov=src
```

## Docker Usage

### Using Docker Compose (Recommended)

**Development mode** (with hot reloading):

```bash
docker-compose up
```

Or explicitly:

```bash
BUILD_TARGET=development docker-compose up
```

**Production mode**:

```bash
BUILD_TARGET=production docker-compose up
```

### Using Docker Directly

**Build production image**:

```bash
docker build --target production -t python-uv-simple:latest .
```

**Build development image**:

```bash
docker build --target development -t python-uv-simple:dev .
```

**Run production container**:

```bash
docker run --rm python-uv-simple:latest
```

**Run development container**:

```bash
docker run --rm -v $(pwd)/src:/app/src python-uv-simple:dev
```

**Note**: The README.md file needs to exist for the [Dockerfile](./Dockerfile) COPY command and for [pyproject.toml](./pyproject.toml) readme reference to build successfully. You can adjust the files as needed to avoid the document requirement.

## Project Structure

```bash
python-uv-simple/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── src/
│   ├── __init__.py             # Package initialization
│   ├── __main__.py             # Entry point for python -m src
│   ├── config/
│   │   └── __init__.py         # Configuration management
│   ├── types/
│   │   └── __init__.py         # Type definitions and protocols
│   └── utils/
│       └── logger.py           # Logging utility
├── tests/
│   ├── __init__.py
│   └── config/
│       └── test_config.py      # Configuration tests
├── .dockerignore               # Docker ignore patterns
├── .gitignore                  # Git ignore patterns
├── .python-version             # Python version specification
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Multi-stage Docker build
├── pyproject.toml              # Project configuration and dependencies
└── README.md                   # This file
```

### Key Directories

- **`src/`**: Main application source code
  - **`config/`**: Configuration management and environment variables
  - **`types/`**: Type definitions, protocols, and type aliases
  - **`utils/`**: Utility functions and helper classes

- **`tests/`**: Test suite mirroring the src/ structure
  - Tests are organized to match the source code structure
  - Use pytest for all testing

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the project root:

```env
ENVIRONMENT=development          # Options: development, staging, production
DEBUG=true                       # Enable debug mode
LOG_LEVEL=DEBUG                  # Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
APP_NAME=python-uv-simple
APP_VERSION=0.1.0
```

### Configuration Options

| Variable | Default | Description |
| -------- | ---------- | ------------- |
| `ENVIRONMENT` | `development` | Deployment environment |
| `DEBUG` | `true` | Enable debug mode |
| `LOG_LEVEL` | `INFO` | Logging level |
| `APP_NAME` | `python-uv-simple` | Application name |
| `APP_VERSION` | `0.1.0` | Application version |

## Development Guidelines

### Code Style

- Follow PEP 8 style guide
- Use type hints throughout the codebase
- Maximum line length: 100 characters
- Use docstrings for all public modules, classes, and functions

### Type Hints

This project uses static type checking with mypy in strict mode. All functions should include type hints:

```python
def process_data(input_data: dict[str, Any]) -> list[str]:
    """Process input data and return results."""
    # Implementation
    return results
```

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

Example test:

```python
def test_config_loading() -> None:
    """Test that configuration loads correctly from environment."""
    # Arrange
    env_vars = {"ENVIRONMENT": "production"}
    
    # Act
    with patch.dict(os.environ, env_vars):
        config = AppConfig.from_env()
    
    # Assert
    assert config.environment == "production"
```

## CI/CD

The project includes a GitHub Actions workflow that runs on every push and pull request:

1. **Linting**: Checks code with ruff
2. **Formatting**: Verifies code formatting with black
3. **Type Checking**: Runs mypy in strict mode
4. **Testing**: Executes test suite with coverage reporting
5. **Docker Build**: Builds both production and development images

## Adding Dependencies

### Runtime Dependencies

Add to the `dependencies` list in `pyproject.toml`:

```toml
dependencies = [
    "requests>=2.31.0",
    "pydantic>=2.0.0",
]
```

Then install:

```bash
uv pip install -e .
```

### Development Dependencies

Add to the `dev` optional dependencies:

```toml
[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    # ... other dev dependencies
    "your-new-dev-dependency>=1.0.0",
]
```

Then install:

```bash
uv pip install -e ".[dev]"
```

## Troubleshooting

### uv command not found

Make sure uv is installed and in your PATH:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Import errors

Ensure you've activated the virtual environment:

```bash
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### Type checking errors

Run mypy with verbose output to see detailed errors:

```bash
uv run mypy --show-error-codes --pretty src
```

## License

[Your License Here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
