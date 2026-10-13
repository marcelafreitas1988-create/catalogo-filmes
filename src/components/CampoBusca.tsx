// Campo de busca do topo. Ao enviar, vai para /busca?q=...
import Form from "next/form";

export default function CampoBusca() {
  return (
    <Form action="/busca" className="flex w-full max-w-md">
      <input
        name="q"
        type="search"
        required
        placeholder="Buscar filme pelo nome…"
        aria-label="Buscar filme pelo nome"
        className="w-full rounded-l-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-400"
      />
      <button
        type="submit"
        className="rounded-r-full bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-500"
      >
        Buscar
      </button>
    </Form>
  );
}
