import { DoubleTicker } from "./components/DoubleTicker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-[#080808] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 sm:px-10">
        <section className="flex flex-col gap-4 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Modo polea
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Un doble ticker que solo responde a tu scroll.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            En lugar de animarse solo, el riel es un scrollbar real: al bajar, un mural desciende y el otro
            asciende como dos cadenas opuestas. Desplázate para ir revelando cada lienzo duplicado en la
            secuencia.
          </p>
        </section>

        <DoubleTicker />
      </main>
    </div>
  );
}
