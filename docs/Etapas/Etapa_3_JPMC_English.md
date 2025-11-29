# Etapa 3 – Desenvolvimento de alternativas de soluções de SI

## 1 - Conexão com o Plano de IC e Planejamento da Solução

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

## 2 - Levantamento de Requisitos e Modelagem inicial

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

| Aluno | Agendamento | Pagamento |
| :--- | :--- | :--- |
| id\_aluno (PK) | id\_agendamento (PK) | id\_pagamento (PK) |
| nome | id\_aluno (FK) | id\_aluno (FK) |
| idade | data\_aula | valor |
| profissao | hora\_aula | data\_pagamento |
| objetivo | status | |
| nivel\_ingles | | |
| origem\_matricula | | |

#### Relacionamentos

*   Um Aluno pode ter vários Agendamentos (1:N)
*   Um Aluno pode ter vários Pagamentos (1: N)

#### Relacionamentos

**![Diagrama do Modelo ER](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/Planilha/3.2%20Relacionamentos.png)**

#### Processo de Gestão de Cliente e Aulas

**![Processo de Gestão de Cliente e Aulas](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/Planilha/3.2%20Processo%20de%20Gestão%20de%20Cliente%20e%20Aulas.png)**

#### Diagrama de caso de uso

**![Diagrama de caso de uso](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/Planilha/3.2%20Diagrama%20de%20caso%20de%20uso.png)**

## 3 - Análise de Alternativas de Solução

Considerando a necessidade de um sistema de gestão customizado para a JPMC English, com foco em centralização de dados, automação de processos e geração de inteligência competitiva, foram avaliadas três alternativas principais:

### 3.1 - Desenvolvimento de Sistema Customizado (In-House):

*   Descrição: Criação de um sistema do zero, utilizando as tecnologias já definidas (React, Python, MySQL).
*   **Vantagens:** Total aderência aos requisitos específicos (KIQs e KPIs), controle completo sobre o código e a segurança, potencial de escalabilidade sob demanda.
*   **Desvantagens**: Maior custo e tempo de desenvolvimento inicial, dependência de um desenvolvedor para manutenção e evolução.
*   **Adequação:** Alta. É a alternativa que melhor atende ao objetivo de IC e aos requisitos informacionais detalhados.

### 3.2 - Adaptação de Ferramentas de Mercado (SaaS de Gestão Educacional):

*   Descrição: Utilização de plataformas prontas para gestão de escolas e cursos (ex: Agenda Edu, ClassApp, ou CRMs genéricos).
*   **Vantagens**: Implementação rápida, suporte e manutenção inclusos, menor custo inicial.
*   **Desvantagens:** Baixa flexibilidade para customização de relatórios e KPIs específicos, pode exigir adaptação dos processos da empresa ao software, custo recorrente (mensalidade).
*   **Adequação:** Média. Atenderia a parte operacional (agendamento e financeiro), mas falharia na geração da inteligência competitiva customizada.

### 3.3 - Utilização de Planilhas Avançadas e Ferramentas de BI (Business Intelligence):

*   Descrição: Manter o uso de planilhas (Excel/Google Sheets) e integrá-las a ferramentas de visualização de dados (ex: Power BI, Google Data Studio).
*   **Vantagens:** Custo muito baixo, familiaridade com a ferramenta (planilhas).
*   **Desvantagens:** Não resolve o problema da centralização e da entrada manual de dados (sujeito a erros), não automatiza o registro de aulas e pagamentos, dificuldade em escalar.
*   **Adequação:** Baixa. Não resolve o problema central da falta de integração e automação, limitando a capacidade de IC.

**Conclusão da Análise:**

A alternativa de **Desenvolvimento de Sistema Customizado (In-House)** é a mais recomendada. Embora exija um investimento inicial maior em tempo e recursos, é a única que garante a total aderência aos requisitos de Inteligência Competitiva (IC) e aos KPIs definidos para o crescimento sustentável da JPMC English. A escolha de tecnologias *open source* (React, Python, MySQL) mitiga o custo de licenciamento e permite que o sistema seja construído como um ativo estratégico da empresa, focado em transformar dados operacionais em vantagem competitiva.

### 3.4 - Definição da Solução

A solução a ser desenvolvida é um **Sistema de Gestão Estratégica (SGE)** customizado, com as seguintes características:

*   **Arquitetura:** Aplicação Web Full-Stack.
*   **Tecnologias:** Front-end em React, Back-end em Python (com framework como Flask ou Django) e Banco de Dados MySQL.
*   **Foco:** Centralização de dados de Alunos, Agendamentos e Pagamentos.
*   **Diferencial:** Módulo de Relatórios e Dashboards focado nos KIQs e KPIs definidos (taxa de ocupação, ticket médio, retenção, perfil de aluno).

Esta solução será desenvolvida em fases, priorizando as funcionalidades de CRUD (Cadastro, Leitura, Atualização e Exclusão) para garantir a base de dados e, em seguida, o módulo de relatórios, que é o coração da Inteligência Competitiva.

## 4 - Planejamento e Implementação

### 4.1 - Plano de Implementação

O desenvolvimento do Sistema de Gestão Estratégica (SGE) será dividido em três fases principais, utilizando uma abordagem ágil para garantir entregas de valor em curtos ciclos.

| Fase | Duração Estimada | Entregáveis Principais | Foco |
| :--- | :--- | :--- | :--- |
| Fase 1: Base de Dados e CRUDs | 4 semanas | Banco de Dados MySQL configurado; Módulos CRUD de Alunos e Agendamentos (com status de aula); Interface básica de login. | Estrutura e Operação Básica |
| Fase 2: Financeiro e Automação | 3 semanas | Módulo CRUD de Pagamentos (com status e alertas de inadimplência); Cálculo automático de Receita Projetada e Ticket Médio; Relatório de Frequência e Reposições. | Gestão Financeira e Pedagógica |
| Fase 3: Inteligência Competitiva (IC) | 3 semanas | Módulo de Dashboards e Relatórios (KPIs de ocupação, retenção, perfil de aluno); Implementação de Pesquisa de Satisfação (Feedback); Finalização e Deploy Local. | Análise Estratégica e IC |

### 4.2 - Plano de Testes

Será adotado um plano de testes para garantir a qualidade e a conformidade do sistema com os requisitos levantados.

| Tipo de Teste | Objetivo | Responsável | Fase de Aplicação |
| :--- | :--- | :--- | :--- |
| **Teste Unitário** | Verificar o funcionamento de cada componente (funções, classes) isoladamente. | Desenvolvedor | Durante o desenvolvimento de cada módulo. |
| **Teste de Integração** | Garantir que os módulos (Front-end, Back-end, Banco de Dados) se comuniquem corretamente. | Desenvolvedor | Ao final de cada Fase (1, 2 e 3). |
| **Teste de Aceitação (UAT)** | Confirmar que o sistema atende aos requisitos de negócio (Histórias de Usuário). | Administrador/Professor (Usuário Final) | Ao final de cada Fase (1, 2 e 3). |
| **Teste de Segurança** | Avaliar a conformidade com a LGPD e a proteção contra vulnerabilidades comuns (ex: injeção SQL). | Desenvolvedor | Após a Fase 3 (Antes do Deploy Final). |

### 4.3 - Plano de Treinamento e Suporte

O sucesso da implementação depende da adoção do sistema pelo usuário final (o professor/administrador).

*   **Treinamento**: Será realizado um treinamento prático, focado nas funcionalidades de CRUD e na interpretação dos relatórios de IC. O treinamento será dividido por módulo (Alunos, Agendamentos, Pagamentos, Relatórios).
*   **Documentação:** Será fornecido um Manual do Usuário detalhado, cobrindo o uso de todas as funcionalidades e a lógica por trás dos cálculos dos KPIs.
*   **Suporte:** Será estabelecido um canal de suporte inicial (ex: WhatsApp ou e-mail) para a primeira semana após o deploy final, garantindo a rápida resolução de dúvidas e pequenos problemas.

## 5 - Front-end do Sistema JPMC English

O sistema de gerenciamento JPMC English apresenta uma interface de usuário (UI) limpa, moderna e funcional, seguindo as tendências de design minimalista e focado na usabilidade. A arquitetura Front-end é claramente modular e orientada a dados, essencial para um aplicativo de gestão (Dashboard/Admin Panel).

### 5.1 - Design e Estética

O design adota uma paleta de cores predominantemente neutra, com branco para o conteúdo e cinza muito claro para o fundo da página, promovendo um layout limpo e com uso eficiente de whitespace. A cor de destaque primária é um azul vibrante, utilizada para botões de ação e para indicar a aba de navegação ativa, direcionando o foco do usuário. Cores adicionais (verde e vermelho/rosa) são empregadas em badges de status na tabela para sinalizar contagens neutras/positivas e alertas, respectivamente. A tipografia sans-serif garante alta legibilidade. O layout é centralizado em um cartão (card) e utiliza componentes padronizados como a Navbar, botões de ação e tabelas de dados paginadas com badges de status.

### 5.2 - Componentes de Navegação e Estrutura

A navegação é intuitiva e persistente, localizada no topo da tela, permitindo que o usuário alterne facilmente entre as principais funcionalidades do sistema:

#### ADICIONAR ALUNOS

**![Imagem: Modal de Adicionar Novo Aluno](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/JPMC-Prints2/Aluno-Create.png)**

Esta imagem mostra a tela de Gerenciamento de Alunos do sistema JPMC English, com o Modal (janela *pop-up*) de “Adicionar novo aluno” aberto. O modal é um formulário de cadastro que solicita as seguintes informações obrigatórias para registrar um novo aluno:

*   Nome (completo)
*   E-mail
*   Telefone
*   Data de Registro

A tela de fundo exibe a lista de alunos já cadastrados em uma tabela, com opções de pesquisa e paginação. O uso do modal permite que o usuário realize a ação de cadastro sem sair do contexto da lista principal.

#### Agendamentos:

**![Imagem: Painel de Agendamentos](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/JPMC-Prints2/Agendamentos.png)**

É um painel de agendamentos que mostra:

*   Um calendário semanal com aulas marcadas por dia e horário.
*   Horários bloqueados (com cadeado).
*   Uma lista à direita com as próximas aulas e suas datas.
*   Permite ver, organizar e navegar entre semanas de aulas dos alunos.

#### ALUNOS

**![Imagem: Lista de Alunos](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/JPMC-Prints2/Alunos.png)**

Exibe uma lista de alunos com as colunas:

*   Nome, E-mail, Telefone, Data de Registro e Próximos Agendamentos.
*   Há uma barra de pesquisa para localizar alunos rapidamente.
*   O botão “+ Adicionar Aluno” permite cadastrar novos alunos.
*   No rodapé, há paginação (mostra 5 de 6 alunos, com botões “Previous” e “Next”).

#### Pagamentos

**![Imagem: Painel de Pagamentos](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/JPMC-Prints2/Pagamentos.png)**

Essa tela mostra o painel de pagamentos do sistema JPMC English.

*   Lista de pagamentos realizados com as colunas:
    *   ID do Pagamento, Aluno, Agendamento, Valor e Recibo.
*   Campo de busca para localizar pagamentos.
*   Botão “+ Registrar pagamento” para adicionar novos registros.
*   Paginação no rodapé (mostra 5 de 8 pagamentos).

#### Registro de Pagamentos

**![Imagem: Modal de Registro de Pagamento](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/Front/RegistrarPagamentopng.png)**

Essa tela mostra o formulário de registro de novo pagamento no sistema JPMC English.

*   Abre como uma janela modal sobre a página de pagamentos.
*   Contém campos para preencher:
    *   Aluno (nome do aluno)
    *   Agendamento
    *   Valor
    *   Recibo
*   Botões:
    *   “Cancelar” → fecha o formulário.
    *   “Registrar pagamento” → salva o novo pagamento.

## 6 - Interface do Sistema (Frontend)

A interface web foi projetada para oferecer controle visual e prático das operações da API:

### 1. Tela de Agendamentos

*   Mostra **calendário semanal** com aulas agendadas.
*   Indica **horários bloqueados** e lista lateral com **próximas aulas**.

### 2. Tela de Alunos

*   Lista **nome, e-mail, telefone e data de registro**.
*   Possui **busca** e opção **“Adicionar aluno”**.

### 3. Tela de Pagamentos

*   Exibe **pagamentos registrados** com ID, aluno, valor e recibo.
*   Inclui **busca, paginação** e botão **“Registrar pagamento”**.

### 4. Modal de Registro de Pagamento

*   Formulário para adicionar pagamento com **Aluno**, **Agendamento**, **Valor** e **Recibo**.
*   Botões para **Cancelar** ou **Confirmar**.
*   Utiliza **banco de dados em memória** (dados são perdidos ao reiniciar).
*   Ideal para **demonstração e testes**.
*   Para produção, integrar com **MySQL ou PostgreSQL**.
*   A documentação Swagger permite testar os endpoints no navegador.

### 7. Relatórios

A tela de Relatórios Financeiros do JPMC English é um exemplo robusto de como a tecnologia pode ser aplicada para otimizar a gestão de receitas e mitigar a inadimplência em instituições de ensino. Ao consolidar filtros temporais, KPIs globais e um detalhamento financeiro por aluno, a ferramenta transforma dados brutos em inteligência gerencial. Sua importância reside na capacidade de fornecer uma visão imediata e acionável da saúde financeira, permitindo que a administração tome decisões proativas, seja para celebrar o sucesso da receita realizada ou para implementar planos de ação eficazes contra as contas a receber. A clareza e a organização das informações apresentadas são essenciais para a manutenção de um fluxo de caixa saudável e para o planejamento estratégico da instituição.

**![Imagem: Modal de Registro de Pagamento](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe8-t2-si-eixo8-t2-g2/blob/main/docs/Img/JPMC-Prints2/Relatorios.png)**

## Indicadores-Chave de Desempenho (KPIs) Globais

A tela apresenta dois Indicadores-Chave de Desempenho (KPIs) de alto nível. A soma desses dois indicadores (R$ 2.000,00) corresponde ao valor total dos serviços faturados ou devidos no período. A proporção entre o Valor Pago e o Valor Pendente (40% pago, 60% pendente) é um KPI crítico que sinaliza a necessidade de ações de cobrança ou a revisão das políticas de pagamento.

| Indicador | Valor Observado (R$) | Significado Gerencial |
|---|---|---|
| **Valor Pago** | R$ 800,00 | Representa a **Receita Realizada** no período, ou seja, o montante que efetivamente entrou no caixa da instituição. |
| **Valor Pendente** | R$ 1.200,00 | Representa o **Contas a Receber** (inadimplência ou valores a vencer), indicando o potencial de receita futura e o risco de crédito. |

## Detalhamento Financeiro por Aluno

O detalhamento tabular é o componente mais valioso para a gestão da inadimplência, pois transforma dados agregados em informações acionáveis. A tabela a seguir demonstra a situação individual dos alunos:

| Aluno | Pagamentos Realizados (Qtd) | Pagamentos Pendentes (Qtd) | Valor Pago (R$) | Valor Pendente (R$) |
|---|---|---|---|---|
| Bianca O | 2 | 2 | 400,00 | 500,00 |
| Enzo Silva Soares | 1 | 1 | 200,00 | 500,00 |
| João Pedro | 1 | 1 | 200,00 | 200,00 |
| **Total** | **4** | **4** | **800,00** | **1.200,00** |

Este nível de granularidade permite:

1. **Identificação de Risco**: O gestor pode identificar imediatamente quais alunos (e.g., Bianca O e Enzo Silva Soares, com R$ 500,00 pendentes cada) representam a maior parte do risco de crédito.

2. **Ações de Cobrança Personalizadas**: A informação detalhada suporta a criação de estratégias de cobrança direcionadas, priorizando os maiores valores ou os alunos com maior histórico de pendências.

3. **Análise de Volume**: A contagem de pagamentos realizados e pendentes (colunas "Pagos" e "Pendentes") oferece um contexto sobre o volume de transações, não apenas o valor monetário.


## 8 - Próximos Passos

1.  Integrar com banco de dados MySQL
2.  Implementar autenticação e autorização
3.  Criar endpoints de relatórios
4.  Adicionar validações de negócio
5.  Implementar testes automatizados
6.  Habilitar CORS para integração com frontend
