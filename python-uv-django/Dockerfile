# Base
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app


# Build: Base
FROM base AS builder

RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

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

COPY pyproject.toml README.md ./
COPY src/ ./src/

RUN uv venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN uv pip install -e .


# Build: Production
FROM base AS production

RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY src/ ./src/

RUN mkdir -p staticfiles media logs

RUN python src/manage.py collectstatic --noinput --settings=config.settings.production || true

RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--chdir", "src", "config.wsgi:application"]


# Build: Development
FROM builder AS development

RUN uv pip install -e ".[dev]"

COPY . .

RUN mkdir -p staticfiles media logs

EXPOSE 8000

CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
