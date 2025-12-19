# TypeScript/Node.js Project Templates

## About

This repository contains TypeScript/Node.js project templates for quick project setup.

## Templates

- **typescript-node-simple** - Basic TypeScript/Node.js project
- **typescript-node-azfunc-v4** - Azure Functions v4 project
- **typescript-node-azfunc-v4-durable** - Azure Functions v4 with Durable Functions

### Prerequisites

- Node.js 20 LTS
- Git (for cloning the repository)
- Azure Functions Core Tools (for Azure Functions templates)
- tiged (optional, for downloading specific templates)

## Usage

### Option 1: Clone the repository and copy the template

```bash
git clone https://github.com/albedosehen/templates.git
copy templates/typescript-node-azfunc-v4 my-project

cd my-project
npm install
npm run start
```

Continue development in `my-project` folder.

### Option 2: Download a specific template with tiged

Install tiged if you haven't already

```bash
npm i -g tiged@latest
```

Create a new project from a template

```bash
npx tiged albedosehen/templates/<TEMPLATE_NAME> my-project

cd my-project
npm i
npm start
```

Replace `<TEMPLATE_NAME>` with the actual template name you want to use.

e.g.

```bash
npx tiged albedosehen/templates/typescript-node-azfunc-v4 azure-function-app

cd azure-function-app
npm i
npm start
```

Cotinue development in `azure-function-app` folder.
