from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, time
from enum import Enum


class OrigemMatricula(str, Enum):
    indicacao = "indicacao"
    redes_sociais = "redes_sociais"
    contato_direto = "contato_direto"
    outro = "outro"


class NivelIngles(str, Enum):
    iniciante = "iniciante"
    intermediario = "intermediario"
    avancado = "avancado"


class StatusAula(str, Enum):
    agendada = "agendada"
    realizada = "realizada"
    cancelada = "cancelada"
    falta = "falta"
    falta_com_reposicao = "falta_com_reposicao"


# Modelos para Aluno
class AlunoBase(BaseModel):
    nome: str = Field(..., description="Nome completo do aluno")
    idade: int = Field(..., ge=0, description="Idade do aluno")
    profissao: str = Field(..., description="Profissão do aluno")
    objetivo: str = Field(..., description="Objetivo do aluno com o curso")
    nivel_ingles: NivelIngles = Field(..., description="Nível de inglês do aluno")
    origem_matricula: OrigemMatricula = Field(..., description="Origem da matrícula")


class AlunoCreate(AlunoBase):
    pass


class AlunoUpdate(BaseModel):
    nome: Optional[str] = Field(None, description="Nome completo do aluno")
    idade: Optional[int] = Field(None, ge=0, description="Idade do aluno")
    profissao: Optional[str] = Field(None, description="Profissão do aluno")
    objetivo: Optional[str] = Field(None, description="Objetivo do aluno com o curso")
    nivel_ingles: Optional[NivelIngles] = Field(None, description="Nível de inglês do aluno")
    origem_matricula: Optional[OrigemMatricula] = Field(None, description="Origem da matrícula")


class Aluno(AlunoBase):
    id_aluno: int = Field(..., description="ID único do aluno")

    class Config:
        from_attributes = True


# Modelos para Agendamento
class AgendamentoBase(BaseModel):
    id_aluno: int = Field(..., description="ID do aluno")
    data_aula: date = Field(..., description="Data da aula")
    hora_aula: time = Field(..., description="Horário da aula")
    status: StatusAula = Field(default=StatusAula.agendada, description="Status da aula")


class AgendamentoCreate(AgendamentoBase):
    pass


class AgendamentoUpdate(BaseModel):
    id_aluno: Optional[int] = Field(None, description="ID do aluno")
    data_aula: Optional[date] = Field(None, description="Data da aula")
    hora_aula: Optional[time] = Field(None, description="Horário da aula")
    status: Optional[StatusAula] = Field(None, description="Status da aula")


class Agendamento(AgendamentoBase):
    id_agendamento: int = Field(..., description="ID único do agendamento")

    class Config:
        from_attributes = True


# Modelos para Pagamento
class PagamentoBase(BaseModel):
    id_aluno: int = Field(..., description="ID do aluno")
    valor: float = Field(..., ge=0, description="Valor do pagamento")
    data_pagamento: date = Field(..., description="Data do pagamento")


class PagamentoCreate(PagamentoBase):
    pass


class PagamentoUpdate(BaseModel):
    id_aluno: Optional[int] = Field(None, description="ID do aluno")
    valor: Optional[float] = Field(None, ge=0, description="Valor do pagamento")
    data_pagamento: Optional[date] = Field(None, description="Data do pagamento")


class Pagamento(PagamentoBase):
    id_pagamento: int = Field(..., description="ID único do pagamento")

    class Config:
        from_attributes = True

