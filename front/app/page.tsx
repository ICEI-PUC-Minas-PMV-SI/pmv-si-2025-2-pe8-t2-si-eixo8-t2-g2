import { PaymentsTable } from "@/components/pagamentos-table"

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">Pagamentos</h1>
          <p className="text-muted-foreground text-pretty">Gerencie e rastreie seus pagamentos</p>
        </div>
        <PaymentsTable />
      </div>
    </div>
  )
}
