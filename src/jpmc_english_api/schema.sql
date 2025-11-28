-- Database schema for JPMC English API

CREATE DATABASE IF NOT EXISTS jpmc_english;
USE jpmc_english;

-- Customers table
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    registerDate DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'A'
);

-- Payments table
CREATE TABLE IF NOT EXISTS pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(10,2) NOT NULL,
    agendamento INT NOT NULL,
    paid BOOLEAN DEFAULT FALSE
);

-- Schedules table
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno INT NOT NULL,
    datetime DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled'
);

-- Indexes for performance optimization
CREATE INDEX idx_aluno ON agendamentos(aluno);
CREATE INDEX idx_email ON alunos(email);
CREATE INDEX idx_registerDate ON alunos(registerDate);
CREATE INDEX idx_status ON agendamentos(status);

-- Foreign key constraints (if needed in future)
ALTER TABLE pagamentos
ADD CONSTRAINT fk_agendamento
FOREIGN KEY (agendamento) REFERENCES agendamentos(id);

ALTER TABLE agendamentos
ADD CONSTRAINT fk_aluno
FOREIGN KEY (aluno) REFERENCES alunos(id);

