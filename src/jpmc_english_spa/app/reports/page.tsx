"use client";

import { useEffect, useState } from "react";

import { getPaymentReport, type PaymentReport } from "@/lib/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReportPage() {
  const [reports, setReports] = useState<PaymentReport[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  async function loadReport() {
    const data = await getPaymentReport({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: status || undefined,
    });
    setReports(data);
  }

  useEffect(() => {
    loadReport().catch(console.error);
  }, []);

  const totals = reports.reduce(
    (acc, row) => ({
      pagos: acc.pagos + row.valorPago,
      pendentes: acc.pendentes + row.valorPendente,
    }),
    { pagos: 0, pendentes: 0 }
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Relatórios</h1>
          <p className="text-muted-foreground">
            Resumo financeiro por aluno (pagos x pendentes).
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Input
            placeholder="status (scheduled...)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Button onClick={loadReport}>Filtrar</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Valor Pago</p>
            <h2 className="text-2xl font-bold">R$ {totals.pagos.toFixed(2)}</h2>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Valor Pendente</p>
            <h2 className="text-2xl font-bold">
              R$ {totals.pendentes.toFixed(2)}
            </h2>
          </Card>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead className="text-center">Pagos</TableHead>
                <TableHead className="text-center">Pendentes</TableHead>
                <TableHead className="text-right">Valor Pago</TableHead>
                <TableHead className="text-right">Valor Pendente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((row) => (
                <TableRow key={row.alunoId}>
                  <TableCell>{row.alunoNome}</TableCell>
                  <TableCell className="text-center">{row.pagos}</TableCell>
                  <TableCell className="text-center">{row.pendentes}</TableCell>
                  <TableCell className="text-right">
                    R$ {row.valorPago.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {row.valorPendente.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
