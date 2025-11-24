"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { AddCustomerModal } from "@/components/add-customer-modal";
import { getCustomers, createCustomer } from "@/lib/customers";
import { toast, Toaster } from "sonner";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registerDate: string;
  agendamentos: number;
  pagamentosAtrasados: number;
};

export type Schedule = {
  id: string;
  date: string;
  time: string;
  aluno: Partial<Customer>;
};

export function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao buscar alunos";
      setError(message);
      console.error("[v0] Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers;

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleAddCustomer = async (
    customer: Omit<
      Customer,
      "id" | "agendamentos" | "pagamentosAtrasados" | "registerDate"
    >
  ) => {
    try {
      const newCustomer = await createCustomer(customer);
      setCustomers([
        ...customers,
        {
          ...newCustomer,
          pagamentosAtrasados: 0,
          agendamentos: 0,
          registerDate: new Date().toLocaleDateString("pt-BR"),
        },
      ]);
      setIsModalOpen(false);
      toast.success("Aluno adicionado com sucesso");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao adicionar aluno";
      setIsModalOpen(false);
      toast.error(message);
      console.error("[v0] Error adding customer:", err);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Carregando alunos...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2"
              disabled={isSearching}
            >
              <Plus className="h-4 w-4" />
              Adicionar Aluno
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg border overflow-visible">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID do Aluno</TableHead>
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">E-mail</TableHead>
                  <TableHead className="font-semibold">Telefone</TableHead>
                  <TableHead className="font-semibold">
                    Data de Registro
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Pagamentos Atrasados
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Agendamentos
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSearching ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Pesquisando...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum aluno encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">
                        {customer.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell className="text-sm">
                        {customer.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {customer.registerDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberBadge count={customer.pagamentosAtrasados} />
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberBadge count={customer.agendamentos} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(endIndex, filteredCustomers.length)} de{" "}
              {filteredCustomers.length} alunos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isSearching}
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
                      disabled={isSearching}
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
                disabled={currentPage === totalPages || isSearching}
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <AddCustomerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddCustomer}
      />
      <Toaster />
    </>
  );
}

function NumberBadge({ count }: { count: number }) {
  return (
    <div
      className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
        count > 0
          ? "bg-destructive/20 text-destructive"
          : "bg-green-500/20 text-green-700 dark:text-green-400"
      }`}
    >
      {count}
    </div>
  );
}
