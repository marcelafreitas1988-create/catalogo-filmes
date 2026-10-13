"use client"; // telas de erro precisam rodar no navegador
// Mostrada quando algo dá errado ao carregar uma página (ex.: TMDB fora do ar).
import { useEffect } from "react";

export default function Erro({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Não foi possível carregar os filmes</h1>
      <p className="text-zinc-400">Pode ser uma instabilidade momentânea. Tente de novo em alguns segundos.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
      >
        Tentar de novo
      </button>
    </main>
  );
}
