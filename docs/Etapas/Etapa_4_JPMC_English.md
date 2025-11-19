# Etapa 4 - Planejamento Estratégico de TI

## 4.1 PETI (Plano Estratégico de Tecnologia da Informação)

### Finalidade do PETI

O Plano Estratégico de Tecnologia da Informação (PETI) para a JPMC English tem como finalidade **dar continuidade ao uso estratégico da TI** na empresa, transformando o Sistema de Gestão Estratégica (SGE) recém-desenvolvido de uma ferramenta operacional para um ativo de inteligência competitiva e um pilar para o crescimento sustentável do negócio. O PETI visa garantir que os investimentos em TI estejam alinhados com a estratégia de expansão e personalização do ensino da JPMC English, conforme definido nas etapas anteriores [1] [2].

### Pontos Fortes e Limitações do SGE

A solução customizada (SGE) implementada na Etapa 3, utilizando React, Python e MySQL, representa um avanço significativo para a JPMC English.

| Categoria | Pontos Fortes | Limitações Atuais |
| :--- | :--- | :--- |
| **Inteligência Competitiva** | Centralização de dados de alunos, agendamentos e pagamentos. | Foco inicial em CRUDs; o módulo de relatórios e dashboards (IC) ainda está em fase de implementação. |
| **Operacional** | Automação do registro de aulas, status e pagamentos, reduzindo erros manuais. | Dependência de *deploy* local na máquina do administrador, o que limita o acesso e a escalabilidade. |
| **Tecnologia** | Uso de tecnologias React, Python, MySQL. | 
| **Conformidade** | Previsão de campos para consentimento e registro de origem de matrícula, visando a LGPD. | Necessidade de formalizar a Política de Privacidade e os procedimentos de eliminação de dados. |

### Diretrizes Estratégicas de TI

As diretrizes estratégicas de TI visam a evolução do SGE e a integração de novas tecnologias para suportar a expansão da JPMC English.

| Diretriz | Descrição | Foco Estratégico |
| :--- | :--- | :--- |
| **Evolução da Plataforma** | Migrar o SGE para um ambiente de hospedagem em nuvem (ex: AWS, Google Cloud, Heroku) para garantir alta disponibilidade, acesso remoto e escalabilidade. | Escalabilidade e Disponibilidade |
| **Inteligência Pedagógica** | Integrar funcionalidades de acompanhamento de desempenho do aluno (ex: registro de notas, *feedback* de aulas, trilhas de aprendizado) para aprimorar a personalização do ensino. | Qualidade e Personalização do Serviço |
| **Automação de Marketing e Vendas** | Integrar o SGE com ferramentas de comunicação (ex: e-mail marketing, WhatsApp Business API) para automatizar a prospecção, o envio de lembretes de aula e a coleta de *feedback*. | Prospecção e Retenção de Clientes |
| **Otimização Financeira** | Integrar o SGE com plataformas de pagamento online (ex: PagSeguro, Stripe) para automatizar a cobrança, reduzir a inadimplência e simplificar a conciliação financeira. | Eficiência Financeira |

### Objetivos Estratégicos de TI

Os objetivos de TI são definidos em três horizontes de tempo, alinhados com as diretrizes de evolução e crescimento da empresa.

| Horizonte | Prazo | Objetivo Estratégico | Indicadores de Sucesso |
| :--- | :--- | :--- | :--- |
| **Curto Prazo** | 0 a 2 meses | **Estabilização e Uso Pleno do SGE:** Concluir a implementação do módulo de Relatórios/Dashboards (IC) e garantir a adoção de 100% das funcionalidades operacionais (CRUDs). | Número de usuários ativos (1); Frequência de uso do sistema (Diária); Taxa de preenchimento de dados (100%). |
| **Médio Prazo** | 6 a 12 meses | **Disponibilidade e Segurança:** Migrar o SGE para a nuvem e implementar autenticação robusta (login/senha) e testes de segurança. | Disponibilidade do sistema (99,9%); Tempo de resposta a decisões (Redução de 50% no tempo para gerar relatórios); Zero falhas de segurança críticas. |
| **Longo Prazo** | 1 a 2 anos | **Expansão e Integração:** Integrar o SGE com sistemas de pagamento e comunicação, e desenvolver o módulo de Inteligência Pedagógica. | Redução de perdas operacionais (Redução de 80% na inadimplência); Aumento da taxa de retenção de alunos (5%); Aumento da base de alunos (20%). |

### Indicadores de Acompanhamento (KPIs)

Os indicadores a seguir devem ser monitorados para avaliar o sucesso do PETI e o impacto do SGE no negócio:

1.  **Número de Usuários Ativos:** Mede a adoção do sistema. (Meta: 100% do corpo administrativo/pedagógico).
2.  **Frequência de Uso do Sistema:** Mede a regularidade do uso. (Meta: Uso diário para registro de aulas e pagamentos).
3.  **Redução de Perdas Operacionais:** Mede a eficiência, principalmente na gestão da inadimplência. (Meta: Redução de 80% dos atrasos de pagamento).
4.  **Tempo de Resposta a Decisões:** Mede a agilidade na obtenção de informações estratégicas. (Meta: Geração de relatórios de IC em menos de 5 minutos).
5.  **Taxa de Retenção de Alunos:** Indicador de negócio que reflete a qualidade do serviço e a eficácia da personalização. (Meta: Aumento de 5% ao ano).

---

## 4.2 Auditoria e Governança de TI (para pequenas empresas)

A Governança e Auditoria de TI para a JPMC English devem ser implementadas de forma **simplificada e prática**, focando em boas práticas que garantam a segurança, a continuidade e a conformidade legal, sem a complexidade de grandes estruturas.

### Segurança e Proteção de Dados (LGPD Simplificada)

A JPMC English lida com dados pessoais (clientes, fornecedores, colaboradores), e a conformidade com a Lei Geral de Proteção de Dados (LGPD) é essencial [2].

| Aspecto | Prática Recomendada (Simples e Viável) |
| :--- | :--- |
| **Tratamento de Dados Pessoais** | **Consentimento Explícito:** Incluir um campo de *checkbox* no cadastro do aluno no SGE (ou ficha de matrícula) onde ele concorda com a Política de Privacidade e o uso dos dados para fins pedagógicos e administrativos. |
| **Controle de Acesso** | **Acesso Mínimo Necessário:** Apenas o administrador/proprietário deve ter acesso total ao SGE. Se houver um segundo colaborador (ex: professor auxiliar), este deve ter acesso restrito apenas às funcionalidades operacionais (agendamento e registro de aulas), sem acesso a dados financeiros ou de *feedback* sensível. |
| **Política de Senhas** | **Senhas Fortes e Periódicas:** Utilizar senhas com no mínimo 8 caracteres, combinando letras maiúsculas, minúsculas, números e símbolos. Troca obrigatória a cada 90 dias. |
| **Eliminação de Dados** | **Procedimento Simples:** Criar um procedimento documentado para exclusão de dados de ex-alunos, garantindo que, após um período de inatividade (ex: 1 ano), os dados sejam anonimizados ou excluídos do SGE e dos backups, se solicitado pelo titular. |

### Continuidade e Controle (Plano de Contingência)

O objetivo é garantir que a empresa possa operar rapidamente em caso de falha no sistema ou perda de dados.

| Aspecto | Prática Recomendada (Plano de Contingência) |
| :--- | :--- |
| **Backup Periódico** | **Backup 3-2-1 Simplificado:** Realizar **backup semanal** do banco de dados (MySQL) e dos arquivos do sistema. Armazenar: **1** cópia local (no computador do administrador), **1** cópia em nuvem (ex: Google Drive ou OneDrive) e **1** cópia em um disco externo. |
| **Ferramentas Confiáveis** | Utilizar apenas ferramentas e serviços de nuvem reconhecidos (Google Workspace, Microsoft 365, etc.) para comunicação e armazenamento de documentos, evitando soluções não seguras. |
| **Registro de Mudanças** | **Log Simples:** Manter um registro simples (em uma planilha ou arquivo de texto) de todas as mudanças significativas no SGE (ex: "Instalação da Fase 2 do SGE em 15/03/2026", "Atualização do Python para versão X.Y"). |
| **Plano de Recuperação** | **Procedimento de Emergência:** Documentar o passo a passo para restaurar o sistema a partir do backup em nuvem em caso de falha total do computador principal. Este documento deve ser acessível fora do computador principal (ex: impresso ou salvo em outro dispositivo). |

### Governança Simplificada e Responsabilidades

A governança deve focar na clareza de papéis e na garantia de que o SGE continue a agregar valor ao negócio.

| Aspecto | Prática Recomendada |
| :--- | :--- |
| **Responsabilidades** | **Dono do Sistema (System Owner):** O proprietário da JPMC English é o responsável final pela manutenção, segurança e evolução do SGE. |
| **Regras de Uso** | **Manual Básico:** Criar um **Manual Básico de Uso** (documento de 1-2 páginas ou vídeo demonstrativo) para novos colaboradores, definindo como registrar aulas, pagamentos e consultar relatórios. |
| **Avaliação Periódica** | **Revisão Trimestral:** A cada três meses, o proprietário deve revisar os relatórios de IC do SGE para avaliar se o sistema está cumprindo sua função de apoiar as decisões e se os KPIs estão sendo atingidos. |
| **Gestão do Conhecimento** | **Base de Conhecimento:** Manter a documentação do SGE (modelo de dados, requisitos, plano de implementação) em um local seguro e acessível (ex: pasta na nuvem) para facilitar a transição de desenvolvedores ou a contratação de novos profissionais. |

