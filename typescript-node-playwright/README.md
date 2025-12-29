# TypeScript Node.js Playwright Web Scraper Template

A production-ready TypeScript template for web scraping using Playwright. This template demonstrates how to scrape data from websites and save it as structured JSON files.

## Directory Structure

```shell
typescript-node-playwright/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/
│   │   └── index.ts          # Configuration settings
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── utils/
│       ├── logger.ts         # Logging utility
│       └── scraper.ts        # Playwright scraping logic
├── tests/
│   ├── README.md             # Testing documentation
│   ├── config/
│   │   └── index.test.ts     # Config tests
│   └── utils/
│       └── scraper.test.ts   # Scraper tests with mocks
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD pipeline
├── data/                     # Output directory (gitignored)
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # Docker Compose configuration
└── Configuration files
```

## Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Playwright**: Headless browser automation for reliable web scraping
- **Path Aliases**: Clean imports using `@/` for `src/`
- **ESLint & Prettier**: Code quality and formatting
- **Jest**: Testing with ESM support and path alias mapping
- **Docker**: Multi-stage builds for production and development
- **CI/CD**: GitHub Actions workflow with automated testing
- **Error Handling**: Retry logic and comprehensive error handling
- **Type Safety**: Full type coverage with no `any` types
- **ESNext Modules**: Modern JavaScript modules (not CommonJS)

## Project Configuration

- **Node.js**: `24.12.0` LTS (works with earlier/newer versions too)
- **Playwright**: Latest version with Chromium browser
- **TypeScript**: Strict mode with all checks enabled
- **ESLint**: Flat config with type-checking
- **Prettier**: No semicolons, single quotes

## Prerequisites

- Node.js 24.12.0 (or use nvm: `nvm use`)
- npm (comes with Node.js)

## Installation

```shell
cd typescript-node-playwright
npm install
npx playwright install chromium
```

## Usage

### Development

```shell
npm run dev              # Run scraper once
npm run dev:watch        # Run with auto-restart on file changes
```

### Production

```shell
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled code
npm run clean            # Remove dist/ folder
```

### Testing

```shell
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Code Quality

```shell
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
```

## Configuration

Edit [`src/config/index.ts`](src/config/index.ts) to customize:

- Target URL to scrape
- CSS selectors for data extraction
- Headless mode (true/false)
- Timeout settings
- Retry attempts
- Output file path

### Example Configuration

```typescript
export const config: AppConfig = {
  appName: 'typescript-playwright-scraper',
  version: '0.1.0',
  scraper: {
    url: 'https://quotes.toscrape.com/',
    headless: true,
    timeout: 30000,
    retries: 3,
    outputPath: 'data/scraped-data.json',
    selectors: {
      container: '.quote',
      title: '.text',
      author: '.author',
      tags: '.tag'
    }
  }
}
```

## Scraped Data Format

The scraper outputs JSON in the following format:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "url": "https://quotes.toscrape.com/",
  "quotes": [
    {
      "text": "The world as we have created it...",
      "author": "Albert Einstein",
      "tags": ["change", "deep-thoughts", "thinking"]
    }
  ],
  "totalCount": 10
}
```

## Docker Usage

### Using Docker Compose

```shell
# Production build
docker-compose up --build

# Development build
BUILD_TARGET=development docker-compose up --build

# Clean up
docker-compose down
```

### Using Docker Directly

```shell
# Build production image
docker build --target production -t playwright-scraper:latest .

# Build development image
docker build --target development -t playwright-scraper:dev .

# Run container
docker run --rm -v $(pwd)/data:/app/data playwright-scraper:latest
```

## How It Works

1. **Initialization**: Loads configuration and initializes Playwright browser
2. **Navigation**: Navigates to the target URL
3. **Scraping**: Extracts data using CSS selectors
4. **Retry Logic**: Automatically retries on failure (configurable)
5. **Data Storage**: Saves results as formatted JSON
6. **Cleanup**: Properly closes browser and resources

### Key Components

- **[`src/utils/scraper.ts`](src/utils/scraper.ts)**: Core scraping logic with Playwright
- **[`src/types/index.ts`](src/types/index.ts)**: Type definitions for configuration and data
- **[`src/config/index.ts`](src/config/index.ts)**: Centralized configuration
- **[`src/utils/logger.ts`](src/utils/logger.ts)**: Logging utility

## Extending the Template

### Scraping Different Websites

1. Update the `url` in [`src/config/index.ts`](src/config/index.ts)
2. Inspect the target website to find CSS selectors
3. Update the `selectors` object with correct selectors
4. Modify [`ScrapedQuote`](src/types/index.ts) type if data structure differs
5. Update the extraction logic in [`src/utils/scraper.ts`](src/utils/scraper.ts) if needed

### Adding New Features

- **Pagination**: Loop through pages in [`scrapeQuotes()`](src/utils/scraper.ts)
- **Authentication**: Add login flow before scraping
- **Screenshots**: Use `page.screenshot()` to capture images
- **Multiple URLs**: Iterate over an array of URLs
- **Database Storage**: Replace file writing with database operations

## CI/CD

The project includes a GitHub Actions workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) that:

1. Installs dependencies and Playwright browsers
2. Runs type checking
3. Runs linting
4. Checks code formatting
5. Builds the project
6. Runs tests with coverage
7. Tests Docker builds (production and development)
8. Uploads artifacts (coverage reports, build output)

## Testing

Tests use Jest with mocked Playwright to avoid actual browser launches:

- **Config Tests**: Validate configuration structure
- **Scraper Tests**: Test scraping logic with mocked browser
- All tests avoid network requests and browser launches
- Coverage reports track code coverage

See [`tests/README.md`](tests/README.md) for more details.

## Troubleshooting

### Playwright Installation Issues

```shell
# Reinstall Playwright browsers
npx playwright install --with-deps chromium
```

### Docker Build Issues

```shell
# Clean Docker cache
docker system prune -af
docker-compose build --no-cache
```

### TypeScript Errors

```shell
# Clean and rebuild
npm run clean
npm run build
```

## Best Practices

- Always respect website terms of service and robots.txt
- Implement rate limiting for production scraping
- Use headless mode in production for better performance
- Handle errors gracefully with retry logic
- Validate scraped data before saving
- Keep selectors in configuration for easy updates
- Use type safety to catch errors early

## License

ISC

## Author

albedosehen

## Contributing

1. Follow the existing code style (enforced by ESLint/Prettier)
2. Write tests for new features
3. Ensure all CI checks pass
4. Update documentation as needed

---

**Note**: This template scrapes [https://quotes.toscrape.com/](https://quotes.toscrape.com/), a website specifically designed for scraping practice. Always ensure you have permission before scraping production websites.
