"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { AddPaymentModal } from "@/components/adicionar-pagamento-modal"
import Link from "next/link"

export type Payment = {
  paymentId: string
  customer: string
  value: number
  item: string
  receipt: string
}

// Mock data
const mockPayments: Payment[] = [
  {
    paymentId: "PAY-001",
    customer: "John Doe",
    value: 1250.0,
    item: "Link",
    receipt: "REC-2024-001",
  },
  {
    paymentId: "PAY-002",
    customer: "Jane Smith",
    value: 850.5,
    item: "Link",
    receipt: "REC-2024-002",
  },
  {
    paymentId: "PAY-003",
    customer: "Acme Corp",
    value: 5000.0,
    item: "Link",
    receipt: "REC-2024-003",
  },
  {
    paymentId: "PAY-004",
    customer: "Tech Solutions Inc",
    value: 3200.75,
    item: "Link",
    receipt: "REC-2024-004",
  },
  {
    paymentId: "PAY-005",
    customer: "Sarah Johnson",
    value: 450.0,
    item: "Link",
    receipt: "REC-2024-005",
  },
  {
    paymentId: "PAY-006",
    customer: "Michael Brown",
    value: 2100.0,
    item: "Link",
    receipt: "REC-2024-006",
  },
  {
    paymentId: "PAY-007",
    customer: "Global Industries",
    value: 7500.0,
    item: "Link",
    receipt: "REC-2024-007",
  },
  {
    paymentId: "PAY-008",
    customer: "Emma Wilson",
    value: 625.0,
    item: "Link",
    receipt: "REC-2024-008",
  },
]

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.item.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPayments = filteredPayments.slice(startIndex, endIndex)

  const handleAddPayment = (payment: Omit<Payment, "paymentId">) => {
    const newPayment: Payment = {
      ...payment,
      paymentId: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
    }
    setPayments([newPayment, ...payments])
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagamentos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar pagamento
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">ID Pagamento</TableHead>
                <TableHead className="font-semibold">Aluno</TableHead>
                <TableHead className="font-semibold">Agendamento</TableHead>
                <TableHead className="font-semibold text-right">Valor</TableHead>
                <TableHead className="font-semibold">Recibo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                currentPayments.map((payment) => (
                  <TableRow key={payment.paymentId} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{payment.paymentId}</TableCell>
                    <TableCell className="font-medium">{payment.customer}</TableCell>
                    <TableCell>
                    <Link
                    key={payment.item}
                    href={payment.item}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors`}
                  >
                        {payment.item}
                        </Link>
                        </TableCell>
                    <TableCell className="text-right font-semibold">R${payment.value.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{payment.receipt}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredPayments.length)} de {filteredPayments.length}{" "}

          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
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
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AddPaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAddPayment} />
    </div>
  )
}
