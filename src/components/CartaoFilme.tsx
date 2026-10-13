// Cartão de um filme na grade: pôster, título, ano e nota.
import Image from "next/image";
import Link from "next/link";
import type { Filme } from "@/lib/tmdb";

const POSTER_URL = "https://image.tmdb.org/t/p/w342";

// "disponivel" só é usado na busca: mostra o selo de disponibilidade no Brasil
export default function CartaoFilme({ filme, disponivel }: { filme: Filme; disponivel?: boolean }) {
  const ano = filme.release_date ? filme.release_date.slice(0, 4) : "—";
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : "—";

  return (
    <Link href={`/filme/${filme.id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800 ring-zinc-400 transition group-hover:ring-2">
        {filme.poster_path ? (
          <Image
            src={POSTER_URL + filme.poster_path}
            alt={`Pôster de ${filme.title}`}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover"
          />
        ) : (
          // Imagem padrão quando o filme não tem pôster
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-400">
            Sem pôster
          </div>
        )}
        <span className="absolute right-2 top-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-yellow-400">
          ★ {nota}
        </span>
      </div>
      <div>
        <h2 className="line-clamp-2 text-sm font-semibold leading-tight">{filme.title}</h2>
        <p className="text-xs text-zinc-400">{ano}</p>
        {disponivel !== undefined && (
          <span
            className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${
              disponivel ? "bg-green-900/60 text-green-300" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {disponivel ? "Disponível no streaming" : "Indisponível no Brasil"}
          </span>
        )}
      </div>
    </Link>
  );
}
