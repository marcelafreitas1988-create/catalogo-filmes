// Cartões "fantasma" que piscam enquanto os filmes carregam.
export default function GradeCarregando({ quantidade = 12 }: { quantidade?: number }) {
  return (
    <div
      role="status"
      aria-label="Carregando filmes"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {Array.from({ length: quantidade }, (_, i) => (
        <div key={i} className="flex animate-pulse flex-col gap-2">
          <div className="aspect-[2/3] rounded-lg bg-zinc-800" />
          <div className="h-3 w-3/4 rounded bg-zinc-800" />
          <div className="h-3 w-1/4 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
