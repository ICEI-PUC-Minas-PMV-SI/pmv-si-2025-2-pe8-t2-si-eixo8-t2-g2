from fastapi import FastAPI, HTTPException, status, Query, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, time
from enum import Enum
from app.models.models import (
    Customer, CustomerCreate, CustomerUpdate,
    Schedule, ScheduleCreate, ScheduleUpdate,
    Payment, PaymentCreate, PaymentUpdate
)
from app.repositories.repositories import customer_repo, payment_repo, schedule_repo
import os

app = FastAPI(
    title="JPMC English - Sistema de Gestão",
    description="API RESTful para gerenciamento de alunos, agendamentos e pagamentos da JPMC English",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("API JPMC English iniciada.")


# ==================== ENDPOINTS PARA ALUNOS (Customers) ====================

@app.get("/alunos", response_model=List[Customer], tags=["Alunos"])
def get_all_students():
    """
    Fetch all students.
    """
    return customer_repo.get_all()


@app.get("/alunos/search", response_model=List[Customer], tags=["Alunos"])
def search_students(search: str = Query(..., description="Search query for name, email, or id")):
    """
    Search students by name, email, or id (case-insensitive).
    """
    return customer_repo.search(search)


@app.post("/alunos", response_model=Customer, status_code=status.HTTP_201_CREATED, tags=["Alunos"])
def create_student(customer: CustomerCreate):
    """
    Create a new student.
    """
    customer_dict = customer.model_dump()
    customer_dict["registerDate"] = str(date.today())
    return customer_repo.create(customer_dict)


@app.put("/alunos/{id}", response_model=Customer, tags=["Alunos"])
def update_student(id: int, customer: CustomerUpdate):
    """
    Update a student.
    """
    customer_dict = customer.model_dump(exclude_unset=True)
    if "registerDate" in customer_dict and customer_dict["registerDate"] is not None:
        customer_dict["registerDate"] = str(customer_dict["registerDate"])
    
    updated = customer_repo.update(id, customer_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated


@app.delete("/alunos/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Alunos"])
def delete_student(id: int):
    """
    Delete a student.
    """
    success = customer_repo.delete(id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return None


# ==================== ENDPOINTS PARA PAGAMENTOS (Payments) ====================

@app.get("/pagamentos", response_model=List[Payment], tags=["Pagamentos"])
def get_all_payments():
    """
    Fetch all payments.
    """
    fetched_payments = payment_repo.get_all()
    for payment in fetched_payments:
        payment['agendamentoDatetime'] = str(payment['agendamentoDatetime'])
        print(payment)
    return fetched_payments

@app.post("/pagamentos", response_model=Payment, status_code=status.HTTP_201_CREATED, tags=["Pagamentos"])
def create_payment(
    customer: str = Form(...),
    value: float = Form(...),
    agendamento: str = Form(...),
    receipt: UploadFile = File(None)
):
    """
    Create a new payment with optional receipt file.
    """
    receipt_path = None
    if receipt:
        # Save the file
        os.makedirs("uploads", exist_ok=True)
        receipt_path = f"uploads/{receipt.filename}"
        with open(receipt_path, "wb") as f:
            f.write(receipt.file.read())
    
    payment_dict = {
        "customer": customer,
        "value": value,
        "agendamento": agendamento,
        "receipt": receipt_path
    }
    return payment_repo.create(payment_dict)

@app.put("/pagamentos/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Pagamentos"])
def update_payment(id: int):
    """
    Update a payment.
    """
    updated = payment_repo.confirm_payment(id)
    if not updated:
        raise HTTPException(status_code=404, detail="Payment not found")
    return updated

# ==================== ENDPOINTS PARA AGENDAMENTOS (Schedules) ====================

@app.get("/agendamentos", response_model=List[Schedule], tags=["Agendamentos"])
def get_schedules(
    startDate: str = Query(None, description="Start date (YYYY-MM-DD)"),
    endDate: str = Query(None, description="End date (YYYY-MM-DD)")
):
    fetched_schedules = schedule_repo.get_all(startDate, endDate)
    for schedule in fetched_schedules:
        schedule['datetime'] = str(schedule['datetime'])
    return fetched_schedules

@app.get("/agendamentos-futuros", response_model=List[Schedule], tags=["Agendamentos"])
def get_future_schedules():

    print("Fetching upcoming schedules")
    fetched_schedules = schedule_repo.get_upcoming_schedules()
    for schedule in fetched_schedules:
        schedule['datetime'] = str(schedule['datetime'])
    return fetched_schedules

@app.post("/agendamentos", response_model=Schedule, status_code=status.HTTP_201_CREATED, tags=["Agendamentos"])
def create_schedule(schedule: ScheduleCreate):
    """
    Create a new schedule with optional payment.
    """
    # creates a transaction and commits both schedule and payment creation
    schedule_dict = schedule.model_dump()
    schedule_dict["datetime"] = str(schedule_dict["datetime"])
    
    return schedule_repo.create(schedule_dict)


@app.delete("/agendamentos/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Agendamentos"])
def delete_schedule(id: int):
    """
    Delete a schedule.
    """
    success = schedule_repo.cancel_schedule(id)
    if not success:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return None


# ==================== ENDPOINT RAIZ ====================

@app.get("/", tags=["Root"])
def root():
    """
    Endpoint raiz da API.
    """
    return {
        "mensagem": "Bem-vindo à API JPMC English",
        "documentacao": "/docs",
        "redoc": "/redoc"
    }