"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Plus, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { AdicionarAlunoModal } from "@/components/adicionar-aluno-modal"

export type Aluno = {
  id: string
  name: string
  email: string
  telefone: string
  dataRegistro: string
  agendamentos: Agendamento[]
}

export type Agendamento = {
  id: string
  date: string
  time: string
}

// Mock data
const mockCustomers: Aluno[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@email.com",
    telefone: "123-456-7890",
    dataRegistro: "2024-01-15",
    agendamentos: [
      { id: "SCH-001", date: "2024-01-20", time: "10:00 AM" },
      { id: "SCH-002", date: "2024-01-22", time: "2:00 PM" },
    ],
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    telefone: "987-654-3210",
    dataRegistro: "2024-02-01",
    agendamentos: [{ id: "SCH-003", date: "2024-02-10", time: "11:00 AM" }],
  },
  {
    id: "CUST-003",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    telefone: "555-555-5555",
    dataRegistro: "2024-01-28",
    agendamentos: [
      { id: "SCH-004", date: "2024-02-05", time: "3:00 PM" },
      { id: "SCH-005", date: "2024-02-08", time: "9:00 AM" },
      { id: "SCH-006", date: "2024-02-12", time: "1:00 PM" },
    ],
  },
  {
    id: "CUST-004",
    name: "Michael Brown",
    email: "m.brown@email.com",
    telefone: "111-222-3333",
    dataRegistro: "2024-02-05",
    agendamentos: [{ id: "SCH-007", date: "2024-02-18", time: "10:00 AM" }],
  },
  {
    id: "CUST-005",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    telefone: "444-555-6666",
    dataRegistro: "2024-01-10",
    agendamentos: [],
  },
  {
    id: "CUST-006",
    name: "David Lee",
    email: "d.lee@email.com",
    telefone: "777-888-9999",
    dataRegistro: "2024-02-03",
    agendamentos: [
      { id: "SCH-008", date: "2024-02-20", time: "2:00 PM" },
      { id: "SCH-009", date: "2024-02-25", time: "4:00 PM" },
    ],
  },
]

export function AlunosTable() {
  const [alunos, setAlunos] = useState<Aluno[]>(mockCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  // Filter customers
  const alunosFiltrados = alunos.filter((aluno) => {
    const matchesSearch =
      aluno.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aluno.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(alunosFiltrados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAlunos = alunosFiltrados.slice(startIndex, endIndex)

  const handleAdicionarAluno = (customer: Omit<Aluno, "id" | "schedules">) => {
    const newCustomer: Aluno = {
      ...customer,
      id: `CUST-${String(alunos.length + 1).padStart(3, "0")}`,
      agendamentos: [],
    }
    setAlunos([newCustomer, ...alunos])
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar alunos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Aluno
            </Button>
          </div>

          <div className="rounded-lg border overflow-visible">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">E-mail</TableHead>
                  <TableHead className="font-semibold">Telefone</TableHead>
                  <TableHead className="font-semibold">Data de Registro</TableHead>
                  <TableHead className="font-semibold text-center">Próximos Agendamentos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAlunos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentAlunos.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell className="text-sm">{customer.telefone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customer.dataRegistro}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <SchedulesBadge schedules={customer.agendamentos} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} - {Math.min(endIndex, alunosFiltrados.length)} de {alunosFiltrados.length}{" "}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <AdicionarAlunoModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAdicionarAluno} />
    </>
  )
}

function SchedulesBadge({ schedules }: { schedules: Agendamento[] }) {
  const [showOverlay, setShowOverlay] = useState(false)

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  return (
    <div className="relative inline-block pointer-events-auto">
      <div
        className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-medium text-sm cursor-pointer hover:bg-primary/30 transition-colors"
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      >
        {schedules.length}
      </div>

      {showOverlay && schedules.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-popover border rounded-lg shadow-lg p-4 w-max max-w-xs z-50 pointer-events-auto">
          <div className="space-y-2">
            {schedules.slice(0, 5).map((schedule) => (
              <div key={schedule.id} className="text-sm">
                <div className="text-muted-foreground text-xs">
                  {getDayOfWeek(schedule.date)}, {schedule.date}
                </div>
              </div>
            ))}
            {schedules.length > 5 && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                +{schedules.length - 5} more schedule{schedules.length > 6 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
