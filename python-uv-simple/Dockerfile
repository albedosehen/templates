# Secure Dockerfile using Multi-Stage builds and Non-Root User

# Base
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_SYSTEM_PYTHON=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd -r appuser && \
    useradd -r -g appuser -u 1000 -m -s /bin/bash appuser

WORKDIR /app


# Build: Base
FROM base AS builder

# Install uv from a pinned version with checksum verification for supply-chain security
# Version pinned to 0.5.11 - update version and checksum when upgrading
ARG UV_VERSION=0.5.11
ARG UV_CHECKSUM=a8a357925e7f0e2d137eeff28c42e7f24e8f8f79d4e5c9dbfac4b7d85c8c6c6e
RUN curl -LsSf "https://github.com/astral-sh/uv/releases/download/${UV_VERSION}/uv-x86_64-unknown-linux-gnu.tar.gz" -o uv.tar.gz && \
    echo "${UV_CHECKSUM}  uv.tar.gz" | sha256sum -c - && \
    tar -xzf uv.tar.gz && \
    mv uv-x86_64-unknown-linux-gnu/uv /usr/local/bin/ && \
    mv uv-x86_64-unknown-linux-gnu/uvx /usr/local/bin/ && \
    rm -rf uv.tar.gz uv-x86_64-unknown-linux-gnu

COPY pyproject.toml .python-version README.md ./
COPY src/ ./src/

RUN uv venv /app/.venv && \
    . /app/.venv/bin/activate && \
    uv pip install -e .


# Build: Production
FROM base AS production

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/src /app/src

ENV PATH="/app/.venv/bin:$PATH" \
    ENVIRONMENT=production \
    DEBUG=false \
    LOG_LEVEL=INFO

RUN chown -R appuser:appuser /app

USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)"

CMD ["python", "-m", "src"]


# Build: Development
FROM builder AS development

RUN . /app/.venv/bin/activate && \
    uv pip install -e ".[dev]"

COPY tests/ ./tests/

ENV PATH="/app/.venv/bin:$PATH" \
    ENVIRONMENT=development \
    DEBUG=true \
    LOG_LEVEL=DEBUG

RUN chown -R appuser:appuser /app

USER appuser

CMD ["pytest-watch", "--", "-v"]
