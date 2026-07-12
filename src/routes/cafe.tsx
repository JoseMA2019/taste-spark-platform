import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import heroImg from "@/assets/coffee-hero.jpg";
import latteImg from "@/assets/coffee-latte.jpg";
import icedImg from "@/assets/coffee-iced.jpg";
import pastryImg from "@/assets/coffee-pastry.jpg";
import cappuccinoImg from "@/assets/coffee-cappuccino.jpg";
import matchaImg from "@/assets/coffee-matcha.jpg";

const SITE_URL = "https://taste-spark-platform.lovable.app";
const PAGE_URL = `${SITE_URL}/cafe`;
const PAGE_TITLE = "Ámbar Café · Café de especialidad tostado en casa";
const PAGE_DESC =
  "Café de especialidad, latte art, cold brew y repostería artesanal. Grano de origen tostado en casa. Un rincón cálido para trabajar, leer o encontrarte.";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: "Espresso" | "Fríos" | "Especiales" | "Repostería";
  img: string;
  tag?: string;
};

const PRODUCTS: Product[] = [
  { id: "e1", name: "Espresso Doble", desc: "Doble shot de nuestro blend de temporada, notas a cacao y caramelo.", price: 8, category: "Espresso", img: cappuccinoImg, tag: "Signature" },
  { id: "e2", name: "Cappuccino", desc: "Espresso, leche vaporizada aterciopelada y espuma cremosa.", price: 12, category: "Espresso", img: cappuccinoImg },
  { id: "e3", name: "Latte Rosetta", desc: "Latte suave con arte en cada taza. Alternativa vegetal disponible.", price: 14, category: "Espresso", img: latteImg, tag: "Más pedido" },
  { id: "f1", name: "Cold Brew 12h", desc: "Extracción lenta en frío durante 12 horas. Suave, dulce, sin amargor.", price: 15, category: "Fríos", img: icedImg },
  { id: "f2", name: "Caramel Macchiato", desc: "Leche fría, espresso y caramelo casero. Con hielo.", price: 16, category: "Fríos", img: icedImg, tag: "Verano" },
  { id: "s1", name: "Matcha Latte", desc: "Matcha ceremonial japonés batido con leche cremosa.", price: 17, category: "Especiales", img: matchaImg },
  { id: "s2", name: "Chai Casero", desc: "Infusión especiada de cardamomo, canela y jengibre con leche.", price: 15, category: "Especiales", img: matchaImg },
  { id: "r1", name: "Croissant de Mantequilla", desc: "Hojaldrado 72h, mantequilla francesa. Horneado cada mañana.", price: 9, category: "Repostería", img: pastryImg, tag: "Fresh" },
  { id: "r2", name: "Cinnamon Roll", desc: "Rollo tibio de canela con glaseado de queso crema.", price: 11, category: "Repostería", img: pastryImg },
];

const CATEGORIES = ["Todos", "Espresso", "Fríos", "Especiales", "Repostería"] as const;

export const Route = createFileRoute("/cafe")({
  component: CafePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      {
        name: "keywords",
        content:
          "café de especialidad, cafetería, latte art, cold brew, matcha latte, repostería artesanal, brunch, coffee shop",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:site_name", content: "Ámbar Café" },
      { property: "og:locale", content: "es_PE" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CafeOrCoffeeShop",
          "@id": `${PAGE_URL}#cafe`,
          name: "Ámbar Café",
          description: PAGE_DESC,
          servesCuisine: ["Coffee", "Bakery", "Brunch"],
          priceRange: "$$",
          url: PAGE_URL,
          telephone: "+51-987-654-321",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. La Mar 1234",
            addressLocality: "Miraflores",
            addressRegion: "Lima",
            postalCode: "15074",
            addressCountry: "PE",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "07:00",
              closes: "21:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday", "Sunday"],
              opens: "08:00",
              closes: "22:00",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "612",
            bestRating: "5",
            worstRating: "1",
          },
        }),
      },
    ],
  }),
});

function CafePage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});

  const items = useMemo(
    () => (cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat],
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce(
    (sum, [id, q]) => sum + (PRODUCTS.find((p) => p.id === id)?.price ?? 0) * q,
    0,
  );

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  return (
    <main className="min-h-screen" style={{ background: "var(--cafe-bg)" }}>
      <style>{`
        :root {
          --cafe-bg: #f7f1e8;
          --cafe-cream: #efe4d2;
          --cafe-ink: #2b1d12;
          --cafe-muted: #6b5544;
          --cafe-accent: #a4632c;
          --cafe-accent-2: #d4a373;
          --cafe-line: #e3d3b8;
        }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: "rgba(247,241,232,0.85)", borderBottom: "1px solid var(--cafe-line)" }}>
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/cafe" className="flex items-center gap-2" style={{ color: "var(--cafe-ink)" }}>
            <span style={{ fontFamily: "var(--font-script)", fontSize: "1.8rem", color: "var(--cafe-accent)", lineHeight: 1 }}>Ámbar</span>
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--cafe-muted)" }}>Café</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--cafe-ink)" }}>
            <a href="#menu" className="hover:opacity-70 transition">Menú</a>
            <a href="#historia" className="hover:opacity-70 transition">Historia</a>
            <a href="#visita" className="hover:opacity-70 transition">Visítanos</a>
            <Link to="/" className="hover:opacity-70 transition">Otros</Link>
          </nav>
          <a
            href="#menu"
            className="rounded-full px-5 py-2 text-sm font-medium transition hover:opacity-90"
            style={{ background: "var(--cafe-ink)", color: "var(--cafe-bg)" }}
          >
            Ordenar
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center" aria-labelledby="hero-title">
        <div>
          <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: "var(--cafe-accent)" }}>
            Tostado en casa · Grano de origen
          </p>
          <h1
            id="hero-title"
            className="text-5xl md:text-7xl leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--cafe-ink)" }}
          >
            El café que<br />
            <span style={{ fontFamily: "var(--font-script)", color: "var(--cafe-accent)", fontWeight: 400 }}>
              te espera cada mañana
            </span>
          </h1>
          <p className="text-lg mb-8 max-w-md" style={{ color: "var(--cafe-muted)" }}>
            Café de especialidad tostado semanalmente, latte art hecho a mano y repostería recién horneada. Un rincón cálido para quedarse.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full px-7 py-3 font-medium transition hover:opacity-90"
              style={{ background: "var(--cafe-ink)", color: "var(--cafe-bg)" }}
            >
              Ver el menú
            </a>
            <a
              href="#visita"
              className="rounded-full px-7 py-3 font-medium transition border-2"
              style={{ borderColor: "var(--cafe-ink)", color: "var(--cafe-ink)" }}
            >
              Reservar mesa
            </a>
          </div>
          <div className="mt-10 flex items-center gap-8 text-sm" style={{ color: "var(--cafe-muted)" }}>
            <div>
              <div className="text-2xl font-semibold" style={{ color: "var(--cafe-ink)", fontFamily: "var(--font-display)" }}>4.9★</div>
              <div>612 reseñas</div>
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ color: "var(--cafe-ink)", fontFamily: "var(--font-display)" }}>8+</div>
              <div>Años tostando</div>
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ color: "var(--cafe-ink)", fontFamily: "var(--font-display)" }}>100%</div>
              <div>Grano peruano</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl" style={{ background: "var(--cafe-cream)", transform: "rotate(-2deg)" }} />
          <img
            src={heroImg}
            alt="Barista sirviendo un latte con arte cremoso en Ámbar Café con luz cálida matutina"
            width={1024}
            height={1024}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="relative rounded-3xl w-full object-cover shadow-2xl"
            style={{ aspectRatio: "1/1" }}
          />
          <div
            className="absolute -bottom-6 -left-6 rounded-2xl px-5 py-4 shadow-xl"
            style={{ background: "var(--cafe-bg)", border: "1px solid var(--cafe-line)" }}
          >
            <div style={{ fontFamily: "var(--font-script)", color: "var(--cafe-accent)", fontSize: "1.5rem", lineHeight: 1 }}>
              recién molido
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--cafe-muted)" }}>Cada taza, cada vez</div>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="border-y" style={{ borderColor: "var(--cafe-line)", background: "var(--cafe-cream)" }}>
        <div className="mx-auto max-w-6xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm" style={{ color: "var(--cafe-ink)" }}>
          <div>☕ Tostado semanal</div>
          <div>🥐 Repostería diaria</div>
          <div>🌱 Leches vegetales</div>
          <div>📶 Wi-Fi & enchufes</div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: "var(--cafe-accent)" }}>
            La carta
          </p>
          <h2 className="text-4xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--cafe-ink)" }}>
            Menú del día
          </h2>
          <p style={{ color: "var(--cafe-muted)" }}>Filtra por lo que se te antoja</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="rounded-full px-5 py-2 text-sm font-medium transition"
              style={
                cat === c
                  ? { background: "var(--cafe-ink)", color: "var(--cafe-bg)" }
                  : { background: "transparent", color: "var(--cafe-ink)", border: "1px solid var(--cafe-line)" }
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <article
              key={p.id}
              className="rounded-3xl overflow-hidden transition hover:-translate-y-1"
              style={{ background: "var(--cafe-bg)", border: "1px solid var(--cafe-line)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  width={1024}
                  height={768}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {p.tag && (
                  <span
                    className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: "var(--cafe-accent)", color: "white" }}
                  >
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "var(--cafe-ink)" }}>
                    {p.name}
                  </h3>
                  <span className="text-lg font-semibold whitespace-nowrap" style={{ color: "var(--cafe-accent)" }}>
                    S/ {p.price}
                  </span>
                </div>
                <p className="text-sm mb-4 min-h-[3rem]" style={{ color: "var(--cafe-muted)" }}>{p.desc}</p>
                {cart[p.id] ? (
                  <div className="flex items-center justify-between rounded-full p-1" style={{ background: "var(--cafe-cream)" }}>
                    <button
                      onClick={() => sub(p.id)}
                      className="w-9 h-9 rounded-full font-bold transition"
                      style={{ background: "var(--cafe-bg)", color: "var(--cafe-ink)" }}
                      aria-label={`Quitar uno de ${p.name}`}
                    >
                      −
                    </button>
                    <span className="font-medium" style={{ color: "var(--cafe-ink)" }}>{cart[p.id]}</span>
                    <button
                      onClick={() => add(p.id)}
                      className="w-9 h-9 rounded-full font-bold transition"
                      style={{ background: "var(--cafe-ink)", color: "var(--cafe-bg)" }}
                      aria-label={`Agregar otro ${p.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => add(p.id)}
                    className="w-full rounded-full py-2.5 text-sm font-medium transition hover:opacity-90"
                    style={{ background: "var(--cafe-ink)", color: "var(--cafe-bg)" }}
                  >
                    Agregar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HISTORIA */}
      <section id="historia" className="py-24" style={{ background: "var(--cafe-cream)" }}>
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src={latteImg}
            alt="Latte con arte rosetta desde arriba"
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="rounded-3xl w-full shadow-xl"
          />
          <div>
            <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: "var(--cafe-accent)" }}>Nuestra historia</p>
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--cafe-ink)" }}>
              Del grano a tu taza,<br />
              <span style={{ fontFamily: "var(--font-script)", color: "var(--cafe-accent)", fontWeight: 400 }}>con calma</span>
            </h2>
            <p className="mb-4" style={{ color: "var(--cafe-muted)" }}>
              Trabajamos directo con productores de Chanchamayo y Villa Rica. Tostamos en pequeños lotes cada semana para que el café llegue vivo a tu taza.
            </p>
            <p style={{ color: "var(--cafe-muted)" }}>
              Sin apuros, sin atajos. Solo grano bueno, agua filtrada y manos que saben lo que hacen.
            </p>
          </div>
        </div>
      </section>

      {/* VISITA */}
      <section id="visita" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: "var(--cafe-accent)" }}>Encuéntranos</p>
          <h2 className="text-4xl md:text-6xl" style={{ fontFamily: "var(--font-display)", color: "var(--cafe-ink)" }}>
            Visita Ámbar
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Dirección", d: "Av. La Mar 1234\nMiraflores, Lima" },
            { t: "Horario", d: "Lun–Vie: 7am – 9pm\nSáb–Dom: 8am – 10pm" },
            { t: "Contacto", d: "+51 987 654 321\nhola@ambarcafe.pe" },
          ].map((b) => (
            <div
              key={b.t}
              className="rounded-3xl p-8"
              style={{ background: "var(--cafe-cream)", border: "1px solid var(--cafe-line)" }}
            >
              <h3 className="text-xl mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--cafe-ink)" }}>{b.t}</h3>
              <p className="whitespace-pre-line" style={{ color: "var(--cafe-muted)" }}>{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10" style={{ borderColor: "var(--cafe-line)", background: "var(--cafe-cream)" }}>
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: "var(--cafe-muted)" }}>
          <div>
            <span style={{ fontFamily: "var(--font-script)", fontSize: "1.4rem", color: "var(--cafe-accent)" }}>Ámbar</span>
            <span className="ml-2">© {new Date().getFullYear()} · Café de especialidad</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-70">Instagram</a>
            <a href="#" className="hover:opacity-70">TikTok</a>
            <a href="#" className="hover:opacity-70">WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* CART FLOAT */}
      {cartCount > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full shadow-2xl px-6 py-3 flex items-center gap-4 z-50"
          style={{ background: "var(--cafe-ink)", color: "var(--cafe-bg)" }}
        >
          <span className="font-medium">{cartCount} {cartCount === 1 ? "item" : "items"}</span>
          <span style={{ color: "var(--cafe-accent-2)" }}>·</span>
          <span className="font-semibold">S/ {cartTotal}</span>
          <button
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: "var(--cafe-accent)", color: "white" }}
          >
            Ordenar →
          </button>
        </div>
      )}
    </main>
  );
}
