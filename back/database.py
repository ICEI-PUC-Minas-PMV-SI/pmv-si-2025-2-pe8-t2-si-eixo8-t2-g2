from sqlalchemy import create_engine, Column, Integer, String, Float, Date, Time, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from datetime import date, time
import os
from models import Aluno, Agendamento, Pagamento, NivelIngles, OrigemMatricula, StatusAula

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://jpmc_user:jpmc_password@localhost:3306/jpmc_english")

# Create engine with proper settings for MySQL
engine = create_engine(
    DATABASE_URL, 
    echo=True,
    pool_pre_ping=True,
    pool_recycle=300
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# SQLAlchemy Models
class AlunoModel(Base):
    __tablename__ = "alunos"
    
    id_aluno = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    idade = Column(Integer, nullable=False)
    profissao = Column(String(255), nullable=False)
    objetivo = Column(String(500), nullable=False)
    nivel_ingles = Column(Enum(NivelIngles), nullable=False)
    origem_matricula = Column(Enum(OrigemMatricula), nullable=False)

class AgendamentoModel(Base):
    __tablename__ = "agendamentos"
    
    id_agendamento = Column(Integer, primary_key=True, index=True)
    id_aluno = Column(Integer, nullable=False)
    data_aula = Column(Date, nullable=False)
    hora_aula = Column(Time, nullable=False)
    status = Column(Enum(StatusAula), default=StatusAula.agendada)

class PagamentoModel(Base):
    __tablename__ = "pagamentos"
    
    id_pagamento = Column(Integer, primary_key=True, index=True)
    id_aluno = Column(Integer, nullable=False)
    valor = Column(Float, nullable=False)
    data_pagamento = Column(Date, nullable=False)

# Create tables function
def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

class Database:
    def __init__(self):
        self.db: Session = SessionLocal()

    def get_db(self):
        try:
            yield self.db
        finally:
            self.db.close()

    # CRUD for Alunos
    def create_aluno(self, aluno_data: dict) -> dict:
        try:
            # Convert enum strings back to enum objects
            if "nivel_ingles" in aluno_data and isinstance(aluno_data["nivel_ingles"], str):
                aluno_data["nivel_ingles"] = NivelIngles(aluno_data["nivel_ingles"])
            if "origem_matricula" in aluno_data and isinstance(aluno_data["origem_matricula"], str):
                aluno_data["origem_matricula"] = OrigemMatricula(aluno_data["origem_matricula"])
            
            db_aluno = AlunoModel(**aluno_data)
            self.db.add(db_aluno)
            self.db.commit()
            self.db.refresh(db_aluno)
            
            return {
                "id_aluno": db_aluno.id_aluno,
                "nome": db_aluno.nome,
                "idade": db_aluno.idade,
                "profissao": db_aluno.profissao,
                "objetivo": db_aluno.objetivo,
                "nivel_ingles": db_aluno.nivel_ingles.value,
                "origem_matricula": db_aluno.origem_matricula.value
            }
        except Exception as e:
            self.db.rollback()
            print(f"Error creating aluno: {e}")
            raise e

    def get_aluno(self, id_aluno: int) -> Optional[dict]:
        try:
            aluno = self.db.query(AlunoModel).filter(AlunoModel.id_aluno == id_aluno).first()
            if aluno:
                return {
                    "id_aluno": aluno.id_aluno,
                    "nome": aluno.nome,
                    "idade": aluno.idade,
                    "profissao": aluno.profissao,
                    "objetivo": aluno.objetivo,
                    "nivel_ingles": aluno.nivel_ingles.value,
                    "origem_matricula": aluno.origem_matricula.value
                }
            return None
        except Exception as e:
            print(f"Error getting aluno: {e}")
            return None

    def get_all_alunos(self) -> List[dict]:
        try:
            alunos = self.db.query(AlunoModel).all()
            return [
                {
                    "id_aluno": aluno.id_aluno,
                    "nome": aluno.nome,
                    "idade": aluno.idade,
                    "profissao": aluno.profissao,
                    "objetivo": aluno.objetivo,
                    "nivel_ingles": aluno.nivel_ingles.value,
                    "origem_matricula": aluno.origem_matricula.value
                }
                for aluno in alunos
            ]
        except Exception as e:
            print(f"Error getting all alunos: {e}")
            return []

    def update_aluno(self, id_aluno: int, aluno_data: dict) -> Optional[dict]:
        try:
            aluno = self.db.query(AlunoModel).filter(AlunoModel.id_aluno == id_aluno).first()
            if aluno:
                # Convert enum strings back to enum objects
                if "nivel_ingles" in aluno_data and isinstance(aluno_data["nivel_ingles"], str):
                    aluno_data["nivel_ingles"] = NivelIngles(aluno_data["nivel_ingles"])
                if "origem_matricula" in aluno_data and isinstance(aluno_data["origem_matricula"], str):
                    aluno_data["origem_matricula"] = OrigemMatricula(aluno_data["origem_matricula"])
                
                for key, value in aluno_data.items():
                    if value is not None:
                        setattr(aluno, key, value)
                self.db.commit()
                self.db.refresh(aluno)
                return {
                    "id_aluno": aluno.id_aluno,
                    "nome": aluno.nome,
                    "idade": aluno.idade,
                    "profissao": aluno.profissao,
                    "objetivo": aluno.objetivo,
                    "nivel_ingles": aluno.nivel_ingles.value,
                    "origem_matricula": aluno.origem_matricula.value
                }
            return None
        except Exception as e:
            self.db.rollback()
            print(f"Error updating aluno: {e}")
            return None

    def delete_aluno(self, id_aluno: int) -> bool:
        try:
            aluno = self.db.query(AlunoModel).filter(AlunoModel.id_aluno == id_aluno).first()
            if aluno:
                self.db.delete(aluno)
                self.db.commit()
                return True
            return False
        except Exception as e:
            self.db.rollback()
            print(f"Error deleting aluno: {e}")
            return False

    # CRUD for Agendamentos
    def create_agendamento(self, agendamento_data: dict) -> dict:
        try:
            # Convert enum strings back to enum objects
            if "status" in agendamento_data and isinstance(agendamento_data["status"], str):
                agendamento_data["status"] = StatusAula(agendamento_data["status"])
            
            db_agendamento = AgendamentoModel(**agendamento_data)
            self.db.add(db_agendamento)
            self.db.commit()
            self.db.refresh(db_agendamento)
            
            return {
                "id_agendamento": db_agendamento.id_agendamento,
                "id_aluno": db_agendamento.id_aluno,
                "data_aula": str(db_agendamento.data_aula),
                "hora_aula": str(db_agendamento.hora_aula),
                "status": db_agendamento.status.value
            }
        except Exception as e:
            self.db.rollback()
            print(f"Error creating agendamento: {e}")
            raise e

    def get_agendamento(self, id_agendamento: int) -> Optional[dict]:
        try:
            agendamento = self.db.query(AgendamentoModel).filter(AgendamentoModel.id_agendamento == id_agendamento).first()
            if agendamento:
                return {
                    "id_agendamento": agendamento.id_agendamento,
                    "id_aluno": agendamento.id_aluno,
                    "data_aula": str(agendamento.data_aula),
                    "hora_aula": str(agendamento.hora_aula),
                    "status": agendamento.status.value
                }
            return None
        except Exception as e:
            print(f"Error getting agendamento: {e}")
            return None

    def get_all_agendamentos(self) -> List[dict]:
        try:
            agendamentos = self.db.query(AgendamentoModel).all()
            return [
                {
                    "id_agendamento": agendamento.id_agendamento,
                    "id_aluno": agendamento.id_aluno,
                    "data_aula": str(agendamento.data_aula),
                    "hora_aula": str(agendamento.hora_aula),
                    "status": agendamento.status.value
                }
                for agendamento in agendamentos
            ]
        except Exception as e:
            print(f"Error getting all agendamentos: {e}")
            return []

    def update_agendamento(self, id_agendamento: int, agendamento_data: dict) -> Optional[dict]:
        try:
            agendamento = self.db.query(AgendamentoModel).filter(AgendamentoModel.id_agendamento == id_agendamento).first()
            if agendamento:
                # Convert enum strings back to enum objects
                if "status" in agendamento_data and isinstance(agendamento_data["status"], str):
                    agendamento_data["status"] = StatusAula(agendamento_data["status"])
                
                for key, value in agendamento_data.items():
                    if value is not None:
                        setattr(agendamento, key, value)
                self.db.commit()
                self.db.refresh(agendamento)
                return {
                    "id_agendamento": agendamento.id_agendamento,
                    "id_aluno": agendamento.id_aluno,
                    "data_aula": str(agendamento.data_aula),
                    "hora_aula": str(agendamento.hora_aula),
                    "status": agendamento.status.value
                }
            return None
        except Exception as e:
            self.db.rollback()
            print(f"Error updating agendamento: {e}")
            return None

    def delete_agendamento(self, id_agendamento: int) -> bool:
        try:
            agendamento = self.db.query(AgendamentoModel).filter(AgendamentoModel.id_agendamento == id_agendamento).first()
            if agendamento:
                self.db.delete(agendamento)
                self.db.commit()
                return True
            return False
        except Exception as e:
            self.db.rollback()
            print(f"Error deleting agendamento: {e}")
            return False

    # CRUD for Pagamentos
    def create_pagamento(self, pagamento_data: dict) -> dict:
        try:
            db_pagamento = PagamentoModel(**pagamento_data)
            self.db.add(db_pagamento)
            self.db.commit()
            self.db.refresh(db_pagamento)
            
            return {
                "id_pagamento": db_pagamento.id_pagamento,
                "id_aluno": db_pagamento.id_aluno,
                "valor": db_pagamento.valor,
                "data_pagamento": str(db_pagamento.data_pagamento)
            }
        except Exception as e:
            self.db.rollback()
            print(f"Error creating pagamento: {e}")
            raise e

    def get_pagamento(self, id_pagamento: int) -> Optional[dict]:
        try:
            pagamento = self.db.query(PagamentoModel).filter(PagamentoModel.id_pagamento == id_pagamento).first()
            if pagamento:
                return {
                    "id_pagamento": pagamento.id_pagamento,
                    "id_aluno": pagamento.id_aluno,
                    "valor": pagamento.valor,
                    "data_pagamento": str(pagamento.data_pagamento)
                }
            return None
        except Exception as e:
            print(f"Error getting pagamento: {e}")
            return None

    def get_all_pagamentos(self) -> List[dict]:
        try:
            pagamentos = self.db.query(PagamentoModel).all()
            return [
                {
                    "id_pagamento": pagamento.id_pagamento,
                    "id_aluno": pagamento.id_aluno,
                    "valor": pagamento.valor,
                    "data_pagamento": str(pagamento.data_pagamento)
                }
                for pagamento in pagamentos
            ]
        except Exception as e:
            print(f"Error getting all pagamentos: {e}")
            return []

    def update_pagamento(self, id_pagamento: int, pagamento_data: dict) -> Optional[dict]:
        try:
            pagamento = self.db.query(PagamentoModel).filter(PagamentoModel.id_pagamento == id_pagamento).first()
            if pagamento:
                for key, value in pagamento_data.items():
                    if value is not None:
                        setattr(pagamento, key, value)
                self.db.commit()
                self.db.refresh(pagamento)
                return {
                    "id_pagamento": pagamento.id_pagamento,
                    "id_aluno": pagamento.id_aluno,
                    "valor": pagamento.valor,
                    "data_pagamento": str(pagamento.data_pagamento)
                }
            return None
        except Exception as e:
            self.db.rollback()
            print(f"Error updating pagamento: {e}")
            return None

    def delete_pagamento(self, id_pagamento: int) -> bool:
        try:
            pagamento = self.db.query(PagamentoModel).filter(PagamentoModel.id_pagamento == id_pagamento).first()
            if pagamento:
                self.db.delete(pagamento)
                self.db.commit()
                return True
            return False
        except Exception as e:
            self.db.rollback()
            print(f"Error deleting pagamento: {e}")
            return False

# Global database instance
db = Database()