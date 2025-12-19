# TypeScript/Node.js Project Templates

## About

This repository contains TypeScript/Node.js project templates for quick project setup.

## Templates

- **typescript-node-simple** - Basic TypeScript/Node.js project
- **typescript-node-azfunc-v4** - Azure Functions v4 project
- **typescript-node-azfunc-v4-durable** - Azure Functions v4 with Durable Functions

## Usage

### Option 1: Clone the entire repository

```bash
git clone <repository-url>
cd templates
```

Then copy the template directory you need.

### Option 2: Download a specific template with tiged

```bash
npx tiged albedosehen/templates/<TEMPLATE_NAME> my-project
cd my-project
npm install
```

Replace `<TEMPLATE_NAME>` with the actual template name you want to use.

e.g.

```bash
npx tiged albedosehen/templates/typescript-node-azfunc-v4 azure-function-app

cd azure-function-app
npm install
```
