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
```
├── public/            # Arquivos estáticos
├── app/               # Páginas do App Router
     ├── (protected)   # Páginas e rotas que exigem autenticação
     └── (public)      # Páginas públicas, acessíveis sem login
├── components/        # Componentes reutilizáveis
├── constants/         # Constantes globais do projeto
├── database/          # Contém db.json que simula um banco de dados 
├── hooks/             # Custom hooks do React
├── lib/               # Funções utilitárias e helpers genéricos
├── types/             # Tipagens TypeScript compartilhadas
├── utils/             # Funções auxiliares e chamadas à API
├── Dockerfile         # Arquivo para containerização e deploy
└── README.md          # Documentação do projeto

```


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
  - Listagem de transações;
- **Listagem de transações**
  - Histórico de transações detalhado;
  
