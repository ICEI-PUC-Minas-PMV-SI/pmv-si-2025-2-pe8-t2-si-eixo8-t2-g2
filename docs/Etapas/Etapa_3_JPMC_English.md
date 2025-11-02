# Etapa 3 – Desenvolvimento de alternativas de soluções de SI

## 3.1 Conexão com o Plano de IC e Planejamento da Solução

Iremos desenvolver um **sistema de informação** com o objetivo de centralizar e automatizar os processos administrativos e pedagógicos da empresa, permitindo controle e eficiência na gestão de alunos, agendamentos e pagamentos. O sistema busca resolver os principais desafios identificados na etapa anterior: falta de integração entre dados, ausência de relatórios e dificuldade de acompanhamento dos agendamentos. Como funcionalidades iniciais a serem desenvolvidas estão mapeados:

1.  **CRUD de clientes:** cadastrar novos alunos com informações pessoais de nome, idade, profissão, objetivo com o curso e nível de inglês. Atualizar, consultar e excluir cadastros. Registrar a origem da matrícula (indicação, redes sociais, etc.).
2.  **CRUD de agendamentos:** registrar aulas agendadas, realizadas, canceladas ou reagendadas. Exibir visualização mensal de horários. Indicar horários de maior e menor demanda.
3.  **CRUD de pagamentos:** controlar mensalidades e pagamentos de cada aluno. Registrar status de pagamento. Calcular projeções de receita mensal e anual.
4.  **Relatórios online:** gerar relatórios de desempenho pedagógico (frequência, cancelamentos e reposições) e gerar relatórios financeiros.

Abaixo segue quadro-resumo com os problemas mapeados e como será resolvido no sistema:

| Problema mapeado | Solução proposta | Como será resolvida |
| :--- | :--- | :--- |
| Controle manual de alunos e falta de histórico | Implementar módulo de cadastro de clientes | CRUD de alunos com dados pessoais e objetivo |
| Dificuldade em gerenciar horários e reposições | Registrar o agendamento de aulas | CRUD de agendamento com status da aula com visualização mensal |
| Falta de previsibilidade financeira | Centralizar os dados financeiros e gerar projeções | CRUD de pagamentos e cálculo de receita |
| Ausência de relatórios consolidados para tomada de decisão | Criar sistema de relatórios | Geração de relatórios sobre desempenho e finanças |
| Dificuldade em identificar horários de maior demanda e perfis de alunos | Utilizar dados para gerar informações e indicadores | Relatórios que exibem horários mais procurados e perfis predominantes de alunos |

## 3.2 Levantamento de Requisitos e Modelagem inicial

### Histórias de usuário

| Número | História de Usuário | Critérios de aceite |
| :--- | :--- | :--- |
| 001 | Eu como administrador, quero cadastrar, editar e remover alunos para manter o controle atualizado de clientes. | Deve ser possível criar, editar e excluir registros de alunos, salvando os dados no banco. |
| 002 | Eu como administrador, quero registrar aulas agendadas e realizadas. | O sistema deve permitir selecionar o aluno, data, horário e status da aula (agendada, realizada ou cancelada). |
| 003 | Eu como administrador, quero registrar pagamentos para manter o controle financeiro. | O sistema deve calcular o status do pagamento e gerar projeções de receita. |
| 004 | Eu como administrador, quero registrar relatórios para tomar decisões baseadas em dados. | O sistema deve exibir relatórios com filtros. |

### Requisitos funcionais

1.  Cadastro de alunos: criar, ler, atualizar e excluir alunos.
2.  Agendamento de aulas: registrar aula e atualizar status.
3.  Controle de pagamentos: registrar pagamentos com valores e datas.
4.  Geração de relatórios: relatórios financeiros, pedagógicos e perfil de alunos.

### Requisitos não funcionais

1.  O sistema deve ter interface simples e intuitiva.
2.  Os dados devem ser armazenados de forma segura.

### Ferramentas e plataformas

Para o desenvolvimento do sistema, será utilizado **React** no front-end, **Python** no back-end e **MYSQL** como banco de dados. Todas as ferramentas escolhidas são *open source*, o que reduz custos de licenciamento e reduz o investimento necessário para a implementação. O *deploy* será realizado localmente na máquina do administrador reduzindo custos com hospedagem que ainda pode ser configurado com *backup* em nuvem para garantir segurança e disponibilidade dos dados.

### Esboço do banco de dados (modelo ER)

#### Entidades

| Aluno |
| :--- |
| id\_aluno (PK) |
| nome |
| idade |
| profissao |
| objetivo |
| nivel\_ingles |
| origem\_matricula |

| Agendamento |
| :--- |
| id\_agendamento (PK) |
| id\_aluno (FK) |
| data\_aula |
| hora\_aula |
| status |

| Pagamento |
| :--- |
| id\_pagamento (PK) |
| id\_aluno (FK) |
| valor |
| data\_pagamento |

#### Relacionamentos

*   Um Aluno pode ter vários Agendamentos (1:N)
*   Um Aluno pode ter vários Pagamentos (1: N)

**[Diagrama do Modelo ER]**

**[Diagrama do Processo de Gestão de Cliente e Aulas]**

**[Diagrama de caso de uso]**

## 3.3 Análise de Alternativas de Solução

Considerando a necessidade de um sistema de gestão customizado para a JPMC English, com foco em centralização de dados, automação de processos e geração de inteligência competitiva, foram avaliadas três alternativas principais:

1.  **Desenvolvimento de Sistema Customizado (In-House):**
    *   Descrição: Criação de um sistema do zero, utilizando as tecnologias já definidas (React, Python, MySQL).
    *   **Vantagens:** Total aderência aos requisitos específicos (KIQs e KPIs), controle completo sobre o código e a segurança, potencial de escalabilidade sob demanda.
    *   **Desvantagens**: Maior custo e tempo de desenvolvimento inicial, dependência de um desenvolvedor para manutenção e evolução.
    *   **Adequação:** Alta. É a alternativa que melhor atende ao objetivo de IC e aos requisitos informacionais detalhados.

2.  **Adaptação de Ferramentas de Mercado (SaaS de Gestão Educacional):**
    *   Descrição: Utilização de plataformas prontas para gestão de escolas e cursos (ex: Agenda Edu, ClassApp, ou CRMs genéricos).
    *   **Vantagens**: Implementação rápida, suporte e manutenção inclusos, menor custo inicial.
    *   **Desvantagens:** Baixa flexibilidade para customização de relatórios e KPIs específicos, pode exigir adaptação dos processos da empresa ao software, custo recorrente (mensalidade).
    *   **Adequação:** Média. Atenderia a parte operacional (agendamento e financeiro), mas falharia na geração da inteligência competitiva customizada.

3.  **Utilização de Planilhas Avançadas e Ferramentas de BI (Business Intelligence):**
    *   Descrição: Manter o uso de planilhas (Excel/Google Sheets) e integrá-las a ferramentas de visualização de dados (ex: Power BI, Google Data Studio).
    *   **Vantagens:** Custo muito baixo, familiaridade com a ferramenta (planilhas).
    *   **Desvantagens:** Não resolve o problema da centralização e da entrada manual de dados (sujeito a erros), não automatiza o registro de aulas e pagamentos, dificuldade em escalar.
    *   **Adequação:** Baixa. Não resolve o problema central da falta de integração e automação, limitando a capacidade de IC.

**Conclusão da Análise:**

A alternativa de **Desenvolvimento de Sistema Customizado (In-House)** é a mais recomendada. Embora exija um investimento inicial maior em tempo e recursos, é a única que garante a total aderência aos requisitos de Inteligência Competitiva (IC) e aos KPIs definidos para o crescimento sustentável da JPMC English. A escolha de tecnologias *open source* (React, Python, MySQL) mitiga o custo de licenciamento e permite que o sistema seja construído como um ativo estratégico da empresa, focado em transformar dados operacionais em vantagem competitiva.

## 3.4 Definição da Solução

A solução a ser desenvolvida é um **Sistema de Gestão Estratégica (SGE)** customizado, com as seguintes características:

*   **Arquitetura:** Aplicação Web Full-Stack.
*   **Tecnologias:** Front-end em React, Back-end em Python (com framework como Flask ou Django) e Banco de Dados MySQL.
*   **Foco:** Centralização de dados de Alunos, Agendamentos e Pagamentos.
*   **Diferencial:** Módulo de Relatórios e Dashboards focado nos KIQs e KPIs definidos (taxa de ocupação, ticket médio, retenção, perfil de aluno).

Esta solução será desenvolvida em fases, priorizando as funcionalidades de CRUD (Cadastro, Leitura, Atualização e Exclusão) para garantir a base de dados e, em seguida, o módulo de relatórios, que é o coração da Inteligência Competitiva.
