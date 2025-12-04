"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CARD_HEIGHT = 228;

const murals = [
  {
    title: "Jardines de neón",
    location: "Monserrate",
    palette: ["#f3c742", "#1a1f2c", "#3bc3d1", "#f06d4f"],
    note: "Flores tropicales suspendidas sobre concreto lluvioso.",
  },
  {
    title: "Bruma sobre acero",
    location: "San Telmo",
    palette: ["#d9e4f5", "#5b6c94", "#101420", "#f7f3e9"],
    note: "Niebla y tranvías cruzando un cielo eléctrico.",
  },
  {
    title: "Ritmo selvático",
    location: "Xochimilco",
    palette: ["#142013", "#39a96b", "#fbbf24", "#f97316"],
    note: "Guacamayas escondidas entre hojas metálicas.",
  },
  {
    title: "Azoteas en fuga",
    location: "Providencia",
    palette: ["#0b1724", "#3f5b8b", "#9ac8fa", "#f2f5fb"],
    note: "Sombras largas y antenas que se repiten como notas de jazz.",
  },
  {
    title: "Mar rojo",
    location: "Barrio Cordial",
    palette: ["#f25555", "#0f1218", "#1f5a92", "#f6e7cf"],
    note: "Oleaje que recuerda grafitis viejos en barcos oxidados.",
  },
  {
    title: "Línea estelar",
    location: "Núcleo Centro",
    palette: ["#141218", "#2f1e54", "#9f7aea", "#f1e4ff"],
    note: "Un mapamundi imaginario pintado a la luz morada de los letreros.",
  },
];

type Mural = (typeof murals)[number];

function Palette({ colors }: { colors: string[] }) {
  return (
    <div className="flex gap-1.5">
      {colors.map((color) => (
        <span
          key={color}
          className="h-3 w-8 rounded-full"
          style={{ backgroundColor: color }}
          aria-label={`Color ${color}`}
        />
      ))}
    </div>
  );
}

function MuralCard({ mural }: { mural: Mural }) {
  return (
    <article className="flex h-[200px] flex-col justify-between rounded-2xl border border-white/5 bg-white/10 p-5 text-white shadow-lg backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">{mural.location}</p>
          <h3 className="mt-1 text-xl font-semibold leading-tight">{mural.title}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[10px] uppercase tracking-tight">
          mural
        </div>
      </div>
      <p className="text-sm text-white/70">{mural.note}</p>
      <Palette colors={mural.palette} />
    </article>
  );
}

function TickerColumn({
  direction,
  offset,
  cardHeight = CARD_HEIGHT,
}: {
  direction: "up" | "down";
  offset: number;
  cardHeight?: number;
}) {
  const cards = useMemo(() => [...murals, ...murals], []);
  const travel = cards.length * cardHeight;

  // wrap the offset to avoid large translate values
  const wrappedOffset = ((offset % travel) + travel) % travel;
  const translate = direction === "down" ? -wrappedOffset : wrappedOffset;

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-2">
      <div
        className="flex flex-col gap-3 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${translate}px)` }}
      >
        {cards.map((mural, index) => (
          <MuralCard mural={mural} key={`${mural.title}-${index}`} />
        ))}
      </div>
    </div>
  );
}

export function DoubleTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const travelDistance = murals.length * CARD_HEIGHT;

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let frame: number;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const max = scrollHeight - clientHeight;
      const progress = max > 0 ? scrollTop / max : 0;
      setOffset(progress * travelDistance);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(handleScroll);
    };

    handleScroll();
    element.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", onScroll);
    };
  }, [travelDistance]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <header className="mb-8 flex flex-col gap-2 text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Doble ticker
        </p>
        <h2 className="text-3xl font-semibold leading-tight text-white">
          Un mural baja y el otro sube, ligados por tu scroll.
        </h2>
        <p className="text-base text-zinc-400">
          El contenedor es un scrollbar real: mueve la rueda y verás cómo las dos cadenas se
          desplazan en sentidos opuestos. Los murales están duplicados para que cada tramo
          de desplazamiento revele el siguiente lienzo.
        </p>
      </header>

      <div
        ref={scrollRef}
        className="ticker-scrollbar relative h-[70vh] overflow-y-scroll rounded-3xl bg-gradient-to-b from-[#0b0b12] via-[#0b1120] to-black p-4 shadow-2xl ring-1 ring-white/10"
      >
        <div style={{ height: travelDistance }} aria-hidden />

        <div className="pointer-events-none absolute inset-0">
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="pointer-events-auto">
              <TickerColumn direction="down" offset={offset} />
            </div>
            <div className="pointer-events-auto">
              <TickerColumn direction="up" offset={offset} />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0b0b12] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />
      </div>
    </section>
  );
}
