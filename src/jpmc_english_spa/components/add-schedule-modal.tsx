"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { getCustomers } from "@/lib/customers";
import { createSchedule } from "@/lib/schedules";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  datetime: Date;
  onAdd: (data: { alunoName: string; payment?: { value: number } }) => void;
}

export function AddScheduleModal({
  isOpen,
  onClose,
  datetime,
  onAdd,
}: AddScheduleModalProps) {
  const [alumnoId, setAlumnoId] = useState("");
  const [paymentItem, setPaymentItem] = useState("");
  const [paymentValue, setPaymentValue] = useState("");
  const [paid, setPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alunosDropdown, setAlunosDropdown] = useState<
    { id: string; name: string }[]
  >([]);

  const handleSubmit = async () => {
    console.log(
      "Submitting with alumnoId:",
      datetime,
      alumnoId,
      paid,
      paymentItem,
      paymentValue
    );
    if (!alumnoId || !paymentValue) {
      console.log("Validation failed: Missing alumnoId or paymentValue");
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);
      createSchedule({
        alunoId: alumnoId,
        paymentValue: parseFloat(paymentValue),
        paymentPaid: paid,
        datetime: datetime.toISOString(),
      });

      onAdd({
        alunoName:
          alunosDropdown.find((aluno) => aluno.id === alumnoId)?.name || "",
      });
      // setAlumnoId("");
      // setPaymentItem("");
      // setPaymentValue("");
      // setPaid(false);
      onClose();
      toast.success("Agendamento adicionado com sucesso.");
    } catch (error) {
      toast.error("Falha ao adicionar agendamento.");
    } finally {
      setIsSubmitting(false);
    } 
  };

  useEffect(() => {
    getCustomers().then((data) => {
      const alunosData = data.map((customer) => ({
        id: customer.id,
        name: customer.name,
      }));
      setAlunosDropdown(alunosData);
    });
  }, []);

  const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  const dayName = DAYS[datetime?.getDay()] || "Desconhecido";

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Agendar aula para {dayName} às {formatHour(datetime?.getHours())}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alumno">Aluno</Label>
            <Select value={alumnoId} onValueChange={setAlumnoId}>
              <SelectTrigger id="alumno">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {alunosDropdown.map((alumno) => (
                  <SelectItem key={alumno.id} value={alumno.id}>
                    {alumno.id} - {alumno.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pagamento</CardTitle>
              </div>
              <CardDescription>
                Vincule um pagamento a este agendamento
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="payment-value">Valor</Label>
                <Input
                  id="payment-value"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={paymentValue}
                  onChange={(e) => setPaymentValue(e.target.value)}
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                <span>Pago</span>
              </label>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
