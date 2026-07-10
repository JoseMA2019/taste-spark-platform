import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, MapPin, Truck, Flame, Plus, Minus, ShoppingBag, Star, Instagram, Facebook, Phone } from "lucide-react";

import heroBurger from "@/assets/hero-burger.jpg";
import bClassic from "@/assets/burger-classic.jpg";
import bBBQ from "@/assets/burger-bbq.jpg";
import bRoyal from "@/assets/burger-royal.jpg";
import bVeggie from "@/assets/burger-veggie.jpg";
import bDouble from "@/assets/burger-double.jpg";
import pizza from "@/assets/pizza.jpg";
import combo from "@/assets/combo.jpg";

const SITE_URL = "https://taste-spark-platform.lovable.app";
const PAGE_TITLE = "Burger Forge — Hamburguesas artesanales con delivery en Ventanilla";
const PAGE_DESC = "Hamburguesas premium a la parrilla de leña, carne angus 180g, pan brioche 24h y salsas caseras. Delivery caliente en 25 min por todo Ventanilla, Callao.";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { name: "keywords", content: "hamburguesas Ventanilla, delivery hamburguesas Callao, burger artesanal Perú, angus burger Lima, pizza Ventanilla" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Burger Forge" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "restaurant.restaurant" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:alt", content: "Hamburguesa Burger Forge doble con queso derretido" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Burger Forge",
          description: PAGE_DESC,
          url: SITE_URL,
          image: `${SITE_URL}/og-image.jpg`,
          servesCuisine: ["American", "Burgers", "Pizza"],
          priceRange: "S/ 14 – S/ 30",
          telephone: "+51 987 654 321",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Mz. LLT9",
            addressLocality: "Ventanilla",
            addressRegion: "Callao",
            addressCountry: "PE",
          },
          openingHours: "Mo-Su 12:00-23:00",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "2400",
          },
          hasMenu: {
            "@type": "Menu",
            hasMenuSection: [
              {
                "@type": "MenuSection",
                name: "Hamburguesas",
                hasMenuItem: PRODUCTS.filter((p) => p.category === "Hamburguesas").map((p) => ({
                  "@type": "MenuItem",
                  name: p.name,
                  description: p.desc,
                  offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: "PEN" },
                })),
              },
            ],
          },
        }),
      },
    ],
  }),
});

type Category = "Todos" | "Hamburguesas" | "Combos" | "Pizza";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  category: Exclude<Category, "Todos">;
  image: string;
  badges: ("Oferta" | "Nuevo" | "Top")[];
  stock: number;
};

const PRODUCTS: Product[] = [
  { id: "royal", name: "Royal Angus", desc: "Angus 180g, cheddar añejo, lechuga romana, tomate confitado.", price: 18.9, oldPrice: 22.9, category: "Hamburguesas", image: bRoyal, badges: ["Nuevo", "Oferta"], stock: 15 },
  { id: "bbq", name: "BBQ Bacon Fire", desc: "Angus 180g, tocino ahumado crocante, salsa BBQ de la casa.", price: 26.5, oldPrice: 31, category: "Hamburguesas", image: bBBQ, badges: ["Top", "Oferta"], stock: 14 },
  { id: "double", name: "Doble Cheese", desc: "Dos medallones jugosos con doble cheddar derretido.", price: 27.9, category: "Hamburguesas", image: bDouble, badges: ["Top"], stock: 44 },
  { id: "classic", name: "Clásica Forge", desc: "Carne de res 150g, lechuga, tomate y salsa signature.", price: 18, oldPrice: 22, category: "Hamburguesas", image: bClassic, badges: ["Oferta"], stock: 18 },
  { id: "veggie", name: "Veggie Garden", desc: "Medallón de vegetales, palta, verduras frescas y alioli.", price: 19.5, oldPrice: 23.5, category: "Hamburguesas", image: bVeggie, badges: ["Nuevo"], stock: 15 },
  { id: "combo", name: "Combo Fire Solo", desc: "Hamburguesa clásica + papas rústicas + bebida 500ml.", price: 29.9, category: "Combos", image: combo, badges: ["Top"], stock: 30 },
  { id: "pizza", name: "Pepperoni Slice", desc: "Masa madre 24h, mozzarella fior di latte, pepperoni curado.", price: 14, category: "Pizza", image: pizza, badges: [], stock: 25 },
];

const CATEGORIES: Category[] = ["Todos", "Hamburguesas", "Combos", "Pizza"];

function Home() {
  const [cat, setCat] = useState<Category>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});

  const items = useMemo(
    () => (cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat],
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  return (
    <div className="min-h-screen text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
              <Flame className="size-5 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl tracking-wide">BURGER FORGE</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Ventanilla · Perú</div>
            </div>
          </div>
          <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#menu" className="transition-colors hover:text-foreground">Menú</a>
            <a href="#about" className="transition-colors hover:text-foreground">Historia</a>
            <a href="#info" className="transition-colors hover:text-foreground">Contacto</a>
          </nav>
          <button aria-label={`Carrito con ${cartCount} artículo(s)${cartTotal > 0 ? `, total S/ ${cartTotal.toFixed(2)}` : ""}`} className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-ember)] transition-transform hover:-translate-y-0.5">
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span>{cartCount}</span>
            {cartTotal > 0 && <span className="hidden sm:inline">· S/ {cartTotal.toFixed(2)}</span>}
          </button>
        </div>
      </header>

      <main id="main">
      {/* HERO */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Flame className="size-3" /> Forjada al fuego
            </span>
            <h1 id="hero-heading" className="mt-6 font-display text-6xl leading-[0.9] sm:text-7xl md:text-8xl">
              Cada mordida <br />
              <span className="text-gradient-ember">arde</span>{" "}
              <span className="font-script text-4xl text-accent sm:text-5xl md:text-6xl">de sabor.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground">
              Carne angus madurada, pan brioche recién horneado y salsas caseras. Cocinamos sobre parrilla de leña
              y llevamos el fuego hasta tu puerta en toda Ventanilla.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-ember)] transition-transform hover:-translate-y-0.5">
                Ver menú <span aria-hidden>→</span>
              </a>
              <a href="#info" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                Pedir por WhatsApp
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-accent">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">4.9/5</span> · +2.400 pedidos servidos
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-10 rounded-full opacity-70 blur-3xl"
              style={{ background: "var(--gradient-ember)" }}
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-card)]">
              <img src={heroBurger} alt="Doble hamburguesa Burger Forge" width={1600} height={1600} className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div>
                  <div className="font-script text-2xl text-accent">Super Delicious</div>
                  <div className="font-display text-3xl">HASTA 50% OFF</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-center backdrop-blur">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Desde</div>
                  <div className="font-display text-2xl">S/ 18</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section id="info" className="mx-auto max-w-7xl px-6 pb-6">
        <div className="grid gap-4 rounded-3xl border border-border bg-card/60 p-4 backdrop-blur sm:grid-cols-2 md:grid-cols-4 md:p-6">
          <InfoCell icon={<Clock className="size-5" />} label="Horario" value="Lun–Dom · 12:00 – 23:00" />
          <InfoCell icon={<MapPin className="size-5" />} label="Local" value="Mz. LLT9, Ventanilla" />
          <InfoCell icon={<Truck className="size-5" />} label="Delivery" value="Todo Ventanilla · 25 min" />
          <InfoCell icon={<Phone className="size-5" />} label="Pedidos" value="+51 987 654 321" />
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="font-script text-2xl text-accent">Nuestro menú</div>
            <h2 className="mt-1 font-display text-5xl md:text-6xl">Sabor a fuego real</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Elige tu categoría. Todo se prepara al momento con ingredientes locales del día.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-all " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-ember)]"
                      : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground")
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} qty={cart[p.id] ?? 0} onAdd={() => add(p.id)} onSub={() => sub(p.id)} />
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 rounded-[2rem] border border-border bg-card/50 p-8 backdrop-blur md:grid-cols-[1.1fr_1fr] md:p-14">
          <div>
            <div className="font-script text-2xl text-accent">Desde 2019</div>
            <h2 className="mt-2 font-display text-5xl leading-none md:text-6xl">
              Fuego, carne <br /> y <span className="text-gradient-ember">obsesión</span>.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Nacimos en una parrilla improvisada de un garaje en Ventanilla. Hoy servimos las hamburguesas más buscadas
              del Callao, pero seguimos moliendo la carne cada mañana y horneando el pan a las 6 AM. Nada congelado,
              nada apurado.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat n="180g" l="Angus por patty" />
              <Stat n="24h" l="Fermentación pan" />
              <Stat n="25 min" l="Delivery promedio" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img src={bDouble} alt="Doble cheese apilada" width={900} height={900} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-background/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
                <Flame className="size-5 text-primary" />
              </div>
              <div className="font-display text-xl">BURGER FORGE</div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Hamburguesas artesanales forjadas al fuego. Delivery caliente en todo Ventanilla.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contacto</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Mz. LLT9, Ventanilla — Callao</li>
              <li>+51 987 654 321</li>
              <li>hola@burgerforge.pe</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Síguenos</div>
            <div className="mt-3 flex gap-3">
              <SocialButton icon={<Instagram className="size-4" />} />
              <SocialButton icon={<Facebook className="size-4" />} />
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Burger Forge · Hecho con fuego en Ventanilla
        </div>
      </footer>
    </div>
  );
}

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-secondary/40 p-4">
      <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

function ProductCard({ product, qty, onAdd, onSub }: { product: Product; qty: number; onAdd: () => void; onSub: () => void }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 shadow-[var(--shadow-card)] backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/50">
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          width={900}
          height={720}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <span
                key={b}
                className={
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest " +
                  (b === "Oferta"
                    ? "bg-primary text-primary-foreground"
                    : b === "Nuevo"
                      ? "bg-accent text-accent-foreground"
                      : "bg-background/80 text-foreground backdrop-blur")
                }
              >
                {b}
              </span>
            ))}
          </div>
          <span className="rounded-full bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur">
            Stock {product.stock}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{product.category}</div>
          <h3 className="mt-1 font-display text-2xl leading-tight">{product.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{product.desc}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <div className="font-display text-3xl">S/ {product.price.toFixed(2)}</div>
            {product.oldPrice && (
              <div className="text-sm text-muted-foreground line-through">S/ {product.oldPrice.toFixed(2)}</div>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-ember)] transition-transform hover:-translate-y-0.5"
            >
              <Plus className="size-4" /> Añadir
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 p-1">
              <button onClick={onSub} className="grid size-8 place-items-center rounded-full bg-background/70 text-foreground transition-colors hover:bg-background">
                <Minus className="size-4" />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-bold">{qty}</span>
              <button onClick={onAdd} className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105">
                <Plus className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4 text-center">
      <div className="font-display text-3xl text-gradient-ember">{n}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{l}</div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="grid size-10 place-items-center rounded-full border border-border bg-secondary/40 text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
      {icon}
    </button>
  );
}
