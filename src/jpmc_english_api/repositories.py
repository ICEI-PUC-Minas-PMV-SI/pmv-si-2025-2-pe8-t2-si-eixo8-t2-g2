import mysql.connector as mysql
from typing import List, Optional, Dict, Any
from models import Customer, Payment, Schedule
import os


class DatabaseConnection:
    def __init__(self):
        self.connection = None
        self.connect()

    def connect(self):
        try:
            self.connection = mysql.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                user=os.getenv('DB_USER', 'root'),
                password=os.getenv('DB_PASSWORD', 'rootpassword'),
                database=os.getenv('DB_NAME', 'jpmc_english'),
                port=int(os.getenv('DB_PORT', 3306))
            )
            print("Connected to MySQL database")
        except Exception as e:
            print(f"Error connecting to MySQL: {e}")
            self.connection = None

    def get_connection(self):
        if self.connection and self.connection.is_connected():
            return self.connection
        else:
            self.connect()
            return self.connection

    def close(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed")


class CustomerRepository:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def create(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
        INSERT INTO alunos (name, email, phone, registerDate)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (
            customer_data['name'],
            customer_data['email'],
            customer_data['phone'],
            customer_data['registerDate']
        ))
        conn.commit()
        customer_id = cursor.lastrowid
        cursor.close()
        conn.commit()
        customer_data['id'] = customer_id
        return customer_data

    def get_all(self) -> List[Dict[str, Any]]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        # Brings customers joined with amount of late payments (aluno -> agendamentos -> payment with paid false) and next schedules
        query = """
        WITH pagamentosAtrasadosCte AS (
            SELECT P.id, A.aluno
            FROM pagamentos P
            INNER JOIN agendamentos A ON P.agendamento = A.id
            WHERE P.paid = FALSE
        ),
        agendamentosCte AS (
            SELECT S.id, S.aluno
            FROM agendamentos S
            WHERE S.status = 'scheduled'
            AND S.datetime > NOW()
        )
        SELECT
            alunos.id,
            alunos.name,
            alunos.email,
            alunos.phone,
            alunos.registerDate,
            COUNT(DISTINCT pagamentosAtrasadosCte.id) AS pagamentosAtrasados,
            COUNT(DISTINCT agendamentosCte.id) AS agendamentos
        FROM alunos
        LEFT JOIN pagamentosAtrasadosCte 
            ON pagamentosAtrasadosCte.aluno = alunos.id
        LEFT JOIN agendamentosCte
            ON agendamentosCte.aluno = alunos.id
        GROUP BY alunos.id, alunos.name, alunos.email, alunos.phone, alunos.registerDate;

        """
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.commit()
        return results

    # def search(self, query: str) -> List[Dict[str, Any]]:
    #     conn = self.db.get_connection()
    #     cursor = conn.cursor(dictionary=True)
    #     search_query = f"""
    #     SELECT * FROM customers
    #     WHERE LOWER(name) LIKE LOWER(%s)
    #     OR LOWER(email) LIKE LOWER(%s)
    #     OR CAST(id AS CHAR) LIKE %s
    #     """
    #     search_param = f"%{query}%"
    #     cursor.execute(search_query, (search_param, search_param, search_param))
    #     results = cursor.fetchall()
    #     cursor.close()
    #     return results

    def update(self, customer_id: int, customer_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        fields = []
        values = []
        for key, value in customer_data.items():
            if value is not None:
                fields.append(f"{key} = %s")
                values.append(value)
        if not fields:
            return self.get_by_id(customer_id)
        query = f"UPDATE customers SET {', '.join(fields)} WHERE id = %s"
        values.append(customer_id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.commit()
        return self.get_by_id(customer_id)

    def delete(self, customer_id: int) -> bool:
        conn = self.db.get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM customers WHERE id = %s"
        cursor.execute(query, (customer_id,))
        conn.commit()
        deleted = cursor.rowcount > 0
        cursor.close()
        conn.commit()
        return deleted


class PaymentRepository:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def get_all(self) -> List[Dict[str, Any]]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            P.id,
            A.name AS aluno,
            P.value,
            S.id AS agendamentoId,
            S.datetime AS agendamentoDatetime,
            P.paid
        FROM pagamentos P
            INNER JOIN agendamentos S ON P.agendamento = S.id
            INNER JOIN alunos A ON S.aluno = A.id
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.commit()
        mappedResults = []
        for row in results:
            mappedResults.append({
                "id": row["id"],
                "aluno": row["aluno"],
                "value": float(row["value"]),
                "agendamentoId": row["agendamentoId"],
                "agendamentoDatetime": row["agendamentoDatetime"],
                "paid": row["paid"]
            })
        return mappedResults

    def confirm_payment(self, payment_id: int) -> Optional[Dict[str, Any]]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        values = []
        query = "UPDATE pagamentos SET paid = TRUE WHERE id = %s"
        values.append(payment_id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.commit()
        return {"id": payment_id, "paid": True}

    def delete(self, payment_id: int) -> bool:
        conn = self.db.get_connection()
        cursor = conn.cursor()
        query = "DELETE FROM pagamentos WHERE id = %s"
        cursor.execute(query, (payment_id,))
        conn.commit()
        deleted = cursor.rowcount > 0
        cursor.close()
        conn.commit()
        return deleted

    def get_payment_report(self, start_date=None, end_date=None, status=None):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT
            a.id AS alunoId,
            a.name AS alunoNome,
            COUNT(p.id) AS totalPagamentos,
            SUM(p.paid = TRUE) AS pagos,
            SUM(p.paid = FALSE) AS pendentes,
            SUM(CASE WHEN p.paid = TRUE THEN p.value ELSE 0 END) AS valorPago,
            SUM(CASE WHEN p.paid = FALSE THEN p.value ELSE 0 END) AS valorPendente
        FROM alunos a
        LEFT JOIN agendamentos s ON s.aluno = a.id
        LEFT JOIN pagamentos p ON p.agendamento = s.id
        WHERE 1=1
        """
        params = []
        if start_date and end_date:
            query += " AND s.datetime BETWEEN %s AND %s"
            params.extend([start_date, end_date])
        if status:
            query += " AND s.status = %s"
            params.append(status)
        query += " GROUP BY a.id, a.name ORDER BY a.name"

        cursor.execute(query, params)
        rows = cursor.fetchall()
        cursor.close()
        conn.commit()
        return rows



class ScheduleRepository:
    def __init__(self, db_connection: DatabaseConnection):
        self.db = db_connection

    def create(self, schedule_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
        INSERT INTO agendamentos (aluno, datetime, status)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (
            schedule_data['alunoId'],
            schedule_data['datetime'].replace("T", " ").replace("Z", ""),
            schedule_data.get('status', 'scheduled')
        ))
        queryPayment = """
        INSERT INTO pagamentos (value, agendamento, paid)
        VALUES (%s, %s, %s)
        """
        cursor.execute(queryPayment, (
            schedule_data['paymentValue'],
            cursor.lastrowid,
            schedule_data.get('paymentPaid', False)
            ))
    
        schedule_id = cursor.lastrowid
        cursor.close()
        schedule_data['id'] = schedule_id
        conn.commit()
        return schedule_data

    def get_all(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            S.id,
            S.aluno AS alunoId,
            A.name AS alunoName,
            S.datetime,
            S.status
        FROM agendamentos S
        INNER JOIN alunos A ON S.aluno = A.id
        WHERE S.status = 'scheduled'
        """
        params = []
        if start_date and end_date:
            query += " AND datetime BETWEEN %s AND %s"
            params = [start_date, end_date]
        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        conn.commit()
        return results
    
    def get_upcoming_schedules(self) -> List[Dict[str, Any]]:
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            S.id,
            S.aluno AS alunoId,
            A.name AS alunoName,
            S.datetime,
            S.status
        FROM agendamentos S
        INNER JOIN alunos A ON S.aluno = A.id
        WHERE S.status = 'scheduled'
        AND S.datetime > NOW()
        ORDER BY S.datetime
        """
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.commit()
        return results

    def cancel_schedule(self, schedule_id: int) -> bool:
        conn = self.db.get_connection()
        cursor = conn.cursor()
        query = "UPDATE agendamentos SET status = 'cancelled' WHERE id = %s"
        queryPayment = "DELETE FROM pagamentos WHERE agendamento = %s"
        cursor.execute(query, (schedule_id,))
        cursor.execute(queryPayment, (schedule_id,))
        conn.commit()
        deleted = cursor.rowcount > 0
        cursor.close()
        conn.commit()
        return deleted


# Initialize database connection and repositories
db_connection = DatabaseConnection()
db_connection.autocommit = False
customer_repo = CustomerRepository(db_connection)
payment_repo = PaymentRepository(db_connection)
schedule_repo = ScheduleRepository(db_connection)