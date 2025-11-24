"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"
import { cancelSchedule } from "@/lib/schedules"

interface DeleteScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  alunoName?: string
  subject?: string
  onDelete: () => void,
  agendamentoId?: number | null
}

export function DeleteScheduleModal({ isOpen, onClose, alunoName, onDelete, agendamentoId }: DeleteScheduleModalProps) {
  const handleDelete = async () => {
    if (!agendamentoId) {
      toast.error("ID do agendamento não fornecido.")
      return
    }
    try {
      await cancelSchedule(agendamentoId)
      onDelete()
      onClose()
      toast.success("Agendamento removido com sucesso.")
    } catch (error) {
      toast.error("Falha ao remover agendamento.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover agendamento</DialogTitle>
          <DialogDescription>Tem certeza que deseja remover este agendamento?</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Aluno: </span>
            <span className="font-medium">{alunoName}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
