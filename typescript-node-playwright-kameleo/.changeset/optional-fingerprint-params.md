# Optional Fingerprint Search Parameters Enhancement

## Summary

Updated the `searchFingerprints()` method in [`client.ts`](../src/kameleo/client.ts:34) to support two additional optional parameters that were previously being passed as `undefined` on lines 42 and 45:

1. **`osFamily`** (line 43) - Operating system family
2. **`browserVersion`** (line 45) - Browser version

## Benefits

### 1. More Precise Fingerprint Matching

These optional parameters enable more targeted fingerprint searches:

- **`osFamily`**: Filter fingerprints by operating system (e.g., 'windows', 'macos', 'linux', 'android', 'ios')
  - Useful when you need to match specific OS environments
  - Improves bot detection evasion by using OS-appropriate fingerprints
  
- **`browserVersion`**: Filter fingerprints by specific browser version (e.g., '120.0', '119.0.6045.105')
  - Ensures compatibility with specific browser versions
  - Allows targeting of fingerprints that match your Playwright browser version
  - Helps avoid detection by using version-appropriate fingerprints

### 2. Better Control Over Automation

By specifying these parameters, you can:
- Reduce the number of fingerprints returned (faster search)
- Ensure fingerprint compatibility with your target environment
- Create more realistic browser profiles for specific use cases

### 3. Example Usage

#### Basic usage (unchanged):
```typescript
const fingerprints = await kameleoClient.searchFingerprints({
  platform: 'desktop',
  browser: 'chrome'
})
```

#### Advanced usage with new parameters:
```typescript
const fingerprints = await kameleoClient.searchFingerprints({
  platform: 'desktop',
  browser: 'chrome',
  osFamily: 'windows',        // NEW: Target Windows OS fingerprints
  browserVersion: '120.0'     // NEW: Target Chrome 120.0 specifically
})
```

## Changes Made

### 1. Type Definitions ([`types.ts`](../src/kameleo/types.ts:24))

Added two new optional fields to `FingerprintSearchOptions`:
```typescript
export interface FingerprintSearchOptions {
  platform: 'desktop' | 'mobile'
  device?: string
  browser?: string
  osFamily?: string           // NEW
  browserVersion?: string     // NEW
}
```

### 2. Client Implementation ([`client.ts`](../src/kameleo/client.ts:34))

Updated the `searchFingerprints()` method to use these parameters instead of passing `undefined`:
```typescript
const osFamily: string | undefined = options.osFamily
const browserVersion: string | undefined = options.browserVersion

const fingerprints = await this.client.fingerprint.searchFingerprints(
  deviceType,
  osFamily,        // Now uses actual value if provided
  browserProduct,
  browserVersion   // Now uses actual value if provided
)
```

### 3. Tests ([`client.test.ts`](../tests/kameleo/client.test.ts:48))

Added new test case to verify the optional parameters work correctly:
```typescript
it('should search with optional osFamily and browserVersion parameters', async () => {
  // Tests that the parameters are properly passed to the Kameleo API
})
```

## Testing

All tests pass with 82.75% coverage for the kameleo module:
- ✅ Type checking passes
- ✅ Linting passes
- ✅ Formatting passes
- ✅ All 27 tests pass including new test for optional parameters
- ✅ No breaking changes to existing API

## Backward Compatibility

This change is **100% backward compatible**:
- Existing code without these parameters continues to work as before
- Parameters are optional, so they default to `undefined` (same behavior as before)
- No changes required to existing code
