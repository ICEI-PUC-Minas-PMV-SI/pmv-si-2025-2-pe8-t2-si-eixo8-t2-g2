"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { toast, Toaster } from "sonner";
import { confirmPayment, fetchPayments, type Payment } from "@/lib/payments";
import { Loader2 } from "lucide-react";

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPayments();
        setPayments(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Falha ao carregar pagamentos";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayments();
  }, []);

  async function handleConfirmPayment(paymentId: number) {
    try {
      await confirmPayment(paymentId);
      toast.success(`Pagamento com ID ${paymentId} confirmado!`);
      // Update payment status locally
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId ? { ...payment, paid: true } : payment
        )
      );
    } catch (error) {
      const errorMessage =
              error instanceof Error ? error.message : "Falha ao confirmar pagamento";
      toast.error(errorMessage);
    }
  }

  const filteredPayments = payments;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        {isLoading ? (
          <div className="rounded-lg border p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando pagamentos...
          </div>
        ) : error ? (
          <div className="rounded-lg border p-8 text-center text-destructive">
            {error}
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Agendamento</TableHead>
                  <TableHead className="font-semibold text-right">
                    Valor
                  </TableHead>
                  <TableHead className="font-semibold">Pago</TableHead>
                  <TableHead className="font-semibold">
                    Confirmar recebimento
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum pagamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">
                        {payment.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.aluno}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.agendamentoId} - {payment.agendamentoDatetime}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        R${payment.value.toFixed(2)}
                      </TableCell>
                      <TableCell>{payment.paid ? "Sim" : "Não"}</TableCell>
                      {/* Button with icon */}
                      <TableCell>
                        {!payment.paid && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleConfirmPayment(payment.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(endIndex, filteredPayments.length)} de{" "}
            {filteredPayments.length} pagamentos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                    disabled={isLoading}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      <Toaster />
    </div>
  );
}
