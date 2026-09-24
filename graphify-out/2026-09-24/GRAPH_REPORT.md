# Graph Report - kayghaglersite  (2026-09-22)

## Corpus Check
- 29 files · ~9,089 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 175 nodes · 266 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6cebf076`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useLanguage
- devDependencies
- dependencies
- ecwidClient.ts
- compilerOptions
- HomePage.tsx
- BlackHole.tsx
- test-ecwid.mjs
- Design System Master File
- package.json
- Kay G. Hagler

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 17 edges
2. `compilerOptions` - 15 edges
3. `getLocalizedValue()` - 9 edges
4. `scripts` - 7 edges
5. `Product` - 7 edges
6. `Design System Master File` - 7 edges
7. `LiquidImage()` - 6 edges
8. `useCatalog()` - 6 edges
9. `ProductPage()` - 6 edges
10. `normalizeProduct()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Introduction()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/Introduction.tsx → src/i18n/LanguageContext.tsx
- `Introduction()` --calls--> `getLocalizedValue()`  [EXTRACTED]
  src/components/Introduction.tsx → src/services/ecwidClient.ts
- `Navbar()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/Navbar.tsx → src/i18n/LanguageContext.tsx
- `ProductCarousel()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/ProductCarousel.tsx → src/i18n/LanguageContext.tsx
- `useCatalog()` --calls--> `getCatalogProducts()`  [EXTRACTED]
  src/hooks/useCatalog.ts → src/services/ecwidClient.ts

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "useLanguage"
Cohesion: 0.17
Nodes (19): Footer(), Hero(), fill(), LegalDocument, LegalDocumentPage(), LocalizedCopy, LiquidImage(), Props (+11 more)

### Community 1 - "devDependencies"
Cohesion: 0.11
Nodes (18): autoprefixer, esbuild, vite, devDependencies, autoprefixer, esbuild, tailwindcss, tsx (+10 more)

### Community 2 - "dependencies"
Cohesion: 0.10
Nodes (21): dotenv, express, @google/genai, lucide-react, motion, dependencies, dotenv, express (+13 more)

### Community 3 - "ecwidClient.ts"
Cohesion: 0.14
Nodes (20): applyOverride(), config, ecwid, EcwidProduct, EcwidResponse, fetchEcwidProducts(), getCatalogProducts(), getLocalProducts() (+12 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 5 - "HomePage.tsx"
Cohesion: 0.22
Nodes (6): Introduction(), stripHtml(), useCatalog(), LanguageProvider(), HomePage(), getLatestProducts()

### Community 6 - "BlackHole.tsx"
Cohesion: 0.18
Nodes (7): Centre, COMPONENT_DEFAULTS, DEFAULT_CENTRE, DEFAULTS, Particle, Props, Phase

### Community 10 - "Design System Master File"
Cohesion: 0.11
Nodes (17): Additional Forbidden Patterns, Anti-Patterns (Do NOT Use), Buttons, Cards, Color Palette, Component Specs, Design System Master File, Global Rules (+9 more)

### Community 11 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, clean, dev, lint, preview (+3 more)

### Community 12 - "Kay G. Hagler"
Cohesion: 0.33
Nodes (5): Boundaries, Commands, Conventions, Kay G. Hagler, Stack

## Knowledge Gaps
- **80 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`, `package.json`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `ecwidClient.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14492753623188406 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._