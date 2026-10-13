"use client";
// Filtros do catálogo. As escolhas ficam guardadas na URL
// (ex.: /?tipo=flatrate,rent&plataformas=8&generos=35), então o link pode ser compartilhado.
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Genero, Plataforma } from "@/lib/tmdb";

const LOGO_URL = "https://image.tmdb.org/t/p/w92";
const PLATAFORMAS_VISIVEIS = 16;
// No celular, cada linha de opções desliza para o lado; no computador, quebra em várias linhas
const LINHA = "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0";

export const TIPOS = [
  { valor: "flatrate", nome: "Assinatura" },
  { valor: "free", nome: "Grátis com anúncios" },
  { valor: "rent", nome: "Aluguel" },
  { valor: "buy", nome: "Compra" },
];
export const TIPO_PADRAO = "flatrate";

const ORDENS = [
  { valor: "popularidade", nome: "Mais populares" },
  { valor: "nota", nome: "Melhor avaliados" },
  { valor: "lancamento", nome: "Lançamentos" },
];

// Lê uma lista da URL: "8,1899" -> ["8", "1899"]
function lerLista(valor: string | null) {
  return valor ? valor.split(",").filter(Boolean) : [];
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
        ativo
          ? "border-red-500 bg-red-600 text-white"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
      }`}
    >
      {children}
    </button>
  );
}

export default function Filtros({
  plataformas,
  generos,
}: {
  plataformas: Plataforma[];
  generos: Genero[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [verTodas, setVerTodas] = useState(false);

  const tiposAtivos = params.has("tipo") ? lerLista(params.get("tipo")) : [TIPO_PADRAO];
  const plataformasAtivas = lerLista(params.get("plataformas"));
  const generosAtivos = lerLista(params.get("generos"));

  // Liga/desliga um valor numa lista da URL e atualiza a página
  function alternar(chave: string, valor: string, atuais: string[]) {
    const novos = atuais.includes(valor) ? atuais.filter((v) => v !== valor) : [...atuais, valor];
    const novaUrl = new URLSearchParams(params.toString());
    if (novos.length > 0) novaUrl.set(chave, novos.join(","));
    else if (chave === "tipo") novaUrl.set(chave, ""); // nenhum tipo marcado = mostra todos
    else novaUrl.delete(chave);
    router.replace(`${pathname}?${novaUrl.toString()}`, { scroll: false });
  }

  const ordemAtiva = params.get("ordem") ?? "popularidade";

  function ordenar(valor: string) {
    const novaUrl = new URLSearchParams(params.toString());
    if (valor === "popularidade") novaUrl.delete("ordem");
    else novaUrl.set("ordem", valor);
    router.replace(`${pathname}?${novaUrl.toString()}`, { scroll: false });
  }

  function limpar() {
    router.replace(pathname, { scroll: false });
  }

  const plataformasMostradas = verTodas ? plataformas : plataformas.slice(0, PLATAFORMAS_VISIVEIS);

  return (
    <section className="mb-8 flex flex-col gap-5">
      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Disponível como</h2>
        <div className={LINHA}>
          {TIPOS.map((tipo) => (
            <Chip
              key={tipo.valor}
              ativo={tiposAtivos.includes(tipo.valor)}
              onClick={() => alternar("tipo", tipo.valor, tiposAtivos)}
            >
              {tipo.nome}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Plataformas</h2>
        <div className={LINHA}>
          {plataformasMostradas.map((p) => (
            <Chip
              key={p.provider_id}
              ativo={plataformasAtivas.includes(String(p.provider_id))}
              onClick={() => alternar("plataformas", String(p.provider_id), plataformasAtivas)}
            >
              <Image
                src={LOGO_URL + p.logo_path}
                alt=""
                width={20}
                height={20}
                className="rounded"
              />
              {p.provider_name}
            </Chip>
          ))}
          {plataformas.length > PLATAFORMAS_VISIVEIS && (
            <button
              type="button"
              onClick={() => setVerTodas(!verTodas)}
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-sm text-zinc-400 underline hover:text-zinc-200"
            >
              {verTodas ? "Mostrar menos" : `Mostrar todas (${plataformas.length})`}
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Gêneros</h2>
        <div className={LINHA}>
          {generos.map((g) => (
            <Chip
              key={g.id}
              ativo={generosAtivos.includes(String(g.id))}
              onClick={() => alternar("generos", String(g.id), generosAtivos)}
            >
              {g.name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Ordenar por</h2>
        <div className={LINHA}>
          {ORDENS.map((o) => (
            <Chip key={o.valor} ativo={ordemAtiva === o.valor} onClick={() => ordenar(o.valor)}>
              {o.nome}
            </Chip>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={limpar}
        className="self-start text-sm text-zinc-400 underline hover:text-zinc-200"
      >
        Limpar filtros
      </button>
    </section>
  );
}
