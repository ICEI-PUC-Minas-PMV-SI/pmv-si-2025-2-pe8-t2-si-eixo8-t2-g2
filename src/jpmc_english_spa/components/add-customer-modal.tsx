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
import type { Customer } from "@/components/customers-table"

type AddCustomerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (customer: Omit<Customer, "id" | "pagamentosAtrasados" | "agendamentos" | "registerDate">) => void
}

export function AddCustomerModal({ open, onOpenChange, onSubmit }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    })
    setFormData({ name: "", email: "", phone: "" })
  }

  const isValid = formData.name && formData.email && formData.phone

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Novo Aluno</DialogTitle>
          <DialogDescription>Digite os detalhes do aluno abaixo. Todos os campos são obrigatórios.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Endereço de E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o endereço de e-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Digite o número de telefone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Adicionar Aluno
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
