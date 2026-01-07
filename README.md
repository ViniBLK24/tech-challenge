# Tech Challenge

Esse projeto é um trabalho da Pós Graduação Front-end Engineering da Fiap.

## Proposta

Desenvolver o frontend para um aplicação de gerenciamento financeiro utilizando Next.js e Design System.

**O objetivo:**

- Criar uma interface que permita aos usuários gerenciar suas transações financeiras;
- Aplicar os conceitos de Programação Orientada a Objetos (POO).

### Requisitos do desafio

Estrutura e Design da Interface:

**1.** **Home Page**

- Página inicial simples que dá boas-vindas aos usuários;
- Exibir informações sobre o saldo da conta corrente e um extrato das últimas transações;
- Incluir uma seção para iniciar uma nova transação, com opções para selecionar o tipo de transação e inserir o valor.

**2.** **Listagem de Transações**

- Página que exibe a lista de transações realizadas, com opções para visualizar detalhes, editar e deletar cada transação.

**3.** **Adicionar Nova Transação**

- Página ou modal para adicionar uma nova transação ao banco de dados;
- Formulário que deve incluir campos como tipo de transação (depósito, transferência, etc), valor e data.

**4.** **Editar Transação**

- Uma página ou modal para editar as informações de uma transação existente.

### Telas
![prints-figma](https://github.com/user-attachments/assets/84474b82-546c-49f8-a952-dcf9a8fee48b)

## Começando

Para executar o código localmente siga as próximas etapas:

### Instalação

**1.** Clone o repositório:

```sh
  git clone https://github.com/ViniBLK24/tech-challenge.git
```

**2.** Baixe as dependências do projeto:

```sh

   npm install
```

**3.** Configure as variáveis de ambiente:
<br>Crie o arquivo ```.env.local``` na raiz do projeto com as keys disponibilizadas no arquivo enviado na entrega do projeto.

**4.** Execute o seu projeto local:

```sh
   npm run dev
```

## Estrutura do Projeto

Este projeto segue os princípios da **Clean Architecture**, organizando o código em camadas bem definidas para facilitar manutenção, testes e escalabilidade.

### Arquitetura

```
src/
├── domain/                    # Camada de Domínio (Regras de Negócio)
│   ├── entities/              # Entidades do domínio (Transaction, User)
│   ├── use-cases/             # Casos de uso (lógica de negócio)
│   │   ├── transactions/      # Use cases de transações
│   │   └── users/             # Use cases de usuários
│   ├── services/              # Serviços de domínio
│   └── constants/             # Constantes do domínio (códigos de erro)
│
├── infrastructure/            # Camada de Infraestrutura
│   ├── database/              # Repositório de banco de dados
│   │   └── data/              # Arquivo db.json
│   ├── storage/               # Serviços de armazenamento (S3)
│   ├── repositories/          # Implementações de repositórios
│   └── api/                   # Clientes de API e rotas
│       ├── routes/            # Rotas da API (Next.js API Routes)
│       └── clients/           # Clientes HTTP para APIs externas
│
├── presentation/              # Camada de Apresentação (UI)
│   ├── components/           # Componentes React
│   │   ├── ui/               # Componentes de UI reutilizáveis
│   │   ├── transactions/     # Componentes específicos de transações
│   │   └── login/            # Componentes de autenticação
│   ├── hooks/                # Custom hooks do React
│   └── api/                  # Clientes de API para a camada de apresentação
│
├── shared/                    # Código compartilhado
│   ├── lib/                  # Utilitários e helpers genéricos
│   ├── types/                # Tipos compartilhados (auth, etc)
│   └── constants/            # Constantes compartilhadas
│
└── app/                       # Next.js App Router
    ├── (protected)/          # Páginas protegidas (requerem autenticação)
    ├── (public)/             # Páginas públicas
    └── api/                  # API Routes do Next.js

├── public/                    # Arquivos estáticos
├── Dockerfile                 # Containerização
└── README.md                  # Documentação
```

### Princípios da Arquitetura

#### 1. **Domain Layer (Domínio)**
- Contém as **entidades** e **regras de negócio** puras
- Independente de frameworks e bibliotecas externas
- **Use Cases**: Encapsulam a lógica de negócio (criar transação, calcular saldo, etc)
- **Services**: Serviços de domínio (sugestão de categoria, etc)

#### 2. **Infrastructure Layer (Infraestrutura)**
- Implementa detalhes técnicos (banco de dados, S3, APIs externas)
- **Repositories**: Abstraem o acesso a dados
- **Storage Services**: Gerenciam armazenamento em nuvem (S3)
- **API Clients**: Clientes HTTP para comunicação com APIs

#### 3. **Presentation Layer (Apresentação)**
- Componentes React e lógica de UI
- **Components**: Componentes reutilizáveis e específicos
- **Hooks**: Custom hooks para lógica de apresentação
- **API Clients**: Clientes que fazem chamadas às rotas da API

#### 4. **Shared Layer (Compartilhado)**
- Código compartilhado entre camadas
- Utilitários genéricos, tipos compartilhados e constantes

### Fluxo de Dados

```
Presentation → Domain (Use Cases) → Infrastructure (Repositories) → Database
     ↓                ↓                        ↓
  Components    Business Logic          Data Access
```

### Benefícios

- ✅ **Separação de responsabilidades**: Cada camada tem uma responsabilidade clara
- ✅ **Testabilidade**: Fácil de testar cada camada isoladamente
- ✅ **Manutenibilidade**: Mudanças em uma camada não afetam outras
- ✅ **Escalabilidade**: Fácil adicionar novas funcionalidades
- ✅ **Reutilização**: Use cases e serviços podem ser reutilizados


## Swagger
Para acessar o swagger, entre na rota ```/docs```. Lá, você encontrará a documentação da API de transações.

## Tecnologias Utilizadas
- **Next.js** - 15.3.2
- **Tailwind CSS** - 3.3.0
- **shadcn/iu** - componentes estilizados
- **lucide-react** - ícones
- **AWS S3** - armazenamento de arquivos
- **Docker** - containerização e deploy
- **Swagger** - documentação da API

## Funcionalidades
- Login e registro de usuários;
- Interface responsiva com práticas de acessibilidade implementadas;
- **Transações:**
  - Criação, listagem e exclusão de transações;
  - Validação de entrada avançada;
  - Sugestões automáticas para categorias, baseadas na descrição da transação;
  - Upload de recibos (imagem ou PDF) para nuvem (AWS S3);
  - Modal para edição de transações existentes;
- **Dashboard:**
  - Visualização do saldo atual da conta;
    - Opção de ocultar e exibir o saldo;
    - Atualização automática do saldo;
  - Criação de transação;
  - Listagem de transações;
  - Gráfico de entradas e saídas;
- **Listagem de transações**
  - Histórico de transações detalhado;
  
