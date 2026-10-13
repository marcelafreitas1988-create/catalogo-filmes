// "Onde assistir": logos das plataformas, agrupados por tipo de disponibilidade.
import Image from "next/image";
import type { OndeAssistirBR, Plataforma } from "@/lib/tmdb";

const LOGO_URL = "https://image.tmdb.org/t/p/w92";

function Grupo({ titulo, plataformas }: { titulo: string; plataformas: Plataforma[] }) {
  if (plataformas.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{titulo}</h3>
      <ul className="flex flex-wrap gap-3">
        {plataformas.map((p) => (
          <li key={p.provider_id} className="flex items-center gap-2 rounded-lg bg-zinc-900 py-1.5 pl-1.5 pr-3">
            <Image src={LOGO_URL + p.logo_path} alt="" width={32} height={32} className="rounded" />
            <span className="text-sm">{p.provider_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OndeAssistir({ dados }: { dados: OndeAssistirBR | undefined }) {
  if (!dados) {
    return <p className="text-zinc-400">Este filme não está disponível em nenhum streaming no Brasil no momento.</p>;
  }

  // "free" e "ads" são as duas formas grátis; junta sem repetir plataforma
  const gratis = [...(dados.free ?? []), ...(dados.ads ?? [])].filter(
    (p, i, lista) => lista.findIndex((x) => x.provider_id === p.provider_id) === i,
  );

  return (
    <div className="flex flex-col gap-5">
      <Grupo titulo="Assinatura" plataformas={dados.flatrate ?? []} />
      <Grupo titulo="Grátis" plataformas={gratis} />
      <Grupo titulo="Aluguel" plataformas={dados.rent ?? []} />
      <Grupo titulo="Compra" plataformas={dados.buy ?? []} />
      <a
        href={dados.link}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-sm text-zinc-400 underline hover:text-zinc-200"
      >
        Ver todas as opções e links diretos (via JustWatch) ↗
      </a>
    </div>
  );
}
