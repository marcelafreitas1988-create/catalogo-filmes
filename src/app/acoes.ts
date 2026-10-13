"use server";
// Ações que o navegador pode pedir ao servidor (a chave do TMDB continua só aqui).
import { descobrirFilmes, type FiltrosDescoberta } from "@/lib/tmdb";

// Só aceita números, vírgulas, "|" e ordens conhecidas — qualquer coisa diferente é ignorada.
const SO_IDS = /^[0-9a-z|,]*$/;
const ORDENS = ["popularity.desc", "vote_average.desc", "primary_release_date.desc"];

export async function carregarMaisFilmes(filtros: FiltrosDescoberta) {
  const pagina = Math.trunc(Number(filtros.pagina));
  if (!(pagina >= 2 && pagina <= 500)) throw new Error("Página inválida");

  const limpo = (valor?: string) => (valor && SO_IDS.test(valor) ? valor : undefined);

  return descobrirFilmes({
    tipos: limpo(filtros.tipos),
    plataformas: limpo(filtros.plataformas),
    generos: limpo(filtros.generos),
    ordem: ORDENS.includes(filtros.ordem ?? "") ? filtros.ordem : undefined,
    pagina,
  });
}
