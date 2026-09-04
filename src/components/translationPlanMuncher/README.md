# pankosmia-translation_plan-muncher

`pankosmia-translation_plan-muncher` provides reusable translation_plan-flavored muncher components for the Pankosmia ecosystem.

This package contains a set of focused UI tools that can be integrated into Pankosmia clients when Juxtalinear editing or visualization capabilities are needed.

> **Note:** This package does not contain everything available inside `pankosmia/core-contenthandler_translation_plan`. It only exposes reusable components that may or may not be used by other Pankosmia clients.

## Components

### `TranslationPlanViewerMuncher`

A component that allows users to view a tranlation plan.

It is intended for read-only visualization use cases where editing capabilities are not required.

## Scope

This package contains only reusable Juxta-related components.

Included:

- Translation plan viewing components

## Testing

To test the Muncher components locally:

1. Start the development server:

```bash
npm run dev
```

2. Navigate to:
   `/#/MuncherTest`

## Tree of files

The GitHub repos contained 2 package.json one at root and the other at ./src/components/translationPlanMuncher/package.json

When we aim to have the 2 package.json version at the same version

## Publishing

to publish you need to be at the root of GitHub repos and use `pnpm run publish`

The published files are located at : `./src/components/translationPlanMuncher/munchersPackageExport/`
