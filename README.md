# Project Templates

A curated collection of production-ready project templates for TypeScript and Python applications. Each template includes modern tooling, comprehensive testing, Docker support, and CI/CD pipelines.

## Available Templates

### TypeScript Templates

#### [typescript-node-simple](typescript-node-simple/)
**Basic TypeScript/Node.js Project**

A foundational template for TypeScript/Node.js applications with essential tooling and best practices.

**Key Features:**
- Node.js 20 LTS with TypeScript
- Jest for testing
- ESLint + Prettier for code quality
- Docker support with multi-stage builds
- GitHub Actions CI/CD

**When to Use:**
- Starting a new Node.js application
- Building CLI tools or libraries
- Need a clean, minimal TypeScript setup

---

#### [typescript-node-azfunc-v4](typescript-node-azfunc-v4/)
**Azure Functions v4 Project**

A template for serverless Azure Functions using the v4 programming model with TypeScript.

**Key Features:**
- Azure Functions v4 programming model
- HTTP triggers with routing
- All features from typescript-node-simple
- Azure Functions Core Tools integration
- Production-ready configuration

**When to Use:**
- Building serverless APIs
- Event-driven microservices
- Azure cloud-native applications
- Need serverless compute on Azure

---

#### [typescript-node-azfunc-v4-durable](typescript-node-azfunc-v4-durable/)
**Azure Functions v4 with Durable Functions**

An advanced template featuring Azure Durable Functions for complex, stateful serverless workflows.

**Key Features:**
- Durable Functions orchestration patterns
- Function chaining and fan-out/fan-in
- Human interaction pattern examples
- Activity functions and orchestrators
- Comprehensive testing for orchestrations
- All features from typescript-node-azfunc-v4

**When to Use:**
- Complex, long-running workflows
- Stateful serverless applications
- Multi-step business processes
- Saga pattern implementations
- Need reliability with automatic retries

---

### Python Templates

#### [python-uv-simple](python-uv-simple/)
**Modern Python Project with uv**

A modern Python 3.12 template using [uv](https://github.com/astral-sh/uv) for blazingly fast package management.

**Key Features:**
- Python 3.12 with modern type hints
- uv for ultra-fast dependency management
- pytest with coverage reporting
- ruff (linting) + black (formatting) + mypy (type checking)
- Docker support with multi-stage builds
- GitHub Actions CI/CD

**When to Use:**
- Starting a new Python application
- Building CLI tools or libraries
- Need modern Python development setup
- Want fast dependency management

---

#### [python-uv-django](python-uv-django/)
**Django 5.0+ Web Framework**

A comprehensive Django 5.0+ template with REST API support, PostgreSQL, and Redis integration.

**Key Features:**
- Django 5.0+ with Django REST Framework
- PostgreSQL and Redis support
- Environment-based settings (dev/prod)
- Task management API with full CRUD
- pytest-django with factory-boy
- All code quality tools from python-uv-simple
- Docker Compose with PostgreSQL + Redis
- QUICKSTART.md guide included

**When to Use:**
- Building web applications and APIs
- Need database-backed applications
- RESTful API services
- Admin interfaces required
- Complex web projects with ORM

---

## Template Progression

### TypeScript Track

```
typescript-node-simple
    ↓
    Basic Node.js app with TypeScript, testing, and Docker
    
typescript-node-azfunc-v4
    ↓
    + Azure Functions v4 runtime
    + Serverless HTTP triggers
    + Azure cloud integration
    
typescript-node-azfunc-v4-durable
    ↓
    + Durable Functions framework
    + Orchestration patterns
    + Stateful workflows
```

### Python Track

```
python-uv-simple
    ↓
    Modern Python app with uv, testing, and Docker
    
python-uv-django
    ↓
    + Django 5.0+ web framework
    + Django REST Framework
    + PostgreSQL + Redis
    + Multi-app architecture
```

---

## Comparison Table

| Template | Language | Complexity | Docker | Database | Key Use Case |
|----------|----------|------------|--------|----------|--------------|
| **typescript-node-simple** | TypeScript | ⭐ Basic | ✅ | ❌ | CLI tools, libraries, basic apps |
| **typescript-node-azfunc-v4** | TypeScript | ⭐⭐ Intermediate | ✅ | ❌ | Serverless APIs, webhooks |
| **typescript-node-azfunc-v4-durable** | TypeScript | ⭐⭐⭐ Advanced | ✅ | ❌ | Workflows, orchestrations, sagas |
| **python-uv-simple** | Python | ⭐ Basic | ✅ | ❌ | CLI tools, libraries, basic apps |
| **python-uv-django** | Python | ⭐⭐⭐ Advanced | ✅ | ✅ PostgreSQL + Redis | Web apps, REST APIs, admin interfaces |

---

## Prerequisites

### TypeScript Templates
- Node.js 20 LTS
- npm or yarn
- Docker (optional)
- Azure Functions Core Tools (for Azure Functions templates)

### Python Templates
- Python 3.12 or higher
- [uv](https://github.com/astral-sh/uv) package manager
- Docker (optional)
- PostgreSQL (optional, for Django template)

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

- 📝 **Comprehensive README** - Detailed documentation for each template
- 🧪 **Testing Setup** - Jest (TypeScript) or pytest (Python) with examples
- 🔍 **Code Quality** - Linting, formatting, and type checking
- 🐳 **Docker Support** - Multi-stage Dockerfiles for dev and production
- 🔄 **CI/CD Pipeline** - GitHub Actions workflows
- 📁 **Project Structure** - Organized, scalable architecture
- 🛠️ **Development Tools** - Hot reloading, debugging support

---

## Template Details

### TypeScript Templates

All TypeScript templates share:
- **Language**: TypeScript with strict type checking
- **Testing**: Jest with coverage reporting
- **Code Quality**: ESLint + Prettier
- **Package Manager**: npm
- **Docker**: Multi-stage builds (development + production)
- **CI/CD**: GitHub Actions

### Python Templates

All Python templates share:
- **Language**: Python 3.12 with type hints
- **Package Manager**: uv (ultra-fast)
- **Testing**: pytest with coverage
- **Code Quality**: ruff (linting) + black (formatting) + mypy (type checking)
- **Docker**: Multi-stage builds (development + production)
- **CI/CD**: GitHub Actions

---

## Quick Start by Use Case

**Building a REST API?**
- TypeScript: Consider [`typescript-node-azfunc-v4`](typescript-node-azfunc-v4/) for serverless
- Python: Choose [`python-uv-django`](python-uv-django/) for full-featured web framework

**Need a CLI tool?**
- TypeScript: Use [`typescript-node-simple`](typescript-node-simple/)
- Python: Use [`python-uv-simple`](python-uv-simple/)

**Complex workflows with state?**
- TypeScript: Use [`typescript-node-azfunc-v4-durable`](typescript-node-azfunc-v4-durable/)

**Building a web app with admin panel?**
- Python: Use [`python-uv-django`](python-uv-django/)

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

[Your License Here]

## Support

For issues, questions, or suggestions, please open an issue in the GitHub repository.

---

**Built with ❤️ for developers who value quality and productivity**
