# Unit Tests

The project configuration supports two testing patterns:

- Separate `tests/` directory (default)
- Co-located tests (optional)

## Testing Structure

With the existing `tests/` folder, the intention is to mirror the `src/` structure inside `tests/`. This is done for three reasons:

1. Clean separation between the source code and the actual test.
2. Source directory maintains uncluttered
3. Easy to exclude `tests/` from production builds.

### Co-locating Tests

If for some reason a test must be c-located, then the following structure is expected in the `src/` directory where that test lives

```text
src/
├── config/
│   ├── index.ts
│   └── index.test.ts           ← Test next to source
├── utils/
│   ├── logger.ts
│   └── logger.test.ts          ← Test next to source
```

Or place those tests within the `__tests__/` folder

```text
src/
├── config/
│   ├── __tests__/
│   │   └── index.test.ts
│   └── index.ts
```

99% of cases you should not need to co-locate tests so always prefer the separate test approach.
