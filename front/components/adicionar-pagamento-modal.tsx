"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Payment } from "@/components/pagamentos-table"

type AddPaymentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payment: Omit<Payment, "paymentId">) => void
}

export function AddPaymentModal({ open, onOpenChange, onSubmit }: AddPaymentModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    value: "",
    item: "",
    receipt: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      customer: formData.customer,
      value: Number.parseFloat(formData.value),
      item: formData.item,
      receipt: formData.receipt,
    })
    setFormData({ customer: "", value: "", item: "", receipt: "" })
  }

  const isValid =
    formData.customer &&
    formData.value &&
    !isNaN(Number.parseFloat(formData.value)) &&
    formData.item &&
    formData.receipt

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar novo pagamento</DialogTitle>
          <DialogDescription>Insira os detalhes do pagamento abaixo. Todos os campos são obrigatórios.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Aluno</Label>
              <Input
                id="customer"
                placeholder="Digite o nome do aluno"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item">Agendamento</Label>
              <Input
                id="item"
                placeholder="Agendamento"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt">Recibo</Label>
              <Input
                id="receipt"
                placeholder="Digite o número do recibo"
                value={formData.receipt}
                onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Registrar pagamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
