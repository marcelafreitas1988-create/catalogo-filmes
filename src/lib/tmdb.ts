// Conexão com a API do TMDB.
// Este arquivo roda SOMENTE no servidor: é aqui que a chave fica protegida.
import "server-only";
import { cacheLife } from "next/cache";

const TMDB_URL = "https://api.themoviedb.org/3";
const REGIAO = "BR";
const IDIOMA = "pt-BR";

export const IMAGEM_URL = "https://image.tmdb.org/t/p";

type Parametros = Record<string, string | number | undefined>;

// Função base: toda chamada ao TMDB passa por aqui.
// "use cache" guarda cada resposta por algumas horas, para não repetir a mesma chamada.
async function tmdbFetch<T>(caminho: string, parametros: Parametros = {}): Promise<T> {
  "use cache";
  cacheLife("hours");

  const token = process.env.TMDB_READ_TOKEN;
  if (!token) {
    throw new Error("TMDB_READ_TOKEN não está configurado no arquivo .env.local");
  }

  const url = new URL(TMDB_URL + caminho);
  url.searchParams.set("language", IDIOMA);
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== "") url.searchParams.set(chave, String(valor));
  }

  const resposta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });

  if (!resposta.ok) {
    throw new Error(`Erro do TMDB (${resposta.status}) em ${caminho}`);
  }
  return resposta.json() as Promise<T>;
}

// ---------- Tipos ----------

export type Filme = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type PaginaDeFilmes = {
  page: number;
  total_pages: number;
  total_results: number;
  results: Filme[];
};

export type Genero = { id: number; name: string };

export type Plataforma = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
};

export type OndeAssistirBR = {
  link: string;
  flatrate?: Plataforma[];
  free?: Plataforma[];
  ads?: Plataforma[];
  rent?: Plataforma[];
  buy?: Plataforma[];
};

export type DetalhesFilme = Filme & {
  overview: string;
  runtime: number | null;
  genres: Genero[];
  credits: { cast: { id: number; name: string; character: string }[] };
  videos: { results: { key: string; site: string; type: string }[] };
  "watch/providers": { results: { BR?: OndeAssistirBR } };
};

// ---------- Funções de filmes ----------
// (Na V1.5, as funções de séries ficarão ao lado destas.)

export type FiltrosDescoberta = {
  tipos?: string; // ex.: "flatrate|rent"
  plataformas?: string; // ex.: "8|1899"
  generos?: string; // ex.: "35"
  ordem?: string; // ex.: "popularity.desc"
  pagina?: number;
};

export function descobrirFilmes(filtros: FiltrosDescoberta = {}) {
  const ordem = filtros.ordem ?? "popularity.desc";
  return tmdbFetch<PaginaDeFilmes>("/discover/movie", {
    watch_region: REGIAO,
    with_watch_monetization_types: filtros.tipos ?? "flatrate",
    with_watch_providers: filtros.plataformas,
    with_genres: filtros.generos,
    sort_by: ordem,
    // ignora filmes com poucos votos: 200 ao ordenar por nota, 10 nos lançamentos
    // (evita filmes obscuros sem pôster nem tradução)
    "vote_count.gte":
      ordem === "vote_average.desc" ? 200 : ordem === "primary_release_date.desc" ? 10 : undefined,
    page: filtros.pagina ?? 1,
  });
}

export function buscarFilmes(texto: string, pagina = 1) {
  return tmdbFetch<PaginaDeFilmes>("/search/movie", { query: texto, page: pagina, region: REGIAO });
}

export function detalhesFilme(id: number | string) {
  return tmdbFetch<DetalhesFilme>(`/movie/${id}`, {
    append_to_response: "credits,videos,watch/providers",
    include_video_language: "pt,en", // trailers dublados/legendados ou em inglês
  });
}

// Usada quando o filme não tem sinopse em português
export async function sinopseEmIngles(id: number | string) {
  const dados = await tmdbFetch<{ overview: string }>(`/movie/${id}`, { language: "en-US" });
  return dados.overview;
}

export async function ondeAssistir(id: number | string) {
  const dados = await tmdbFetch<{ results: { BR?: OndeAssistirBR } }>(`/movie/${id}/watch/providers`);
  return dados.results.BR ?? null;
}

export async function listarPlataformas() {
  const dados = await tmdbFetch<{ results: Plataforma[] }>("/watch/providers/movie", {
    watch_region: REGIAO,
  });
  return dados.results.sort((a, b) => a.display_priority - b.display_priority);
}

export async function listarGeneros() {
  const dados = await tmdbFetch<{ genres: Genero[] }>("/genre/movie/list");
  return dados.genres;
}
