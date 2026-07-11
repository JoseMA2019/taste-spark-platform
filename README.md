# Burger Forge & Marea Azul

Sitio web de restaurantes construido con **TanStack Start** (React 19 + Vite 7) y **Tailwind CSS v4**. Incluye dos landings:

- **`/`** — _Burger Forge_: hamburguesería premium forjada al fuego.
- **`/cevicheria`** — _Marea Azul_: cevichería peruana con pesca del día.

## Stack

- ⚡ **TanStack Start v1** (SSR + file-based routing)
- ⚛️ **React 19**
- 🎨 **Tailwind CSS v4** con tokens de diseño en `src/styles.css`
- 🔤 **Google Fonts**: Anton (display), Caveat (script), Inter (body) — con `preconnect` + `preload` + `display=swap` para mejor LCP
- 🗺️ **SEO**: `sitemap.xml`, `robots.txt`, meta tags Open Graph/Twitter, JSON-LD (Organization + Restaurant schema.org)

## Estructura

```
src/
├── assets/            # Imágenes (burgers, ceviches, hero)
├── routes/
│   ├── __root.tsx     # Layout global + meta sitewide
│   ├── index.tsx      # Landing Burger Forge
│   ├── cevicheria.tsx # Landing Marea Azul
│   └── sitemap[.]xml.ts
├── styles.css         # Tokens Tailwind v4
└── router.tsx
public/
└── robots.txt
```

## Desarrollo

```bash
bun install
bun run dev
```

Abre <http://localhost:8080>.

## Build

```bash
bun run build
```

## SEO

- **Metadata por ruta**: título, descripción, `og:*`, `twitter:card`, `canonical` — todo en `head()` de cada `createFileRoute`.
- **JSON-LD**: `Restaurant` schema con menú, `aggregateRating`, `openingHours`, `address`.
- **Fuentes optimizadas**: `<link rel="preconnect">` + `rel="preload" as="style"` + `display=swap` para reducir bloqueo de render.
- **Imágenes**: hero con `fetchPriority="high"`; resto con `loading="lazy"` y `decoding="async"`.
- **Accesibilidad**: `<main>`, `aria-labelledby`, `alt` descriptivos, contraste AA.

## Rutas útiles

| Ruta | Descripción |
| --- | --- |
| `/` | Landing hamburguesería |
| `/cevicheria` | Landing cevichería |
| `/sitemap.xml` | Sitemap dinámico |
| `/robots.txt` | Robots |

## Licencia

MIT — Uso libre para portfolio y aprendizaje.
