# Project Templates

A finely crafted collection of professionally opinionated templates for various programming languages and frameworks. Each template includes modern tooling, comprehensive testing, Docker support, and CI/CD pipelines.

These templates aim to provide a solid foundation for new projects, ensuring best practices and developer productivity from the start.

## Available Templates

### NodeJS Templates

- [typescript-node-simple](typescript-node-simple/)
- [typescript-node-azfunc-v4](typescript-node-azfunc-v4/)
- [typescript-node-azfunc-v4-durable](typescript-node-azfunc-v4-durable/)

#### [Basic TypeScript/Node.js Project](typescript-node-simple/)

A foundational template for TypeScript/Node.js applications with essential tooling and best practices. You can easily add dependencies and expand upon this base for various project needs.

**Features:**

- Node.js 24 LTS with TypeScript
- Jest for testing
- ESLint + Prettier for code quality
- Docker support with multi-stage builds
- GitHub Actions CI/CD

**Usage:**

- Starting a new Node.js application
- Building CLI tools or libraries
- Need a clean, minimal TypeScript setup

---

#### [Azure Functions v4 Project](typescript-node-azfunc-v4/)

This template builds upon the `typescript-node-simple` template for serverless Azure Functions using the `v4` programming model with TypeScript.

**Features:**

- Everything from `typescript-node-simple`
- Azure Functions v4
- Azure Functions Core Tools integration
- Example HTTP triggers with routing
- Production-ready configuration

**Usage:**

- Building serverless APIs (REST, GraphQL, etc.)
- Event-driven microservices (queues, triggers, timers, etc.)
- Azure cloud-native applications
- Webhooks and Azure integrations

---

#### [Azure Functions v4 with Durable Functions](typescript-node-azfunc-v4-durable/)

An advanced template featuring Azure Durable Functions for complex, stateful serverless workflows. This builds upon the `typescript-node-azfunc-v4` template with added support and configuration for Durable Functions and features a concrete implementation to build upon.

**Features:**

- All features from `typescript-node-azfunc-v4`
- Durable Functions orchestration patterns
- Function chaining and fan-out/fan-in
- Human interaction pattern examples
- Activity functions and orchestrators
- Comprehensive testing for orchestrations

**Usage:**

- Complex, long-running workflows
- Stateful serverless applications
- Multi-step business processes (approval flows, data processing pipelines)
- Saga pattern implementations (distributed transactions)
- Need reliability with automatic retries and state management

---

### Python Templates

- [python-uv-simple](python-uv-simple/)
- [python-uv-django](python-uv-django/)

#### [Basic Python Project](python-uv-simple/)

This is a modern, minimal Python template designed for building applications and libraries with best practices in mind. It uses [uv](https://github.com/astral-sh/uv) for fast dependency management and targets Python `3.12`.

**Features:**

- Python `3.12` with modern type hints
- `uv` for ultra-fast dependency management
- `pytest` with coverage reporting
- `ruff` (linting) + `black` (formatting) + `mypy` (type checking)
- Docker support with multi-stage builds
- GitHub Actions CI/CD

**Usage:**

- Starting a new Python application
- Building CLI tools or libraries
- Need modern Python development setup
- Want fast dependency management

---

#### [Django 6.0+ Web Framework](python-uv-django/)

A comprehensive [Django 6.0+](https://docs.djangoproject.com/en/6.0/releases/6.0/) template with REST API support, PostgreSQL, and Redis integration. This template is ideal for building robust web applications and APIs with Django. Supports earlier versions from Django `5.0+` onwards.

**Features:**

- `uv` for ultra-fast dependency management
- `pytest` with coverage reporting
- `ruff` (linting) + `black` (formatting) + `mypy` (type checking)
- `pytest-django` with `factory-boy` for testing
- Django `6.0+` with Django REST Framework
- PostgreSQL and Redis support
- Environment-based settings (dev/prod)
- Task management API with full CRUD
- Docker Compose with PostgreSQL + Redis
- QUICKSTART.md guide included

**Usage:**

- Building web applications and APIs
- Need database-backed applications
- RESTful API services
- Admin interfaces required
- Complex web projects with ORM

---

## Prerequisites

### NodeJS TypeScript Template Requirements

- Node.js 24 LTS
- npm
- Docker (optional)
- Azure Functions Core Tools (for Azure Functions templates)

### Python Template Requirements

- Python 3.12 or higher
- [uv](https://github.com/astral-sh/uv) package manager
- Docker (optional)

### Installing uv (Python Templates)

```bash
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

## Usage

### Option 1: Clone and Copy Template

```bash
# Clone the repository
git clone https://github.com/albedosehen/templates.git
cd templates

# Copy the template you want
cp -r <TEMPLATE_NAME> ../my-project

# Navigate to your new project
cd ../my-project

# For TypeScript templates
npm install
npm start

# For Python templates
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"
```

### Option 2: Download Specific Template with tiged

Install tiged (if not already installed):

```bash
npm install -g tiged@latest
```

Download a specific template:

```bash
# Download template
npx tiged albedosehen/templates/<TEMPLATE_NAME> my-project

cd my-project

# For TypeScript templates
npm install
npm start

# For Python templates
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"
```

### Examples

**TypeScript - Azure Functions:**

```bash
npx tiged albedosehen/templates/typescript-node-azfunc-v4 my-api
cd my-api
npm install
npm start
```

**Python - Django:**

```bash
npx tiged albedosehen/templates/python-uv-django my-webapp
cd my-webapp
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
cp .env.example .env
python src/manage.py migrate
python src/manage.py runserver
```

---

## What's Included

All templates include:

- **Comprehensive README** - Detailed documentation for each template
- **Testing Setup** - Jest (TypeScript) or pytest (Python) with examples
- **Code Quality** - Linting, formatting, and type checking
- **Docker Support** - Multi-stage Dockerfiles for dev and production
- **CI/CD Pipeline** - GitHub Actions workflows
- **Project Structure** - Organized, scalable architecture
- **Development Tools** - Hot reloading, debugging support

---

## Contributing

Contributions are welcome! If you'd like to add a new template or improve existing ones:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-template`)
3. Follow the existing template structure and standards
4. Add comprehensive documentation
5. Include tests and CI/CD configuration
6. Commit your changes (`git commit -m 'Add new template'`)
7. Push to the branch (`git push origin feature/new-template`)
8. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please open an issue in the GitHub repository.

---

If you find any of these templates useful, please consider starring the repository to show your support! ⭐
