from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List
from datetime import date, time
from models import (
    Aluno, AlunoCreate, AlunoUpdate,
    Agendamento, AgendamentoCreate, AgendamentoUpdate,
    Pagamento, PagamentoCreate, PagamentoUpdate
)
from database import db
from database import create_tables

create_tables()

app = FastAPI(
    title="JPMC English - Sistema de Gestão",
    description="API RESTful para gerenciamento de alunos, agendamentos e pagamentos da JPMC English",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)




# ==================== ENDPOINTS PARA ALUNOS ====================

@app.post("/alunos/", response_model=Aluno, status_code=status.HTTP_201_CREATED, tags=["Alunos"])
def criar_aluno(aluno: AlunoCreate):
    """
    Cria um novo aluno no sistema.
    
    - **nome**: Nome completo do aluno
    - **idade**: Idade do aluno
    - **profissao**: Profissão do aluno
    - **objetivo**: Objetivo do aluno com o curso
    - **nivel_ingles**: Nível de inglês (iniciante, intermediario, avancado)
    - **origem_matricula**: Origem da matrícula (indicacao, redes_sociais, contato_direto, outro)
    """
    aluno_dict = aluno.model_dump()
    # Converte enums para strings
    aluno_dict["nivel_ingles"] = aluno_dict["nivel_ingles"].value
    aluno_dict["origem_matricula"] = aluno_dict["origem_matricula"].value
    novo_aluno = db.create_aluno(aluno_dict)
    return novo_aluno


@app.get("/alunos/", response_model=List[Aluno], tags=["Alunos"])
def listar_alunos():
    """
    Lista todos os alunos cadastrados no sistema.
    """
    return db.get_all_alunos()


@app.get("/alunos/{id_aluno}", response_model=Aluno, tags=["Alunos"])
def obter_aluno(id_aluno: int):
    """
    Obtém informações de um aluno específico pelo ID.
    """
    aluno = db.get_aluno(id_aluno)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno


@app.put("/alunos/{id_aluno}", response_model=Aluno, tags=["Alunos"])
def atualizar_aluno(id_aluno: int, aluno: AlunoUpdate):
    """
    Atualiza informações de um aluno existente.
    """
    aluno_dict = aluno.model_dump(exclude_unset=True)
    # Converte enums para strings se presentes
    if "nivel_ingles" in aluno_dict and aluno_dict["nivel_ingles"] is not None:
        aluno_dict["nivel_ingles"] = aluno_dict["nivel_ingles"].value
    if "origem_matricula" in aluno_dict and aluno_dict["origem_matricula"] is not None:
        aluno_dict["origem_matricula"] = aluno_dict["origem_matricula"].value
    
    aluno_atualizado = db.update_aluno(id_aluno, aluno_dict)
    if not aluno_atualizado:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno_atualizado


@app.delete("/alunos/{id_aluno}", status_code=status.HTTP_204_NO_CONTENT, tags=["Alunos"])
def deletar_aluno(id_aluno: int):
    """
    Remove um aluno do sistema.
    """
    sucesso = db.delete_aluno(id_aluno)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return None


# ==================== ENDPOINTS PARA AGENDAMENTOS ====================

@app.post("/agendamentos/", response_model=Agendamento, status_code=status.HTTP_201_CREATED, tags=["Agendamentos"])
def criar_agendamento(agendamento: AgendamentoCreate):
    """
    Cria um novo agendamento de aula.
    
    - **id_aluno**: ID do aluno
    - **data_aula**: Data da aula (formato: YYYY-MM-DD)
    - **hora_aula**: Horário da aula (formato: HH:MM:SS)
    - **status**: Status da aula (agendada, realizada, cancelada, falta, falta_com_reposicao)
    """
    # Verifica se o aluno existe
    aluno = db.get_aluno(agendamento.id_aluno)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    agendamento_dict = agendamento.model_dump()
    # Converte date e time para strings
    agendamento_dict["data_aula"] = str(agendamento_dict["data_aula"])
    agendamento_dict["hora_aula"] = str(agendamento_dict["hora_aula"])
    agendamento_dict["status"] = agendamento_dict["status"].value
    
    novo_agendamento = db.create_agendamento(agendamento_dict)
    return novo_agendamento


@app.get("/agendamentos/", response_model=List[Agendamento], tags=["Agendamentos"])
def listar_agendamentos():
    """
    Lista todos os agendamentos de aulas.
    """
    return db.get_all_agendamentos()


@app.get("/agendamentos/{id_agendamento}", response_model=Agendamento, tags=["Agendamentos"])
def obter_agendamento(id_agendamento: int):
    """
    Obtém informações de um agendamento específico pelo ID.
    """
    agendamento = db.get_agendamento(id_agendamento)
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return agendamento


@app.put("/agendamentos/{id_agendamento}", response_model=Agendamento, tags=["Agendamentos"])
def atualizar_agendamento(id_agendamento: int, agendamento: AgendamentoUpdate):
    """
    Atualiza informações de um agendamento existente.
    """
    agendamento_dict = agendamento.model_dump(exclude_unset=True)
    
    # Verifica se o aluno existe (se id_aluno foi fornecido)
    if "id_aluno" in agendamento_dict and agendamento_dict["id_aluno"] is not None:
        aluno = db.get_aluno(agendamento_dict["id_aluno"])
        if not aluno:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # Converte date, time e enum para strings se presentes
    if "data_aula" in agendamento_dict and agendamento_dict["data_aula"] is not None:
        agendamento_dict["data_aula"] = str(agendamento_dict["data_aula"])
    if "hora_aula" in agendamento_dict and agendamento_dict["hora_aula"] is not None:
        agendamento_dict["hora_aula"] = str(agendamento_dict["hora_aula"])
    if "status" in agendamento_dict and agendamento_dict["status"] is not None:
        agendamento_dict["status"] = agendamento_dict["status"].value
    
    agendamento_atualizado = db.update_agendamento(id_agendamento, agendamento_dict)
    if not agendamento_atualizado:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return agendamento_atualizado


@app.delete("/agendamentos/{id_agendamento}", status_code=status.HTTP_204_NO_CONTENT, tags=["Agendamentos"])
def deletar_agendamento(id_agendamento: int):
    """
    Remove um agendamento do sistema.
    """
    sucesso = db.delete_agendamento(id_agendamento)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return None


# ==================== ENDPOINTS PARA PAGAMENTOS ====================

@app.post("/pagamentos/", response_model=Pagamento, status_code=status.HTTP_201_CREATED, tags=["Pagamentos"])
def criar_pagamento(pagamento: PagamentoCreate):
    """
    Registra um novo pagamento.
    
    - **id_aluno**: ID do aluno
    - **valor**: Valor do pagamento
    - **data_pagamento**: Data do pagamento (formato: YYYY-MM-DD)
    """
    # Verifica se o aluno existe
    aluno = db.get_aluno(pagamento.id_aluno)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    pagamento_dict = pagamento.model_dump()
    # Converte date para string
    pagamento_dict["data_pagamento"] = str(pagamento_dict["data_pagamento"])
    
    novo_pagamento = db.create_pagamento(pagamento_dict)
    return novo_pagamento


@app.get("/pagamentos/", response_model=List[Pagamento], tags=["Pagamentos"])
def listar_pagamentos():
    """
    Lista todos os pagamentos registrados.
    """
    return db.get_all_pagamentos()


@app.get("/pagamentos/{id_pagamento}", response_model=Pagamento, tags=["Pagamentos"])
def obter_pagamento(id_pagamento: int):
    """
    Obtém informações de um pagamento específico pelo ID.
    """
    pagamento = db.get_pagamento(id_pagamento)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    return pagamento


@app.put("/pagamentos/{id_pagamento}", response_model=Pagamento, tags=["Pagamentos"])
def atualizar_pagamento(id_pagamento: int, pagamento: PagamentoUpdate):
    """
    Atualiza informações de um pagamento existente.
    """
    pagamento_dict = pagamento.model_dump(exclude_unset=True)
    
    # Verifica se o aluno existe (se id_aluno foi fornecido)
    if "id_aluno" in pagamento_dict and pagamento_dict["id_aluno"] is not None:
        aluno = db.get_aluno(pagamento_dict["id_aluno"])
        if not aluno:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # Converte date para string se presente
    if "data_pagamento" in pagamento_dict and pagamento_dict["data_pagamento"] is not None:
        pagamento_dict["data_pagamento"] = str(pagamento_dict["data_pagamento"])
    
    pagamento_atualizado = db.update_pagamento(id_pagamento, pagamento_dict)
    if not pagamento_atualizado:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    return pagamento_atualizado


@app.delete("/pagamentos/{id_pagamento}", status_code=status.HTTP_204_NO_CONTENT, tags=["Pagamentos"])
def deletar_pagamento(id_pagamento: int):
    """
    Remove um pagamento do sistema.
    """
    sucesso = db.delete_pagamento(id_pagamento)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
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

