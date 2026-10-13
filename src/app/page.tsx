// Página inicial: filtros + grade com os filmes disponíveis nos streamings do Brasil.
import { Suspense } from "react";
import Filtros from "@/components/Filtros";
import GradeCarregando from "@/components/GradeCarregando";
import GradeFilmes from "@/components/GradeFilmes";
import { descobrirFilmes, listarGeneros, listarPlataformas } from "@/lib/tmdb";

type ParametrosUrl = Promise<{ [chave: string]: string | string[] | undefined }>;

// Converte a escolha da URL ("flatrate,free") para o formato do TMDB ("flatrate|free|ads")
function tiposParaTmdb(tipo: string | undefined) {
  if (tipo === undefined) return "flatrate"; // padrão: assinatura
  if (tipo === "") return "flatrate|free|ads|rent|buy"; // nada marcado: todos
  return tipo
    .split(",")
    .map((t) => (t === "free" ? "free|ads" : t))
    .join("|");
}

// Converte a ordem da URL para o formato do TMDB
const ORDENS: Record<string, string> = {
  popularidade: "popularity.desc",
  nota: "vote_average.desc",
  lancamento: "primary_release_date.desc",
};

function texto(valor: string | string[] | undefined) {
  return Array.isArray(valor) ? valor[0] : valor;
}

export default async function Home({ searchParams }: { searchParams: ParametrosUrl }) {
  // Listas de plataformas e gêneros (iguais para todo mundo, ficam em cache)
  const [plataformas, generos] = await Promise.all([listarPlataformas(), listarGeneros()]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Filmes no streaming</h1>

      <Suspense fallback={<div className="mb-8 h-40" />}>
        <Filtros plataformas={plataformas} generos={generos} />
      </Suspense>

      <Suspense fallback={<GradeCarregando />}>
        <Catalogo searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Catalogo({ searchParams }: { searchParams: ParametrosUrl }) {
  const params = await searchParams;
  const plataformas = texto(params.plataformas);
  const generos = texto(params.generos);

  const filtros = {
    tipos: tiposParaTmdb(texto(params.tipo)),
    plataformas: plataformas?.split(",").join("|"), // "|" = qualquer uma das plataformas
    generos: generos, // "," = todos os gêneros marcados ao mesmo tempo
    ordem: ORDENS[texto(params.ordem) ?? ""] ?? ORDENS.popularidade,
  };
  const pagina = await descobrirFilmes(filtros);

  if (pagina.results.length === 0) {
    return (
      <p className="py-16 text-center text-zinc-400">
        Nenhum filme encontrado com esses filtros. Tente desmarcar alguma opção.
      </p>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-zinc-400">
        {pagina.total_results.toLocaleString("pt-BR")} filmes encontrados
      </p>
      {/* "key" faz a grade recomeçar do zero quando os filtros mudam */}
      <GradeFilmes
        key={JSON.stringify(filtros)}
        filmesIniciais={pagina.results}
        totalPaginas={pagina.total_pages}
        filtros={filtros}
      />
    </>
  );
}
