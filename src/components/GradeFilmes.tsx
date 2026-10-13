"use client";
// Grade de filmes com o botão "Carregar mais".
import { useState, useTransition } from "react";
import { carregarMaisFilmes } from "@/app/acoes";
import CartaoFilme from "@/components/CartaoFilme";
import type { Filme, FiltrosDescoberta } from "@/lib/tmdb";

const ULTIMA_PAGINA_TMDB = 500; // o TMDB não entrega páginas além da 500

export default function GradeFilmes({
  filmesIniciais,
  totalPaginas,
  filtros,
}: {
  filmesIniciais: Filme[];
  totalPaginas: number;
  filtros: FiltrosDescoberta;
}) {
  const [filmes, setFilmes] = useState(filmesIniciais);
  const [pagina, setPagina] = useState(1);
  const [erro, setErro] = useState(false);
  const [carregando, iniciar] = useTransition();

  const temMais = pagina < Math.min(totalPaginas, ULTIMA_PAGINA_TMDB);

  function carregarMais() {
    setErro(false);
    iniciar(async () => {
      try {
        const proxima = await carregarMaisFilmes({ ...filtros, pagina: pagina + 1 });
        setFilmes((atuais) => {
          // evita repetir um filme que já está na grade
          const vistos = new Set(atuais.map((f) => f.id));
          return [...atuais, ...proxima.results.filter((f) => !vistos.has(f.id))];
        });
        setPagina(pagina + 1);
      } catch {
        setErro(true);
      }
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filmes.map((filme) => (
          <CartaoFilme key={filme.id} filme={filme} />
        ))}
      </div>

      {erro && (
        <p className="mt-6 text-center text-sm text-red-400">
          Não foi possível carregar mais filmes. Tente de novo.
        </p>
      )}

      {temMais && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={carregarMais}
            disabled={carregando}
            className="rounded-full bg-zinc-800 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60"
          >
            {carregando ? "Carregando…" : "Carregar mais"}
          </button>
        </div>
      )}
    </>
  );
}
