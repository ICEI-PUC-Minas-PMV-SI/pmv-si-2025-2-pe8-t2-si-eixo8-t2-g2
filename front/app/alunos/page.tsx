import { AlunosTable } from "@/components/alunos-table"

export default function AlunosPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Alunos</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu banco de dados de alunos</p>
        </div>
        <AlunosTable />
      </div>
    </main>
  )
}
