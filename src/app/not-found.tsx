// Página mostrada quando o endereço não existe (ex.: /filme/abc)
import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-zinc-400">Não encontramos o filme ou a página que você procurou.</p>
      <Link href="/" className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500">
        Voltar ao catálogo
      </Link>
    </main>
  );
}
