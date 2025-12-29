# TypeScript Node.js Playwright + Kameleo Template

A production-ready template for browser automation using **Playwright** with **Kameleo** browser fingerprint spoofing. This template demonstrates best practices for creating undetectable web automation scripts by integrating Kameleo's advanced fingerprinting capabilities.

## Features

- **Playwright Integration** - Modern browser automation with Chromium and Firefox support
- **Kameleo Fingerprint Spoofing** - Bypass bot detection with realistic browser fingerprints
- **TypeScript** - Full type safety with strict TypeScript configuration
- **Comprehensive Testing** - Jest test suite with 80%+ coverage
- **ESLint + Prettier** - Code quality and consistent formatting
- **Docker Support** - Containerized development and production environments
- **Modular Architecture** - Clean separation of concerns with client wrapper and profile manager
- **Error Handling** - Robust error handling and logging throughout
- **Environment Configuration** - Flexible configuration via environment variables

## Prerequisites

### Required Software

1. **Node.js** - Version 20 LTS or higher
   - Check version: `node --version`
   - Install from: <https://nodejs.org/>

2. **Kameleo Desktop Application** (CRITICAL)
   - Download from: <https://www.kameleo.io/>
   - Must be running locally on your machine
   - Default API endpoint: `http://localhost:5050`
   - The Kameleo LocalAPI must be accessible

3. **Package Manager** - npm (comes with Node.js)

### Important Notes

⚠️ **Kameleo Desktop is Required**: This template requires a running instance of the Kameleo Desktop Application. The application cannot run in Docker as it needs access to the Kameleo LocalAPI running on your host machine.

## Installation

1. **Navigate to the project directory:**

   ```bash
   cd typescript-node-playwright-kameleo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your settings (defaults are usually fine):

   ```env
   KAMELEO_BASE_URL=http://localhost:5050
   KAMELEO_PORT=5050
   DEFAULT_BROWSER_TYPE=chrome
   DEFAULT_FINGERPRINT_PLATFORM=desktop
   
   AUTOMATION_URL=https://www.google.com
   AUTOMATION_TIMEOUT=30000
   AUTOMATION_RETRIES=3
   
   LOG_LEVEL=info
   ```

4. **Ensure Kameleo Desktop is running:**
   - Launch the Kameleo Desktop Application
   - Verify the LocalAPI is accessible at `http://localhost:5050`

## Project Structure

```
typescript-node-playwright-kameleo/
├── src/
│   ├── index.ts                  # Main entry point with example workflow
│   ├── config/
│   │   └── index.ts             # Application configuration
│   ├── kameleo/
│   │   ├── client.ts            # KameleoClientWrapper class
│   │   ├── profiles.ts          # ProfileManager class
│   │   └── types.ts             # Kameleo-specific TypeScript interfaces
│   ├── types/
│   │   └── index.ts             # Application-wide type definitions
│   └── utils/
│       └── logger.ts            # Logging utility
├── tests/
│   ├── config/
│   │   └── index.test.ts        # Configuration tests
│   └── kameleo/
│       ├── client.test.ts       # KameleoClientWrapper tests
│       └── profiles.test.ts     # ProfileManager tests
├── .env.example                 # Environment variable template
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── jest.config.mjs             # Jest test configuration
├── eslint.config.mjs           # ESLint configuration
└── README.md                   # This file
```

## Usage

### Development

Run the example automation script in development mode:

```bash
npm run dev
```

This will:

1. Initialize Kameleo client connection
2. Search for matching browser fingerprints
3. Create a new browser profile with spoofed fingerprint
4. Launch browser and connect via Playwright CDP
5. Perform example automation tasks (navigate to URL, take screenshot)
6. Properly stop the profile to persist state

### Building for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

Run the compiled code:

```bash
npm start
```

### Watch Mode

For development with auto-reload:

```bash
npm run dev:watch
```

## Kameleo Integration Patterns

### Explicit Start Pattern (Recommended)

The template follows Kameleo's recommended "explicit start" pattern:

```typescript
// 1. Initialize client
const kameleoClient = new KameleoClientWrapper(config)
const profileManager = new ProfileManager(kameleoClient)

// 2. Create and launch browser with custom settings
const { wsEndpoint, profileId } = await profileManager.createAndLaunchBrowser({
  name: 'my-profile',
  browserType: 'chrome',
  platform: 'desktop',
  browserSettings: {
    // Configure BEFORE starting - don't modify via Playwright after connecting
  }
})

// 3. Connect via Playwright CDP
const browser = await profileManager.connectToBrowser(wsEndpoint, 'chrome')

// 4. Get the default context (ONE context per profile)
const context = profileManager.getBrowserContext(browser)

// 5. Create pages and automate
const page = await context.newPage()
await page.goto('https://example.com')

// 6. CRITICAL: Always stop profile when done
await browser.close()
await kameleoClient.stopProfile(profileId)
```

### Important Kameleo Best Practices

1. **NO Stealth Plugins** - Never use `playwright-extra` or similar stealth plugins. Kameleo handles all fingerprint spoofing.

2. **One Browser Context Per Profile** - Always use `browser.contexts()[0]`. Do not create additional contexts.

3. **Configure Before Start** - Set all browser settings when creating the profile, not via Playwright after connecting.

4. **Always Stop Profiles** - Call `stopProfile()` to persist profile state. This is required for profile reuse.

5. **Version Compatibility** - Ensure Playwright version matches Kameleo's Junglefox kernel version.

## API Reference

### KameleoClientWrapper

Wrapper for Kameleo LocalAPI with enhanced error handling:

```typescript
class KameleoClientWrapper {
  constructor(config: KameleoConfig)
  
  async searchFingerprints(options: FingerprintSearchOptions): Promise<Fingerprint[]>
  async createProfile(request: CreateProfileRequest): Promise<Profile>
  async startProfile(profileId: string, options?: Record<string, unknown>): Promise<void>
  async stopProfile(profileId: string): Promise<void>
  async deleteProfile(profileId: string): Promise<void>
  async cleanup(profileId: string): Promise<void>
}
```

### ProfileManager

High-level manager for creating and managing Kameleo browser profiles:

```typescript
class ProfileManager {
  constructor(client: KameleoClientWrapper)
  
  async createAndLaunchBrowser(options?: BrowserLaunchOptions): Promise<BrowserLaunchResult>
  async connectToBrowser(wsEndpoint: string, browserType?: 'chrome' | 'firefox'): Promise<Browser>
  getBrowserContext(browser: Browser): BrowserContext
  async cleanup(profileId: string): Promise<void>
}
```

## Testing

### Running Tests Locally

The test suite uses mocked Kameleo API responses and **does NOT require Kameleo Desktop** to be installed or running:

```bash
npm test                # Run all tests
npm run test:coverage   # Run tests with coverage report
npm run test:watch      # Run tests in watch mode
```

All tests mock the [@kameleo/local-api-client](https://www.npmjs.com/package/@kameleo/local-api-client) to avoid requiring actual Kameleo Desktop installation for development and CI environments.

Coverage reports are generated in the [`coverage/`](coverage/) directory.

### Running the Application

When running the actual application code (not tests), you **MUST have**:

- Kameleo Desktop App installed and running locally
- Kameleo Local API active (default port: 5050)

```bash
# This requires Kameleo Desktop to be running
npm start

# Or in development mode
npm run dev
```

### Test Structure

- **Unit Tests**: Test individual classes and functions with mocked dependencies
- **Integration Tests**: Test interactions between Kameleo client and profile manager
- **Target Coverage**: 80%+ for all critical code paths
- **CI/CD**: Tests run automatically in CI without requiring Kameleo Desktop

## Code Quality

### Linting

Check for code quality issues:

```bash
npm run lint
```

Automatically fix issues:

```bash
npm run lint:fix
```

### Formatting

Check code formatting:

```bash
npm run format:check
```

Format code:

```bash
npm run format
```

### Type Checking

Verify TypeScript types:

```bash
npm run type-check
```

## Docker

**Note:** Docker support is provided for the automation code, but Kameleo Desktop must run on the host machine. The Docker container connects to Kameleo's LocalAPI via host networking.

Build the development image:

```bash
docker build --target development -t typescript-playwright-kameleo:dev .
```

Build the production image:

```bash
docker build --target production -t typescript-playwright-kameleo:latest .
```

Run with docker-compose:

```bash
docker-compose up
```

## Troubleshooting

### Kameleo Connection Issues

**Problem:** Cannot connect to Kameleo LocalAPI

**Solutions:**

- Ensure Kameleo Desktop Application is running
- Verify LocalAPI is accessible at `http://localhost:5050`
- Check firewall settings aren't blocking port 5050
- Confirm `KAMELEO_BASE_URL` and `KAMELEO_PORT` in `.env` are correct

### Fingerprint Search Returns No Results

**Problem:** `searchFingerprints()` returns empty array

**Solutions:**

- Verify you have fingerprints installed in Kameleo Desktop
- Check the platform and browser type parameters
- Try searching without the `device` parameter first
- Update your Kameleo Desktop to the latest version

### Profile Start Fails

**Problem:** `startProfile()` throws an error

**Solutions:**

- Ensure Kameleo Desktop has sufficient resources
- Check that the profile was created successfully
- Verify browser type compatibility
- Review Kameleo Desktop logs for errors

### Playwright Connection Fails

**Problem:** Cannot connect to browser via CDP

**Solutions:**

- Verify profile is started before connecting
- Check WebSocket endpoint URL is correct
- Ensure Playwright version is compatible with Kameleo's browser version
- Try connecting with `firefox` instead of `chrome` or vice versa

### Profile Not Persisting

**Problem:** Profile state is lost between runs

**Solutions:**

- **Always call `stopProfile()`** before exiting
- Use try-finally blocks to ensure cleanup
- Don't force-kill the process
- Check Kameleo Desktop logs for profile save errors

## Best Practices

1. **Always Clean Up Profiles**

   ```typescript
   try {
     // ... automation code ...
   } finally {
     await kameleoClient.stopProfile(profileId)
   }
   ```

2. **Use TypeScript Strict Mode** - The template enforces strict type checking for better code quality

3. **Handle Errors Gracefully** - All Kameleo operations have proper error handling

4. **Log Important Events** - Use the logger utility for debugging and monitoring

5. **Test Your Code** - Maintain 80%+ coverage for production code

6. **Configure Before Start** - Set browser settings during profile creation, not after connection

7. **One Context Per Profile** - Never create additional browser contexts

## Resources

- **Kameleo Documentation**: <https://docs.kameleo.io/>
- **Kameleo Node.js SDK**: <https://www.npmjs.com/package/@kameleo/local-api-client>
- **Playwright Documentation**: <https://playwright.dev/>
- **TypeScript Documentation**: <https://www.typescriptlang.org/>

## License

ISC

## Support

For issues and questions:

- **Kameleo Support**: <https://www.kameleo.io/support>
- **Playwright Discord**: <https://aka.ms/playwright/discord>
- **Project Issues**: Create an issue in the repository

## Contributing

Contributions are welcome! Please:

1. Follow the existing code style (ESLint + Prettier)
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests and linting pass before submitting

---

**Happy Automation! 🎭🤖**
