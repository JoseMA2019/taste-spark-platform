import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import heroImg from "@/assets/ceviche-hero.jpg";
import clasicoImg from "@/assets/ceviche-clasico.jpg";
import mixtoImg from "@/assets/ceviche-mixto.jpg";
import lecheImg from "@/assets/leche-tigre.jpg";
import arrozImg from "@/assets/arroz-mariscos.jpg";
import jaleaImg from "@/assets/jalea.jpg";

const SITE_URL = "https://taste-spark-platform.lovable.app";
const PAGE_URL = `${SITE_URL}/cevicheria`;
const PAGE_TITLE = "Marea Azul · Cevichería peruana fresca del día";
const PAGE_DESC =
  "Ceviches, tiraditos, jaleas y arroz con mariscos preparados con pesca del día. Cevichería peruana con sabor auténtico y delivery en Lima.";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: "Ceviches" | "Calientes" | "Piqueos";
  img: string;
  tag?: string;
};

const PRODUCTS: Product[] = [
  { id: "c1", name: "Ceviche Clásico", desc: "Corvina fresca, limón, cebolla morada, ají limo, camote y choclo.", price: 38, category: "Ceviches", img: clasicoImg, tag: "Más pedido" },
  { id: "c2", name: "Ceviche Mixto", desc: "Pescado, pulpo, calamar y langostinos en leche de tigre casera.", price: 45, category: "Ceviches", img: mixtoImg },
  { id: "c3", name: "Leche de Tigre", desc: "Shot cremoso con trozos de pescado y langostinos. Levanta muertos.", price: 22, category: "Piqueos", img: lecheImg, tag: "Chef's pick" },
  { id: "c4", name: "Arroz con Mariscos", desc: "Arroz cremoso al sillao con mariscos frescos del día.", price: 42, category: "Calientes", img: arrozImg },
  { id: "c5", name: "Jalea Mixta", desc: "Mariscos crocantes, yuca frita, salsa criolla y crema de rocoto.", price: 55, category: "Calientes", img: jaleaImg, tag: "Para 2" },
  { id: "c6", name: "Tiradito Nikkei", desc: "Láminas de pescado en salsa acevichada con toque de sillao y ajonjolí.", price: 40, category: "Ceviches", img: clasicoImg },
];

const CATEGORIES = ["Todos", "Ceviches", "Calientes", "Piqueos"] as const;

export const Route = createFileRoute("/cevicheria")({
  component: CevicheriaPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      {
        name: "keywords",
        content:
          "cevichería, ceviche peruano, tiradito, leche de tigre, arroz con mariscos, jalea, comida peruana, delivery Lima",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:site_name", content: "Marea Azul" },
      { property: "og:locale", content: "es_PE" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: `${SITE_URL}/og-cevicheria.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Ceviche peruano fresco de Marea Azul" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
      { name: "twitter:image", content: `${SITE_URL}/og-cevicheria.jpg` },
      { name: "twitter:image:alt", content: "Ceviche peruano fresco de Marea Azul" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "@id": `${PAGE_URL}#restaurant`,
          name: "Marea Azul",
          description: PAGE_DESC,
          servesCuisine: ["Peruvian", "Seafood"],
          priceRange: "$$",
          url: PAGE_URL,
          image: [`${SITE_URL}/og-cevicheria.jpg`],
          telephone: "+51-999-888-777",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. del Mar 245",
            addressLocality: "Miraflores",
            addressRegion: "Lima",
            postalCode: "15074",
            addressCountry: "PE",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -12.1219,
            longitude: -77.0298,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "11:00",
              closes: "17:00",
            },
          ],
          acceptsReservations: "True",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "412",
            bestRating: "5",
            worstRating: "1",
          },
          hasMenu: {
            "@type": "Menu",
            name: "Carta Marea Azul",
            hasMenuSection: (["Ceviches", "Calientes", "Piqueos"] as const).map((section) => ({
              "@type": "MenuSection",
              name: section,
              hasMenuItem: PRODUCTS.filter((p) => p.category === section).map((p) => ({
                "@type": "MenuItem",
                name: p.name,
                description: p.desc,
                offers: {
                  "@type": "Offer",
                  price: p.price.toFixed(2),
                  priceCurrency: "PEN",
                  availability: "https://schema.org/InStock",
                },
              })),
            })),
          },
        }),
      },
    ],
  }),
});

function CevicheriaPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = useMemo(
    () => (cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat],
  );
  const total = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id);
        return sum + (p ? p.price * qty : 0);
      }, 0),
    [cart],
  );
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const { [id]: _, ...rest } = c;
      return n <= 0 ? rest : { ...c, [id]: n };
    });

  return (
    <main className="min-h-screen text-foreground" style={{ background: "linear-gradient(180deg, #041e2e 0%, #062a3f 60%, #041a26 100%)" }}>
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#031624]/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <span className="text-3xl">🌊</span>
            <span className="font-[Anton] tracking-wider text-2xl text-white">MAREA AZUL</span>
          </a>
          <nav className="hidden md:flex gap-8 text-sm text-cyan-100/80">
            <a href="#menu" className="hover:text-cyan-300">Carta</a>
            <a href="#historia" className="hover:text-cyan-300">Historia</a>
            <a href="#contacto" className="hover:text-cyan-300">Contacto</a>
          </nav>
          <a href="#menu" className="rounded-full px-5 py-2 text-sm font-semibold text-[#031624] bg-gradient-to-r from-lime-300 to-cyan-300 hover:opacity-90">
            Pedir ahora
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-[Caveat] text-3xl text-lime-300">Directo del mar 🌊</p>
            <h1 id="hero-title" className="font-[Anton] text-5xl md:text-7xl leading-[0.95] text-white mt-3">
              Fresco. Ácido.<br />
              <span className="bg-gradient-to-r from-lime-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">Peruano de verdad.</span>
            </h1>
            <p className="mt-6 text-cyan-100/80 text-lg max-w-lg">
              Pesca del día, limón de Chulucanas y ají recién molido. Cada ceviche
              lleva la receta de la abuela y el bravío del Pacífico.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="rounded-full px-7 py-3 font-semibold text-[#031624] bg-lime-300 hover:bg-lime-200 transition">
                Ver carta
              </a>
              <a href="#contacto" className="rounded-full px-7 py-3 font-semibold text-white border border-white/20 hover:bg-white/5">
                Reservar mesa
              </a>
            </div>
            <div className="mt-10 flex gap-8 text-cyan-100/70 text-sm">
              <div><span className="block text-2xl font-[Anton] text-lime-300">4.9★</span>412 reseñas</div>
              <div><span className="block text-2xl font-[Anton] text-lime-300">100%</span>Pesca del día</div>
              <div><span className="block text-2xl font-[Anton] text-lime-300">25′</span>Delivery Lima</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-cyan-400/20 blur-3xl" />
            <img
              src={heroImg}
              alt="Ceviche peruano fresco con corvina, limón, cebolla morada, camote y choclo"
              width={1024}
              height={1024}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="relative rounded-3xl shadow-2xl ring-1 ring-white/10 rotate-2"
            />
            <div className="absolute -bottom-4 -left-4 bg-lime-300 text-[#031624] rounded-2xl px-4 py-3 font-[Anton] tracking-wide shadow-xl rotate-[-4deg]">
              Pesca<br />del día
            </div>
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="border-y border-white/5 bg-[#031624]/60">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-8 text-cyan-100/80 text-sm">
          {[
            ["🕚", "Lun a Dom", "11:00 - 17:00"],
            ["📍", "Miraflores", "Av. del Mar 245"],
            ["🛵", "Delivery", "En 25 minutos"],
            ["📞", "Reservas", "+51 999 888 777"],
          ].map(([icon, title, val]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-white font-semibold">{title}</p>
                <p>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="font-[Caveat] text-2xl text-lime-300">Nuestra carta</p>
          <h2 className="font-[Anton] text-4xl md:text-6xl text-white">SABORES DEL PACÍFICO</h2>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                cat === c ? "bg-lime-300 text-[#031624]" : "bg-white/5 text-cyan-100 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const qty = cart[p.id] ?? 0;
            return (
              <article key={p.id} className="group rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-lime-300/40 transition">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.name} - ${p.desc}`}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-lime-300 text-[#031624] text-xs font-bold px-3 py-1 rounded-full">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-[Anton] text-2xl text-white tracking-wide">{p.name}</h3>
                    <span className="font-[Anton] text-2xl text-lime-300">S/{p.price}</span>
                  </div>
                  <p className="text-sm text-cyan-100/70 mt-2">{p.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    {qty > 0 ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => sub(p.id)} aria-label={`Quitar ${p.name}`} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg">−</button>
                        <span className="text-white font-semibold w-6 text-center">{qty}</span>
                        <button onClick={() => add(p.id)} aria-label={`Añadir ${p.name}`} className="w-9 h-9 rounded-full bg-lime-300 text-[#031624] text-lg font-bold">+</button>
                      </div>
                    ) : (
                      <button onClick={() => add(p.id)} className="rounded-full px-4 py-2 text-sm font-semibold text-[#031624] bg-lime-300 hover:bg-lime-200">
                        Añadir al pedido
                      </button>
                    )}
                    <span className="text-xs text-cyan-100/50">{p.category}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* HISTORIA */}
      <section id="historia" className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <img src={mixtoImg} alt="Ceviche mixto en un bol de cerámica" width={1024} height={1024} loading="lazy" className="rounded-3xl ring-1 ring-white/10" />
        <div>
          <p className="font-[Caveat] text-2xl text-lime-300">Nuestra historia</p>
          <h2 className="font-[Anton] text-4xl md:text-5xl text-white mt-2">Tres generaciones frente al mar</h2>
          <p className="mt-4 text-cyan-100/80">
            Empezamos en 1978 con una carretilla en la Costa Verde. Hoy Marea Azul
            sigue eligiendo cada pescado en la caleta al amanecer. El limón se
            exprime al minuto, el ají se muele en batán y la leche de tigre se
            sirve helada, como debe ser.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ["46", "años de historia"],
              ["12", "pescadores aliados"],
              ["0km", "de intermediarios"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
                <p className="font-[Anton] text-3xl text-lime-300">{n}</p>
                <p className="text-xs text-cyan-100/70 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CART FLOAT */}
      {count > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-lime-300 text-[#031624] px-6 py-3 font-semibold shadow-2xl flex items-center gap-4">
          <span>🛒 {count} plato{count > 1 ? "s" : ""}</span>
          <span className="font-[Anton] text-xl">S/{total}</span>
          <button className="rounded-full bg-[#031624] text-lime-300 px-4 py-1.5 text-sm">Ir a pagar</button>
        </div>
      )}

      {/* FOOTER */}
      <footer id="contacto" className="bg-[#02121c] border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 text-cyan-100/80 text-sm">
          <div>
            <p className="font-[Anton] text-2xl text-white">MAREA AZUL</p>
            <p className="mt-3">Cevichería peruana con pesca del día, limón de Chulucanas y ají fresco.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Contacto</p>
            <p>Av. del Mar 245, Miraflores</p>
            <p>+51 999 888 777</p>
            <p>hola@mareaazul.pe</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Síguenos</p>
            <div className="flex gap-3">
              {["Instagram", "Facebook", "TikTok"].map((n) => (
                <a key={n} href="#" className="rounded-full bg-white/5 hover:bg-white/10 px-4 py-2">{n}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-cyan-100/40 pb-8">© {new Date().getFullYear()} Marea Azul · Todos los derechos reservados</div>
      </footer>
    </main>
  );
}
