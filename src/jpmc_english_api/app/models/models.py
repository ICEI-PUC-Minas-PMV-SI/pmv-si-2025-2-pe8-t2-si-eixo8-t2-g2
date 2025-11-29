from pydantic import BaseModel, Field
from typing import Optional
from datetime import date as date_type, time as time_type


# Modelos para Customer (Aluno)
class CustomerBase(BaseModel):
    name: str = Field(description="Name of the customer")
    email: str = Field(description="Email of the customer")
    phone: str = Field(description="Phone number of the customer")
    registerDate: Optional[date_type] = Field(default_factory=date_type.today, description="Registration date")
    pagamentosAtrasados: Optional[int] = Field(default=0, description="Number of overdue payments")
    agendamentos: Optional[int] = Field(default=0, description="Number of schedules")


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(default=None, description="Name of the customer")
    email: Optional[str] = Field(default=None, description="Email of the customer")
    phone: Optional[str] = Field(default=None, description="Phone number of the customer")
    registerDate: Optional[date_type] = Field(default=None, description="Registration date")


class Customer(CustomerBase):
    id: int = Field(description="Unique ID of the customer")


# Modelos para Payment
class PaymentBase(BaseModel):
    aluno: str = Field(description="Customer name or ID")
    value: float = Field(gt=0, description="Payment value")
    agendamentoId: int = Field(description="Schedule reference")
    agendamentoDatetime: str = Field(description="Schedule date and time")
    paid: bool = Field(default=None, description="Payment status")


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    customer: Optional[str] = Field(default=None, description="Customer name or ID")
    value: Optional[float] = Field(default=None, gt=0, description="Payment value")
    agendamento: Optional[str] = Field(default=None, description="Schedule reference")
    receipt: Optional[str] = Field(default=None, description="Receipt file path")


class Payment(PaymentBase):
    id: int = Field(description="Unique payment ID")


# Modelos para Schedule (Agendamento)
class ScheduleBase(BaseModel):
    alunoId: int = Field(description="Customer name or ID")
    alunoName: Optional[str] = Field(default=None, description="Customer name")
    datetime: str = Field(description="Schedule date and time in ISO format")
    status: Optional[str] = Field(default="scheduled", description="Schedule status")

class ScheduleCreate(ScheduleBase):
    paymentValue: float = Field(default=None, gt=0, description="Optional payment value for the schedule")
    paymentPaid: Optional[bool] = Field(default=False, description="Indicates if the payment is made")
    pass


class ScheduleUpdate(BaseModel):
    status: str = Field(default=None, description="Schedule status")

class Schedule(ScheduleBase):
    id: int = Field(description="Unique schedule ID")

    class Config:
        from_attributes = True

class PaymentReport(BaseModel):
    alunoId: int = Field(description="Customer ID")
    alunoNome: str = Field(description="Customer name")
    totalPagamentos: int = Field(description="Total payments")
    pagos: int = Field(description="Paid payments")
    pendentes: int = Field(description="Pending payments")
    valorPago: float = Field(description="Paid amount")
    valorPendente: float = Field(description="Pending amount")
