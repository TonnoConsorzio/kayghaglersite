# Graph Report - .  (2026-09-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 149 nodes · 240 edges · 10 communities (9 shown, 1 thin omitted)
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

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 17 edges
2. `compilerOptions` - 15 edges
3. `getLocalizedValue()` - 9 edges
4. `scripts` - 7 edges
5. `Product` - 7 edges
6. `LiquidImage()` - 6 edges
7. `useCatalog()` - 6 edges
8. `ProductPage()` - 6 edges
9. `Footer()` - 5 edges
10. `Introduction()` - 5 edges

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

## Communities (10 total, 1 thin omitted)

### Community 0 - "useLanguage"
Cohesion: 0.15
Nodes (20): Footer(), Hero(), fill(), LegalDocument, LegalDocumentPage(), LocalizedCopy, LiquidImage(), Props (+12 more)

### Community 1 - "devDependencies"
Cohesion: 0.07
Nodes (26): autoprefixer, esbuild, devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express (+18 more)

### Community 2 - "dependencies"
Cohesion: 0.08
Nodes (24): dotenv, express, @google/genai, lucide-react, motion, dependencies, dotenv, express (+16 more)

### Community 3 - "ecwidClient.ts"
Cohesion: 0.16
Nodes (18): applyOverride(), config, ecwid, EcwidProduct, EcwidResponse, fetchEcwidProducts(), getCatalogProducts(), getLocalProducts() (+10 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 5 - "HomePage.tsx"
Cohesion: 0.27
Nodes (5): Introduction(), stripHtml(), useCatalog(), HomePage(), getLatestProducts()

### Community 6 - "BlackHole.tsx"
Cohesion: 0.18
Nodes (7): Centre, COMPONENT_DEFAULTS, DEFAULT_CENTRE, DEFAULTS, Particle, Props, Phase

## Knowledge Gaps
- **64 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `dependencies`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._