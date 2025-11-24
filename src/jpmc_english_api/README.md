# JPMC English - Sistema de Gestão API

API RESTful desenvolvida com FastAPI para gerenciamento de alunos, agendamentos e pagamentos da JPMC English.

## Funcionalidades

- **CRUD de Alunos**: Cadastrar, listar, atualizar e excluir alunos
- **CRUD de Agendamentos**: Registrar, listar, atualizar e excluir agendamentos de aulas
- **CRUD de Pagamentos**: Registrar, listar, atualizar e excluir pagamentos
- **Documentação Swagger**: Documentação interativa automática da API

## Tecnologias Utilizadas

- **FastAPI**: Framework web moderno e de alta performance para construção de APIs
- **Pydantic**: Validação de dados usando Python type hints
- **Uvicorn**: Servidor ASGI de alta performance

## Instalação

### Pré-requisitos

- Python 3.11 ou superior
- pip (gerenciador de pacotes do Python)

### Passos para instalação

1. Extraia o arquivo ZIP em um diretório de sua preferência

2. Navegue até o diretório do projeto:
```bash
cd jpmc_english_api
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Como Executar

1. No diretório do projeto, execute o comando:
```bash
uvicorn main:app --reload
```

2. A API estará disponível em: `http://127.0.0.1:8000`

3. Acesse a documentação Swagger em: `http://127.0.0.1:8000/docs`

4. Acesse a documentação ReDoc em: `http://127.0.0.1:8000/redoc`

## Estrutura do Projeto

```
jpmc_english_api/
├── main.py           # Arquivo principal com os endpoints da API
├── models.py         # Modelos de dados (Pydantic)
├── database.py       # Simulação de banco de dados em memória
├── requirements.txt  # Dependências do projeto
└── README.md         # Este arquivo
```

## Endpoints da API

### Alunos

- `POST /alunos/` - Criar novo aluno
- `GET /alunos/` - Listar todos os alunos
- `GET /alunos/{id_aluno}` - Obter aluno específico
- `PUT /alunos/{id_aluno}` - Atualizar aluno
- `DELETE /alunos/{id_aluno}` - Deletar aluno

### Agendamentos

- `POST /agendamentos/` - Criar novo agendamento
- `GET /agendamentos/` - Listar todos os agendamentos
- `GET /agendamentos/{id_agendamento}` - Obter agendamento específico
- `PUT /agendamentos/{id_agendamento}` - Atualizar agendamento
- `DELETE /agendamentos/{id_agendamento}` - Deletar agendamento

### Pagamentos

- `POST /pagamentos/` - Criar novo pagamento
- `GET /pagamentos/` - Listar todos os pagamentos
- `GET /pagamentos/{id_pagamento}` - Obter pagamento específico
- `PUT /pagamentos/{id_pagamento}` - Atualizar pagamento
- `DELETE /pagamentos/{id_pagamento}` - Deletar pagamento

## Modelos de Dados

### Aluno

```json
{
  "nome": "string",
  "idade": 0,
  "profissao": "string",
  "objetivo": "string",
  "nivel_ingles": "iniciante | intermediario | avancado",
  "origem_matricula": "indicacao | redes_sociais | contato_direto | outro"
}
```

### Agendamento

```json
{
  "id_aluno": 0,
  "data_aula": "2025-10-15",
  "hora_aula": "10:00:00",
  "status": "agendada | realizada | cancelada | falta | falta_com_reposicao"
}
```

### Pagamento

```json
{
  "id_aluno": 0,
  "valor": 0.0,
  "data_pagamento": "2025-10-15"
}
```

## Observações

- Esta versão utiliza um banco de dados em memória para fins de demonstração
- Os dados são perdidos quando o servidor é reiniciado
- Para uso em produção, recomenda-se integrar com um banco de dados real (MySQL, PostgreSQL, etc.)
- A documentação Swagger permite testar todos os endpoints diretamente no navegador

## Próximos Passos

Para evoluir este sistema, considere:

1. Integrar com banco de dados MySQL conforme especificado no projeto
2. Implementar autenticação e autorização
3. Adicionar endpoints de relatórios
4. Implementar validações de negócio mais complexas
5. Adicionar testes automatizados
6. Configurar CORS para integração com frontend

## Suporte

Para dúvidas ou problemas, consulte a documentação do FastAPI: https://fastapi.tiangolo.com/

