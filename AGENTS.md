# Kay G. Hagler

## Stack

- React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Lucide
- Ecwid REST catalog with public token only; local JSON fallback for development

## Commands

- `npm run dev`
- `npm run lint`
- `npm run build`

## Conventions

- Keep Ecwid normalization in `src/services/ecwidClient.ts`.
- Keep editorial copy and feature flags in `src/config/site.json`.
- Reuse `Product`, `useCatalog`, `ProductCard`, and `ProductGrid` before adding parallel patterns.
- Use semantic links/buttons, visible focus states, explicit image dimensions, and reduced-motion support.

## Boundaries

- Never expose Ecwid secret tokens. `VITE_ECWID_PUBLIC_TOKEN` must be a public token.
- Do not add dependencies for behavior covered by CSS or browser APIs.
- Run `npm run lint` and `npm run build` before handoff.
