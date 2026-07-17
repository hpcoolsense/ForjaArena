"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { asset, cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/reveal";
import { AnimatedNumber } from "@/components/ui/animated-number";

/* ════════════ Paleta corporativa ════════════
   Carbón #1D1D1B (texto) · Gris #979797 · Rojo #E21F17 · Fondo gris claro #e1e1df */

const img = (name: string) => asset(`/salon/${name}`);

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E21F17] focus-visible:ring-offset-2";
const WHATSAPP = "5493513905573";

/* ─── Slides del carrusel principal (foto + tipo de evento) ───
   Regla del cliente: acá van TODAS las fotos de EVENT_TYPES y GALLERY (el hero las pasa en B&N vía grayscale). */
const SLIDES = [
  { src: img("congreso-multitud.jpg"), type: "Congresos" },
  { src: img("feria-stands.jpg"), type: "Ferias & Expos" },
  { src: img("expo-autos.jpg"), type: "Salones & Muestras" },
  { src: img("gala-mesas.jpg"), type: "Eventos de Gala" },
  { src: img("congreso-auditorio.jpg"), type: "Convenciones" },
  { src: img("fiesta-01.jpg"), type: "Fiestas & Recitales" },
  { src: img("expo-stands-aereo.jpg"), type: "Exposiciones" },
  { src: img("fiesta-02.jpg"), type: "Shows en Vivo" },
  { src: img("feria-industrial.jpg"), type: "Ferias Industriales" },
  { src: img("fiesta-03.jpg"), type: "Electrónica" },
  { src: img("gala-catering.jpg"), type: "Celebraciones" },
  { src: img("fiesta-04.jpg"), type: "Festivales" },
  { src: img("feria-metal.jpg"), type: "Industria & Metal" },
];

/* ─── Tipos de evento (potencial del salón) ─── */
const EVENT_TYPES = [
  { tag: "Congresos", title: "Congresos & Convenciones", desc: "Auditorio para hasta 900 personas con escenario, pantallas gigantes y producción integral.", src: img("congreso-multitud.jpg") },
  { tag: "Ferias", title: "Ferias & Exposiciones", desc: "Hasta 120 stands modulares en planta libre. Montaje y desmontaje sin restricciones.", src: img("feria-stands.jpg") },
  { tag: "Expos", title: "Salones & Muestras", desc: "Espacio ideal para salones del automóvil, muestras industriales y lanzamientos de marca.", src: img("expo-autos.jpg") },
  { tag: "Galas", title: "Eventos de Gala", desc: "Cenas de gala, fiestas y celebraciones con catering de primer nivel y ambientación a medida.", src: img("gala-mesas.jpg") },
  { tag: "Fiestas", title: "Fiestas & Recitales", desc: "Miles de personas ya pasaron por el salón de eventos con más trayectoria de Córdoba.", src: img("fiesta-01.jpg") },
  { tag: "Corporativo", title: "Eventos Corporativos", desc: "Lanzamientos, capacitaciones y reuniones de empresa a cualquier escala.", src: img("congreso-auditorio.jpg") },
];

/* ─── Datos importantes (contadores) ─── */
const STATS = [
  { value: 10000, prefix: "", suffix: " m²", label: "Superficie cubierta" },
  { value: 12000, prefix: "", suffix: "", label: "Personas de capacidad" },
  { value: 400, prefix: "+", suffix: "", label: "Lugares de estacionamiento" },
  { value: 800, prefix: "+", suffix: "", label: "Eventos realizados" },
];

/* ─── Ficha técnica ─── */
const SPECS = [
  { k: "Ubicación", v: "Mauricio Yadarola 1699, Córdoba" },
  { k: "Superficie cubierta", v: "10.000 m²" },
  { k: "Capacidad máxima", v: "12.000 personas" },
  { k: "Niveles", v: "2 plantas operativas" },
  { k: "Stands montables", v: "Hasta 120 módulos" },
  { k: "Planta", v: "Libre, sin columnas centrales" },
  { k: "Estacionamiento", v: "+400 lugares dentro del predio" },
  { k: "Accesos", v: "Acceso vehicular amplio para montaje" },
];

/* ─── Servicios (ampliados) ─── */
const SERVICES = [
  { title: "Montaje & Stands", desc: "Armado integral de ferias y expos: stands modulares, tabiquería, señalética y mobiliario.", d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
  { title: "Catering & Gastronomía", desc: "Cocina de autor, barras premium y servicio de mozos para galas, cenas y eventos corporativos.", d: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
  { title: "Producción Técnica", desc: "Sonido de alta potencia, iluminación profesional, pantallas LED y escenarios a medida.", d: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" },
  { title: "Seguridad & Logística", desc: "Control de acceso, personal de seguridad y coordinación logística completa.", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
  { title: "Estacionamiento propio", desc: "Amplia playa de estacionamiento dentro del predio para asistentes y proveedores.", d: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0-11.25h5.25m-5.25 0v11.25m0-11.25H6.375a1.125 1.125 0 00-1.125 1.125v9m13.5-9V9.75" },
  { title: "Climatización & Confort", desc: "Ambientes climatizados y acondicionados para eventos cómodos en cualquier época del año.", d: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" },
  { title: "Conectividad & WiFi", desc: "Internet de alta velocidad para streaming, acreditaciones y expositores conectados.", d: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" },
  { title: "Acreditación & Registro", desc: "Sistema de acreditación, control de acceso y registro de asistentes para congresos y ferias.", d: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" },
  { title: "Streaming & Grabación", desc: "Transmisión en vivo y grabación profesional de tu evento para llegar más lejos.", d: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" },
  { title: "Servicio de limpieza", desc: "Equipo de limpieza y mantenimiento antes, durante y después de cada evento para que todo esté impecable.", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" },
  { title: "Servicio Médico y Ambulancia", desc: "Cobertura médica en el predio con personal de salud y ambulancia disponible durante todo el evento.", d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
];

/* ─── Galería del espacio (todas las fotos reales) ─── */
const GALLERY = [
  // Fiestas / electrónica — protagonistas, van primero
  { src: img("fiesta-01.jpg"), caption: "Fiesta electrónica" },
  { src: img("fiesta-02.jpg"), caption: "Show en vivo" },
  { src: img("fiesta-03.jpg"), caption: "Show de láseres" },
  { src: img("fiesta-04.jpg"), caption: "Festival a pleno" },
  { src: img("congreso-auditorio.jpg"), caption: "Auditorio montado" },
  { src: img("congreso-multitud.jpg"), caption: "Congreso a sala llena" },
  { src: img("expo-stands-aereo.jpg"), caption: "Vista aérea de stands" },
  { src: img("feria-stands.jpg"), caption: "Feria de stands" },
  { src: img("expo-autos.jpg"), caption: "Salón del automóvil" },
  { src: img("feria-industrial.jpg"), caption: "Feria industrial" },
  { src: img("feria-metal.jpg"), caption: "Expo metalmecánica" },
  { src: img("gala-mesas.jpg"), caption: "Gala con mesas" },
  { src: img("gala-catering.jpg"), caption: "Servicio de catering" },
];

/* ─── Eventos pasados (sin fechas) ─── */
const EVENTS = [
  { title: "EXPO AUTOS CÓRDOBA", type: "Expo", info: "Salón del automóvil · 3 días", src: img("expo-autos.jpg"), accent: false, featured: true },
  { title: "CONGRESO MÉDICO PROVINCIAL", type: "Congreso", info: "+1.500 asistentes", src: img("congreso-multitud.jpg"), accent: false, featured: false },
  { title: "FERIA METALMECÁNICA", type: "Feria", info: "Industria & tecnología", src: img("feria-metal.jpg"), accent: false, featured: false },
  { title: "NOCHE DE GALA SOLIDARIA", type: "Gala", info: "Cena & show en vivo", src: img("gala-mesas.jpg"), accent: false, featured: false },
  { title: "FERIA DEL EMPRENDEDOR", type: "Feria", info: "Networking & stands", src: img("feria-stands.jpg"), accent: false, featured: false },
];

const NAV_LINKS = [
  { label: "Espacio", href: "#espacio" },
  { label: "Datos", href: "#datos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Eventos", href: "#eventos" },
  { label: "Contacto", href: "#contacto" },
];

const MARQUEE = ["Congresos", "Ferias", "Exposiciones", "Galas", "Recitales", "Convenciones", "Lanzamientos", "Fiestas", "Corporativos"];

/* ════════════════════════ NAVBAR ════════════════════════ */
function SalonNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkColor = scrolled ? "text-[#1D1D1B]" : "text-white";

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn("fixed right-0 top-0 z-[70] flex h-14 w-14 items-center justify-center md:hidden", FOCUS)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1B" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className={cn("h-0.5 w-5 transition-colors", scrolled ? "bg-[#1D1D1B]" : "bg-white")} />
            <span className={cn("h-0.5 w-5 transition-colors", scrolled ? "bg-[#1D1D1B]" : "bg-white")} />
            <span className={cn("h-0.5 w-5 transition-colors", scrolled ? "bg-[#1D1D1B]" : "bg-white")} />
          </div>
        )}
      </button>

      <nav className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "border-b border-black/10 bg-[#e1e1df]/90 backdrop-blur-xl" : "bg-transparent")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 md:py-4">
          <a href="#top" className={cn("relative h-9 w-28 shrink-0 rounded sm:h-10 sm:w-32", FOCUS)} aria-label="FORJA ARENA — inicio">
            <Image src={scrolled ? asset("/logo-forja-dark-star.png") : asset("/logo-forja-light-star.png")} alt="FORJA ARENA" fill className="object-contain object-left transition-all" unoptimized />
          </a>

          <div className="hidden items-center gap-6 md:flex lg:gap-7">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={cn("rounded text-sm font-medium transition-colors hover:text-[#E21F17]", linkColor, FOCUS)}>
                {l.label}
              </a>
            ))}
            <a href="#contacto" className={cn("rounded-md bg-[#E21F17] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c11910]", FOCUS)}>Reservar</a>
          </div>
        </div>
      </nav>

      <div className={cn("fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[#e1e1df] transition-all duration-500 md:hidden", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn("rounded font-[family-name:var(--font-heading)] text-3xl font-semibold text-[#1D1D1B] transition-colors hover:text-[#E21F17]", FOCUS)}>
            {l.label}
          </a>
        ))}
        <a href="#contacto" onClick={() => setOpen(false)} className={cn("mt-2 rounded-md bg-[#E21F17] px-8 py-3 text-base font-semibold text-white", FOCUS)}>Reservar</a>
      </div>
    </>
  );
}

/* ════════════════════════ HERO CARRUSEL ════════════════════════ */
function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-[#1D1D1B]">
      {SLIDES.map((s, i) => (
        <div key={s.src + i} className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-in-out", i === idx ? "opacity-100" : "opacity-0")} aria-hidden={i !== idx}>
          <div className="relative h-full w-full transition-transform duration-[6000ms] ease-out" style={{ transform: i === idx ? "scale(1.1)" : "scale(1)" }}>
            <Image src={s.src} alt={`FORJA ARENA — ${s.type}`} fill className="object-cover grayscale" priority={i === 0} unoptimized />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        </div>
      ))}

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="w-[220px] sm:w-[300px] md:w-[340px]">
          <Image src={asset("/logo-forja-light-star.png")} alt="FORJA ARENA" width={480} height={366} className="w-full drop-shadow-2xl" priority unoptimized />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-6 text-xs uppercase tracking-[0.35em] text-white/70 sm:text-sm">
          El espacio ideal para
        </motion.p>

        <div className="mt-2 flex h-14 shrink-0 items-center justify-center sm:h-[4.5rem] md:h-24">
          <AnimatePresence mode="wait">
            <motion.span
              key={SLIDES[idx].type}
              initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-heading)] text-3xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {SLIDES[idx].type.split(" & ")[0]}
              {SLIDES[idx].type.includes(" & ") && <span className="text-[#E21F17]"> & {SLIDES[idx].type.split(" & ")[1]}</span>}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.8 }} className="mt-5 max-w-xl text-sm text-white/80 sm:text-base">
          10.000 m² de versatilidad industrial en el corazón de Córdoba.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#contacto" className={cn("w-full rounded-md bg-[#E21F17] px-8 py-3.5 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.03] sm:w-auto", FOCUS)}>Reservá tu evento</a>
          <a href="#espacio" className={cn("w-full rounded-md border border-white/40 px-8 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#1D1D1B] sm:w-auto", FOCUS)}>Conocé el espacio</a>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5">
          {SLIDES.map((s, i) => (
            <button key={s.src + i} onClick={() => setIdx(i)} aria-label={`Ver ${s.type}`} className={cn("h-1.5 rounded-full transition-all duration-500", i === idx ? "w-7 bg-[#E21F17]" : "w-1.5 bg-white/50 hover:bg-white/80")} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════ MARQUEE ════════════════════════ */
function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-black/10 bg-[#1D1D1B] py-4">
      <div className="flex w-max" style={{ animation: "marquee 32s linear infinite" }}>
        {row.map((w, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="px-6 font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider text-white sm:text-xl">{w}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#E21F17]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════ SECTION LABEL ════════════════════════ */
function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-2 w-2 bg-[#E21F17]" />
      <span className={cn("text-[11px] font-semibold uppercase tracking-[0.25em]", dark ? "text-[#a9a9a9]" : "text-[#4f4f4f]")}>{children}</span>
    </div>
  );
}

/* ════════════════════════ INTRO ════════════════════════ */
function Intro() {
  return (
    <section id="espacio" className="bg-[#e1e1df] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal><div className="flex justify-center"><SectionLabel>El salón</SectionLabel></div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-[#1D1D1B] sm:text-5xl md:text-6xl">
            Un espacio único<br />para tu evento
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#4f4f4f] sm:text-lg">
            FORJA ARENA es un salón industrial de gran escala que se transforma según lo que
            necesites: de un congreso para miles a una feria con cientos de stands, de una gala
            elegante a un recital. Versatilidad, infraestructura y producción en un mismo lugar.
            Cuenta con climatización frío-calor y dos portones de ingreso de carga de amplias
            dimensiones que agilizan el armado y desarme de los eventos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════ VERSATILIDAD ════════════════════════ */
function Versatilidad() {
  return (
    <section className="bg-[#e1e1df] pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_TYPES.map((t, i) => (
            <Reveal key={t.title} delay={0.05 * i}>
              <div className="group relative h-80 overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10">
                <Image src={t.src} alt={`${t.title} en FORJA ARENA`} fill className="object-cover transition-transform duration-[800ms] group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1B] via-[#1D1D1B]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition-transform duration-500 group-hover:translate-y-0">
                  <span className="inline-block rounded-full bg-[#E21F17] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{t.tag}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-bold text-white">{t.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/90">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════ DATOS IMPORTANTES ════════════════════════ */
function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <span ref={ref} className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white whitespace-nowrap sm:text-4xl md:text-5xl">
      {prefix}
      {inView ? <AnimatedNumber value={value} format={(n) => n.toLocaleString("es-AR")} /> : "0"}
      <span className="text-[#E21F17]">{suffix}</span>
    </span>
  );
}

function Datos() {
  return (
    <section id="datos" className="bg-[#1D1D1B] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><SectionLabel dark>Datos del salón</SectionLabel></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-white sm:text-5xl">
            La escala que tu evento necesita
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-8 border-b border-white/10 pb-12 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={0.08 * i}>
              <div className="text-center">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#a9a9a9]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-0 sm:grid-cols-2">
          {SPECS.map((sp, i) => (
            <Reveal key={sp.k} delay={0.04 * i}>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
                <span className="text-sm text-[#a9a9a9]">{sp.k}</span>
                <span className="text-right text-sm font-semibold text-white">{sp.v}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════ SERVICIOS ════════════════════════ */
function Servicios() {
  return (
    <section id="servicios" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal><SectionLabel>Llave en mano</SectionLabel></Reveal>
          <Reveal delay={0.1}><h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-[#1D1D1B] sm:text-5xl">Todo resuelto en un solo lugar</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-4 text-base leading-relaxed text-[#4f4f4f]">Coordinamos cada detalle para que solo te ocupes de disfrutar tu evento.</p></Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={0.04 * i}>
              <div className="group relative h-full overflow-hidden rounded-xl border border-black/5 bg-[#f4f4f3] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#E21F17]/30 hover:shadow-lg hover:shadow-black/5">
                <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[#E21F17] transition-transform duration-500 group-hover:scale-x-100" />
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1D1D1B] text-white transition-colors group-hover:bg-[#E21F17]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d={s.d} /></svg>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#1D1D1B]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4f4f4f]">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════ GALERÍA (lightbox) ════════════════════════ */
function Galeria() {
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;

  // auto-avance mientras está abierto
  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => setOpen((i) => (i === null ? null : (i + 1) % GALLERY.length)), 3000);
    return () => clearInterval(t);
  }, [isOpen]);

  // teclado + bloqueo de scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % GALLERY.length));
      else if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + GALLERY.length) % GALLERY.length));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [isOpen]);

  const go = (d: number) => setOpen((i) => (i === null ? null : (i + d + GALLERY.length) % GALLERY.length));

  return (
    <section id="galeria" className="bg-[#e1e1df] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal><SectionLabel>El espacio en acción</SectionLabel></Reveal>
          <Reveal delay={0.1}><h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-[#1D1D1B] sm:text-5xl">Galería del salón</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-4 text-base text-[#4f4f4f]">Tocá cualquier imagen para verla en grande.</p></Reveal>
        </div>

        {/* Miniaturas chicas */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {GALLERY.map((g, i) => (
            <Reveal key={g.caption} delay={0.03 * i}>
              <button onClick={() => setOpen(i)} aria-label={`Ampliar: ${g.caption}`} className={cn("group relative aspect-square w-full overflow-hidden rounded-lg shadow-sm", FOCUS)}>
                <Image src={g.src} alt={g.caption} fill sizes="(min-width:1024px) 200px, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-[#1D1D1B]/0 transition-colors duration-300 group-hover:bg-[#1D1D1B]/30" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1D1D1B]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 sm:p-8"
            onClick={() => setOpen(null)}
          >
            <button onClick={() => setOpen(null)} aria-label="Cerrar galería" className={cn("absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white", FOCUS)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Anterior" className={cn("absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white sm:flex", FOCUS)}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Siguiente" className={cn("absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white sm:flex", FOCUS)}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-[#111]">
                <AnimatePresence mode="wait">
                  <motion.div key={open} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                    <Image src={GALLERY[open].src} alt={GALLERY[open].caption} fill className="object-contain" unoptimized />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{GALLERY[open].caption}</span>
                <span className="text-xs text-white/60">{open + 1} / {GALLERY.length}</span>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {GALLERY.map((g, i) => (
                  <button key={g.caption} onClick={(e) => { e.stopPropagation(); setOpen(i); }} aria-label={`Ver ${g.caption}`} className={cn("h-1.5 rounded-full transition-all", i === open ? "w-6 bg-[#E21F17]" : "w-1.5 bg-white/40 hover:bg-white/70")} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ════════════════════════ PRÓXIMOS EVENTOS ════════════════════════ */
function ProximosEventos() {
  const featured = EVENTS.find((e) => e.featured)!;
  const rest = EVENTS.filter((e) => !e.featured);

  const TypeTag = ({ type, accent }: { type: string; accent: boolean }) => (
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", accent ? "bg-[#E21F17] text-white" : "bg-white/90 text-[#1D1D1B]")}>{type}</span>
  );

  return (
    <section id="eventos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><SectionLabel>Agenda</SectionLabel></Reveal>
            <Reveal delay={0.1}><h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-[#1D1D1B] sm:text-5xl">Eventos pasados</h2></Reveal>
          </div>
          <Reveal delay={0.15}><p className="max-w-xs text-sm text-[#4f4f4f]">Congresos, ferias, expos y galas que ya pasaron por FORJA.</p></Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="group mt-12 overflow-hidden rounded-2xl border border-black/5 bg-[#f4f4f3] transition-shadow duration-500 hover:shadow-xl hover:shadow-black/10">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]">
                <Image src={featured.src} alt={featured.title} fill className="object-cover transition-transform duration-[800ms] group-hover:scale-105" unoptimized />
                <div className="absolute left-4 top-4"><TypeTag type={featured.type} accent={featured.accent} /></div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#1D1D1B] sm:text-4xl">{featured.title}</h3>
                <p className="mt-2 text-base text-[#4f4f4f]">{featured.info}</p>
                <a href="#contacto" className={cn("mt-6 inline-block w-fit rounded-md bg-[#1D1D1B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E21F17]", FOCUS)}>Más información</a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((e, i) => (
            <Reveal key={e.title} delay={0.05 * i}>
              <div className="group overflow-hidden rounded-xl border border-black/5 bg-[#f4f4f3] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-black/10">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={e.src} alt={e.title} fill className="object-cover transition-transform duration-[800ms] group-hover:scale-110" unoptimized />
                  <div className="absolute left-3 top-3"><TypeTag type={e.type} accent={e.accent} /></div>
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#1D1D1B]">{e.title}</h3>
                  <p className="mt-1 text-sm text-[#4f4f4f]">{e.info}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════ CONTACTO ════════════════════════ */
function Contacto() {
  const contactItems = [
    { label: "Mauricio Yadarola 1699, Córdoba", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
    { label: "info@forjaarena.com", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
    { label: "+54 351 390 5573", icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" },
  ];

  return (
    <section id="contacto" className="bg-[#e1e1df] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal><SectionLabel>Contacto</SectionLabel></Reveal>
            <Reveal delay={0.1}><h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-[#1D1D1B] sm:text-5xl">Reservá tu próximo <span className="text-[#E21F17]">evento</span></h2></Reveal>
            <Reveal delay={0.2}><p className="mt-5 max-w-md text-base leading-relaxed text-[#4f4f4f]">Contanos qué tenés en mente —un congreso, una feria, una gala o un show— y armamos una propuesta a tu medida.</p></Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col gap-4">
                {contactItems.map((c) => (
                  <div key={c.label} className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#E21F17]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                    </div>
                    <span className="break-words text-[15px] text-[#1D1D1B]">{c.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-8 flex gap-3">
                <a href="https://www.instagram.com/forjaarena?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram de FORJA ARENA"
                  className={cn("flex h-11 w-11 items-center justify-center rounded-lg border border-black/15 text-[#1D1D1B] transition-all hover:-translate-y-0.5 hover:border-[#E21F17] hover:bg-[#E21F17] hover:text-white", FOCUS)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://maps.app.goo.gl/wK9rv7NXp4wiSxsi8" target="_blank" rel="noopener noreferrer"
                  className={cn("flex h-11 items-center gap-2 rounded-lg border border-black/15 px-4 text-sm font-semibold text-[#1D1D1B] transition-all hover:border-[#E21F17] hover:text-[#E21F17]", FOCUS)}>Cómo llegar</a>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-5">
            <Reveal delay={0.2} direction="right">
              <div className="rounded-xl border border-black/10 bg-white p-6">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#1D1D1B]">Pedí tu cotización</h3>
                <p className="mt-1 text-sm text-[#4f4f4f]">Dejanos tu mail y te contactamos en 24hs.</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input type="email" placeholder="tu@email.com" aria-label="Tu email"
                    className="flex-1 rounded-md border border-black/15 bg-[#f4f4f3] px-4 py-3 text-sm text-[#1D1D1B] placeholder:text-[#979797] focus:border-[#E21F17] focus:outline-none focus:ring-2 focus:ring-[#E21F17] sm:py-2.5" />
                  <button className={cn("shrink-0 rounded-md bg-[#E21F17] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c11910]", FOCUS)}>Enviar</button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.3} direction="right">
              <div className="overflow-hidden rounded-xl border border-black/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d94947.81549803453!2d-64.21453060348274!3d-31.43782433554744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432981a70da1449%3A0xc21fbf594868a9e6!2sForja%20Centro%20de%20Eventos!5e0!3m2!1ses-419!2sar!4v1779897837965!5m2!1ses-419!2sar"
                  width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación FORJA ARENA" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════ FOOTER ════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#1D1D1B]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-10 sm:flex-row sm:justify-between sm:px-8">
        <div className="relative h-10 w-32">
          <Image src={asset("/logo-forja-light-star.png")} alt="FORJA ARENA" fill className="object-contain object-left opacity-90" unoptimized />
        </div>
        <span className="text-sm text-[#a9a9a9]" suppressHydrationWarning>© {new Date().getFullYear()} FORJA ARENA · Centro de Eventos · Córdoba, Argentina</span>
      </div>
    </footer>
  );
}

/* ════════════════════════ WHATSAPP ════════════════════════ */
function WhatsAppFloat() {
  return (
    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-[#25d366]/30 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

/* ════════════════════════ PAGE ════════════════════════ */
export default function Salon() {
  return (
    <div className="min-h-screen bg-[#e1e1df]">
      <SalonNav />
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <Versatilidad />
        <Datos />
        <Servicios />
        <Galeria />
        <ProximosEventos />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
