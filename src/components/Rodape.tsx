// Rodapé com os créditos obrigatórios ao TMDB e ao JustWatch.
import Image from "next/image";

export default function Rodape() {
  return (
    <footer className="mt-auto border-t border-zinc-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-zinc-400">
        <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="self-start">
          <Image src="/tmdb-logo.svg" alt="The Movie Database (TMDB)" width={160} height={21} />
        </a>
        <p>Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.</p>
        <p>
          Dados de disponibilidade nos streamings fornecidos pelo{" "}
          <a href="https://www.justwatch.com/br" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-200">
            JustWatch
          </a>
          . Os catálogos mudam com frequência e as informações podem ter alguns dias de atraso.
        </p>
      </div>
    </footer>
  );
}
