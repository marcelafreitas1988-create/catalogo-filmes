// Página de detalhes de um filme: /filme/603
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import OndeAssistir from "@/components/OndeAssistir";
import { detalhesFilme, sinopseEmIngles } from "@/lib/tmdb";

const POSTER_URL = "https://image.tmdb.org/t/p/w500";

export default function PaginaFilme({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <Suspense fallback={<p className="text-zinc-400">Carregando filme…</p>}>
        <Detalhes params={params} />
      </Suspense>
    </main>
  );
}

function formatarDuracao(minutos: number | null) {
  if (!minutos) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

async function Detalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let filme;
  try {
    filme = await detalhesFilme(id);
  } catch (erro) {
    if ((erro as Error).message.includes("(404)")) notFound();
    throw erro;
  }

  const sinopse = filme.overview || (await sinopseEmIngles(id));
  const sinopseTraduzida = Boolean(filme.overview);
  const ano = filme.release_date?.slice(0, 4);
  const duracao = formatarDuracao(filme.runtime);
  const elenco = filme.credits.cast.slice(0, 10);
  const trailer = filme.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return (
    <article className="flex flex-col gap-10">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="relative mx-auto aspect-[2/3] w-56 shrink-0 overflow-hidden rounded-xl bg-zinc-800 md:mx-0 md:w-72">
          {filme.poster_path ? (
            <Image
              src={POSTER_URL + filme.poster_path}
              alt={`Pôster de ${filme.title}`}
              fill
              sizes="300px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">Sem pôster</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold md:text-4xl">
            {filme.title} {ano && <span className="font-normal text-zinc-400">({ano})</span>}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
            {filme.vote_average > 0 && (
              <span className="font-semibold text-yellow-400">★ {filme.vote_average.toFixed(1)}</span>
            )}
            {duracao && <span>{duracao}</span>}
            {filme.genres.length > 0 && <span>{filme.genres.map((g) => g.name).join(", ")}</span>}
          </div>

          <section>
            <h2 className="mb-1 text-lg font-semibold">Sinopse</h2>
            {sinopse ? (
              <p className="max-w-3xl leading-relaxed text-zinc-300">
                {sinopse}
                {!sinopseTraduzida && <span className="ml-1 text-xs text-zinc-500">(sem tradução em português)</span>}
              </p>
            ) : (
              <p className="text-zinc-400">Sinopse não disponível.</p>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Onde assistir no Brasil</h2>
            <OndeAssistir dados={filme["watch/providers"].results.BR} />
          </section>
        </div>
      </div>

      {trailer && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Trailer</h2>
          <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
              title={`Trailer de ${filme.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </section>
      )}

      {elenco.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Elenco principal</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
            {elenco.map((pessoa) => (
              <li key={pessoa.id} className="text-sm">
                <span className="font-medium">{pessoa.name}</span>
                {pessoa.character && <span className="block text-zinc-400">{pessoa.character}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
