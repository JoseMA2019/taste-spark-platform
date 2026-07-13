import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import heroImg from "@/assets/sushi-hero.jpg";
import nigiriImg from "@/assets/sushi-nigiri.jpg";
import makiImg from "@/assets/sushi-maki.jpg";
import sashimiImg from "@/assets/sushi-sashimi.jpg";
import ramenImg from "@/assets/sushi-ramen.jpg";
import gyozaImg from "@/assets/sushi-gyoza.jpg";
import interiorImg from "@/assets/sushi-interior.jpg";

const SITE_URL = "https://taste-spark-platform.lovable.app";
const PAGE_URL = `${SITE_URL}/sushi`;
const HERO_ABS = `${SITE_URL}${heroImg}`;

type Category = "todos" | "nigiri" | "maki" | "sashimi" | "calientes" | "piqueos";

interface Dish {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: Exclude<Category, "todos">;
  image: string;
  tag?: "nuevo" | "chef" | "picante";
}

const DISHES: Dish[] = [
  { id: "n1", name: "Nigiri Salmón", desc: "Salmón fresco sobre shari templado.", price: 18, category: "nigiri", image: nigiriImg, tag: "chef" },
  { id: "n2", name: "Nigiri Atún Rojo", desc: "Corte akami con toque de wasabi fresco.", price: 22, category: "nigiri", image: nigiriImg },
  { id: "n3", name: "Nigiri Hamachi", desc: "Pez limón suave con ralladura de yuzu.", price: 24, category: "nigiri", image: nigiriImg, tag: "nuevo" },
  { id: "m1", name: "Dragon Roll", desc: "Anguila, palta y kabayaki flambeado.", price: 42, category: "maki", image: makiImg, tag: "chef" },
  { id: "m2", name: "Spicy Tuna Roll", desc: "Atún picante, sriracha y cebollín.", price: 36, category: "maki", image: makiImg, tag: "picante" },
  { id: "m3", name: "Rainbow Roll", desc: "Cinco pescados sobre California.", price: 44, category: "maki", image: makiImg },
  { id: "s1", name: "Sashimi Salmón", desc: "9 cortes gruesos, corte tradicional.", price: 38, category: "sashimi", image: sashimiImg },
  { id: "s2", name: "Sashimi Mixto", desc: "Selección del chef: 12 piezas.", price: 58, category: "sashimi", image: sashimiImg, tag: "chef" },
  { id: "c1", name: "Ramen Tonkotsu", desc: "Caldo de cerdo 18h, chashu y ajitama.", price: 34, category: "calientes", image: ramenImg },
  { id: "c2", name: "Ramen Miso Picante", desc: "Miso rojo, chili oil y maíz dulce.", price: 36, category: "calientes", image: ramenImg, tag: "picante" },
  { id: "p1", name: "Gyozas de Cerdo", desc: "6 unidades con ponzu de la casa.", price: 22, category: "piqueos", image: gyozaImg },
  { id: "p2", name: "Edamame Trufado", desc: "Vainas al vapor con sal de trufa.", price: 16, category: "piqueos", image: gyozaImg, tag: "nuevo" },
];

const CATEGORIES: { id: Category; label: string; jp: string }[] = [
  { id: "todos", label: "Todos", jp: "全部" },
  { id: "nigiri", label: "Nigiri", jp: "握り" },
  { id: "maki", label: "Maki", jp: "巻き" },
  { id: "sashimi", label: "Sashimi", jp: "刺身" },
  { id: "calientes", label: "Calientes", jp: "熱い" },
  { id: "piqueos", label: "Piqueos", jp: "つまみ" },
];

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${PAGE_URL}#restaurant`,
  name: "Kuroi Sushi",
  description:
    "Omakase y sushi de autor en Lima. Cortes premium, arroz templado y coctelería japonesa.",
  url: PAGE_URL,
  telephone: "+51-987-654-321",
  image: [HERO_ABS, `${SITE_URL}${interiorImg}`],
  servesCuisine: ["Japonesa", "Sushi", "Nikkei"],
  priceRange: "$$$",
  acceptsReservations: "True",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. La Mar 1450",
    addressLocality: "Miraflores",
    addressRegion: "Lima",
    postalCode: "15074",
    addressCountry: "PE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -12.1215,
    longitude: -77.0364,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Sunday"],
      opens: "12:30",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "12:30",
      closes: "00:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
    bestRating: "5",
    worstRating: "1",
  },
  hasMenu: {
    "@type": "Menu",
    name: "Carta Kuroi",
    hasMenuSection: CATEGORIES.filter((c) => c.id !== "todos").map((cat) => ({
      "@type": "MenuSection",
      name: cat.label,
      hasMenuItem: DISHES.filter((d) => d.category === cat.id).map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        description: d.desc,
        offers: {
          "@type": "Offer",
          price: d.price.toFixed(2),
          priceCurrency: "PEN",
          availability: "https://schema.org/InStock",
        },
      })),
    })),
  },
};

export const Route = createFileRoute("/sushi")({
  head: () => ({
    meta: [
      { title: "Kuroi Sushi — Omakase y sushi de autor en Miraflores" },
      {
        name: "description",
        content:
          "Kuroi Sushi: barra de omakase, nigiri premium, makis de autor y ramen artesanal en Miraflores, Lima. Reservas abiertas.",
      },
      { name: "keywords", content: "sushi lima, omakase miraflores, nigiri, maki, sashimi, ramen, restaurante japonés" },
      { property: "og:title", content: "Kuroi Sushi — Omakase y sushi de autor" },
      {
        property: "og:description",
        content: "Nigiri, maki, sashimi y ramen en el corazón de Miraflores.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Kuroi Sushi" },
      { property: "og:locale", content: "es_PE" },
      { property: "og:image", content: HERO_ABS },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "1024" },
      { property: "og:image:alt", content: "Tabla de nigiri y maki premium sobre pizarra negra" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kuroi Sushi — Omakase en Miraflores" },
      { name: "twitter:description", content: "Sushi de autor, ramen y coctelería japonesa." },
      { name: "twitter:image", content: HERO_ABS },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(restaurantSchema),
      },
    ],
  }),
  component: SushiPage,
});

function SushiPage() {
  const [active, setActive] = useState<Category>("todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return DISHES.filter((d) => (active === "todos" ? true : d.category === active)).filter((d) =>
      query.trim() === "" ? true : d.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [active, query]);

  return (
    <div className="min-h-screen sushi-root">
      <style>{`
        .sushi-root {
          --k-bg: #0a0a0b;
          --k-panel: #131316;
          --k-ink: #f5f0e6;
          --k-mute: #8a8a92;
          --k-red: #d1252b;
          --k-red-soft: #ff3d43;
          --k-gold: #c9a86a;
          --k-border: rgba(255,255,255,0.08);
          background: var(--k-bg);
          color: var(--k-ink);
          font-family: "Inter", system-ui, sans-serif;
        }
        .sushi-root h1, .sushi-root h2, .sushi-root h3 { font-family: "Anton", Impact, sans-serif; letter-spacing: 0.02em; }
        .k-jp { font-family: "Caveat", cursive; color: var(--k-red-soft); }
        .k-card { background: var(--k-panel); border: 1px solid var(--k-border); }
        .k-btn-red { background: var(--k-red); color: white; }
        .k-btn-red:hover { background: var(--k-red-soft); }
        .k-chip-active { background: var(--k-red); color: white; border-color: var(--k-red); }
        .k-price { color: var(--k-gold); }
        .k-tag-chef { background: var(--k-gold); color: #1a1a1a; }
        .k-tag-nuevo { background: var(--k-red); color: white; }
        .k-tag-picante { background: #ff6a00; color: white; }
        .k-hero-overlay {
          background: linear-gradient(180deg, rgba(10,10,11,0.4) 0%, rgba(10,10,11,0.85) 70%, var(--k-bg) 100%);
        }
      `}</style>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md" style={{ background: "rgba(10,10,11,0.8)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/sushi" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest">黒</span>
            <span className="text-xl font-black tracking-widest">KUROI</span>
          </Link>
          <nav className="hidden gap-8 text-sm uppercase tracking-widest text-white/70 md:flex">
            <a href="#carta" className="hover:text-white">Carta</a>
            <a href="#galeria" className="hover:text-white">Galería</a>
            <a href="#historia" className="hover:text-white">Historia</a>
            <a href="#reserva" className="hover:text-white">Reservas</a>
          </nav>
          <a href="#reserva" className="k-btn-red rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest">Reservar</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Selección de nigiri y maki premium sobre pizarra negra"
            className="absolute inset-0 h-full w-full object-cover"
            width={1024}
            height={1024}
          />
          <div className="k-hero-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-end px-4 pb-20">
            <span className="k-jp text-3xl md:text-4xl">寿司の芸術</span>
            <h1 className="mt-2 max-w-3xl text-6xl leading-none md:text-8xl">
              El arte del <span style={{ color: "var(--k-red-soft)" }}>corte</span> perfecto
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Omakase de 12 tiempos, nigiri con arroz templado y makis de autor. Pescado seleccionado a diario en el
              corazón de Miraflores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#carta" className="k-btn-red rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest">
                Ver Carta
              </a>
              <a href="#reserva" className="rounded-full border border-white/30 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/10">
                Reservar Mesa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Strip */}
      <section className="border-y border-white/5" style={{ background: "var(--k-panel)" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {[
            { jp: "新鮮", label: "Pescado del día" },
            { jp: "職人", label: "Chef Itamae" },
            { jp: "厳選", label: "Sake premium" },
            { jp: "静寂", label: "Barra íntima" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="k-jp text-3xl">{s.jp}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Carta */}
      <section id="carta" className="mx-auto max-w-7xl px-4 py-24">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="k-jp text-2xl">お品書き</span>
            <h2 className="mt-1 text-5xl md:text-6xl">Nuestra Carta</h2>
            <p className="mt-3 max-w-lg text-white/60">
              Filtra por categoría o busca tu pieza favorita. Precios en soles.
            </p>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pieza…"
            aria-label="Buscar plato"
            className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest transition ${
                active === c.id ? "k-chip-active" : "text-white/70 hover:bg-white/5"
              }`}
              aria-pressed={active === c.id}
            >
              <span className="k-jp mr-2 text-base" style={{ color: active === c.id ? "white" : undefined }}>{c.jp}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <article key={d.id} className="k-card group overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {d.tag && (
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      d.tag === "chef" ? "k-tag-chef" : d.tag === "nuevo" ? "k-tag-nuevo" : "k-tag-picante"
                    }`}
                  >
                    {d.tag === "chef" ? "Chef's pick" : d.tag}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl">{d.name}</h3>
                  <span className="k-price whitespace-nowrap text-xl font-bold">S/ {d.price}</span>
                </div>
                <p className="mt-2 text-sm text-white/60">{d.desc}</p>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-16 text-center text-white/40">Sin resultados para tu búsqueda.</p>
          )}
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="border-t border-white/5" style={{ background: "var(--k-panel)" }}>
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="mb-10 text-center">
            <span className="k-jp text-2xl">写真</span>
            <h2 className="mt-1 text-5xl md:text-6xl">Galería Visual</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { src: nigiriImg, alt: "Nigiri variado" },
              { src: makiImg, alt: "Dragon roll" },
              { src: sashimiImg, alt: "Sashimi de salmón" },
              { src: interiorImg, alt: "Interior del restaurante" },
              { src: ramenImg, alt: "Ramen tonkotsu" },
              { src: gyozaImg, alt: "Gyozas" },
              { src: heroImg, alt: "Tabla premium" },
              { src: sashimiImg, alt: "Corte de sashimi" },
            ].map((g, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl ${i === 0 || i === 5 ? "md:col-span-2 md:row-span-1" : ""}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square h-full w-full object-cover transition duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="mx-auto max-w-7xl px-4 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={interiorImg} alt="Interior íntimo de Kuroi con farolas rojas" loading="lazy" width={1024} height={1024} className="w-full object-cover" />
          </div>
          <div>
            <span className="k-jp text-2xl">物語</span>
            <h2 className="mt-1 text-5xl md:text-6xl">Tradición y filo</h2>
            <p className="mt-6 text-white/70">
              Kuroi nace del respeto por el itamae — el maestro detrás de la barra. Cada pieza se prepara al momento,
              con arroz templado a la temperatura del cuerpo y pescado que llega fresco cada mañana desde nuestros
              proveedores de confianza.
            </p>
            <p className="mt-4 text-white/60">
              La barra tiene solo 8 asientos. Ahí el chef presenta su omakase — «lo dejo en tus manos» — un viaje de
              12 tiempos que cambia según la marea y la temporada.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <div className="text-4xl font-black" style={{ color: "var(--k-red-soft)" }}>12</div>
                <div className="text-xs uppercase tracking-widest text-white/50">Tiempos omakase</div>
              </div>
              <div>
                <div className="text-4xl font-black" style={{ color: "var(--k-red-soft)" }}>8</div>
                <div className="text-xs uppercase tracking-widest text-white/50">Asientos barra</div>
              </div>
              <div>
                <div className="text-4xl font-black" style={{ color: "var(--k-red-soft)" }}>15+</div>
                <div className="text-xs uppercase tracking-widest text-white/50">Sakes de autor</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reserva */}
      <section id="reserva" className="border-t border-white/5" style={{ background: "var(--k-panel)" }}>
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <span className="k-jp text-2xl">住所</span>
              <h3 className="mt-1 text-3xl">Ubicación</h3>
              <p className="mt-3 text-white/60">Av. La Mar 1450<br />Miraflores, Lima</p>
            </div>
            <div>
              <span className="k-jp text-2xl">営業時間</span>
              <h3 className="mt-1 text-3xl">Horarios</h3>
              <p className="mt-3 text-white/60">
                Mar–Dom · 12:30–23:00<br />
                Vie–Sáb · hasta 00:30<br />
                Lunes cerrado
              </p>
            </div>
            <div>
              <span className="k-jp text-2xl">予約</span>
              <h3 className="mt-1 text-3xl">Reservas</h3>
              <p className="mt-3 text-white/60">
                +51 987 654 321<br />
                hola@kuroisushi.pe
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="tel:+51987654321"
                  className="k-btn-red inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest"
                  aria-label="Llamar a Kuroi Sushi"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
                  Llamar
                </a>
                <a
                  href="https://wa.me/51987654321?text=Hola%20Kuroi%2C%20quiero%20reservar%20una%20mesa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest text-white"
                  style={{ background: "#25D366" }}
                  aria-label="Reservar por WhatsApp"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.1-.3.2-.6 0-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.6-1.4-.8-2c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 1.9 3 4.7 4.2 2.8 1.1 2.8.7 3.3.7.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.8 2.9 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C3.9 15 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <span className="k-jp text-2xl">地図</span>
            <h3 className="mt-1 text-3xl">Cómo llegar</h3>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Ubicación de Kuroi Sushi en Miraflores"
                src="https://www.google.com/maps?q=Av.+La+Mar+1450,+Miraflores,+Lima,+Peru&output=embed"
                width="100%"
                height="420"
                style={{ border: 0, filter: "grayscale(0.4) contrast(1.1)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Av.+La+Mar+1450,+Miraflores,+Lima,+Peru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:bg-white/5"
              >
                Cómo llegar en Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/51987654321?text=Hola%20Kuroi%2C%20quiero%20reservar%20una%20mesa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition hover:scale-110"
        style={{ background: "#25D366" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.1-.3.2-.6 0-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.6-1.4-.8-2c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 1.9 3 4.7 4.2 2.8 1.1 2.8.7 3.3.7.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.8 2.9 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C3.9 15 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/></svg>
      </a>

      <footer className="border-t border-white/5 py-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Kuroi Sushi · Miraflores, Lima
      </footer>
    </div>
  );
}
