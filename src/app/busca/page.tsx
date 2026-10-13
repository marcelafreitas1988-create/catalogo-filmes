// Página de busca: mostra todos os resultados, cada um com o selo
// "Disponível no streaming" ou "Indisponível no Brasil".
import { Suspense } from "react";
import CartaoFilme from "@/components/CartaoFilme";
import GradeCarregando from "@/components/GradeCarregando";
import { buscarFilmes, ondeAssistir } from "@/lib/tmdb";

type ParametrosUrl = Promise<{ [chave: string]: string | string[] | undefined }>;

export default function PaginaBusca({ searchParams }: { searchParams: ParametrosUrl }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <Suspense fallback={<GradeCarregando />}>
        <Resultados searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Resultados({ searchParams }: { searchParams: ParametrosUrl }) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";

  if (!q) {
    return <p className="py-16 text-center text-zinc-400">Digite o nome de um filme no campo de busca.</p>;
  }

  const pagina = await buscarFilmes(q);

  // Para cada resultado, pergunta ao TMDB se o filme está disponível no Brasil
  const disponibilidades = await Promise.all(
    pagina.results.map(async (filme) => {
      const br = await ondeAssistir(filme.id);
      return Boolean(br && (br.flatrate || br.free || br.ads || br.rent || br.buy));
    }),
  );

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Resultados para “{q}”</h1>
      <p className="mb-6 text-sm text-zinc-400">
        {pagina.total_results.toLocaleString("pt-BR")} filmes encontrados
        {pagina.total_results > pagina.results.length && ` (mostrando os ${pagina.results.length} mais relevantes)`}
      </p>

      {pagina.results.length === 0 ? (
        <p className="py-16 text-center text-zinc-400">Nenhum filme encontrado. Confira a grafia e tente de novo.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {pagina.results.map((filme, i) => (
            <CartaoFilme key={filme.id} filme={filme} disponivel={disponibilidades[i]} />
          ))}
        </div>
      )}
    </>
  );
}
