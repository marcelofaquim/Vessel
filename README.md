# ⛵ Vessel — Plataforma de Hospedagens

O **Vessel** é uma aplicação web moderna de hospedagens inspirada no Airbnb, desenvolvida com **Next.js (App Router)**, **TypeScript** e **Tailwind CSS**. A plataforma permite que utilizadores explorem acomodações disponíveis (Modo Viajante) e giram os seus próprios imóveis e anúncios (Modo Anfitrião).

---

## 🚀 Funcionalidades

### 🧳 Modo Viajante
- **Listagem de Imóveis:** Visualização de acomodações com fotos, preços, localizações e capacidade de hóspedes.
- **Autenticação:** Telas completas de Login e Registo para utilizadores.

### 🏠 Modo Anfitrião (Dashboard)
- **Painel do Anfitrião:** Métricas em tempo real sobre anúncios ativos, reservas e faturação estimada.
- **Gestão de Anúncios:** Adição de novos imóveis através de modal interativo e remoção de anúncios existentes.
- **Persistência Local:** Armazenamento de dados no `localStorage` com carregamento otimizado (*lazy initialization*) para evitar re-renders desnecessários.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones & UI:** React Icons / Lucide React
- **Gerenciamento de Estado:** React Context API & `useState` Hook

---

## 💻 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado na sua máquina:
- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- Gerenciador de pacotes (`npm`, `yarn` ou `pnpm`)

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/vessel.git](https://github.com/seu-usuario/vessel.git)
   cd vessel

1. Instalar as dependências:
  npm install
  # ou
  yarn install

2.Iniciar o servidor de desenvolvimento:
  npm run dev
  # ou
  yarn dev

3. Aceder no navegador:
  Abra http://localhost:3000 para ver a aplicação a funcionar.

Estrutura do Projeto

frontend/
├── src/
│   ├── app/
│   │   ├── host/          # Painel do Anfitrião (page.tsx)
│   │   ├── login/         # Página de Login (page.tsx)
│   │   ├── register/      # Página de Registo (page.tsx)
│   │   ├── layout.tsx     # Layout global da aplicação
│   │   └── page.tsx       # Landing page / Modo Viajante
│   ├── contexts/          # Contextos globais (AuthContext, etc.)
│   └── components/        # Componentes reutilizáveis de UI
├── public/                # Ficheiros estáticos
└── package.json

📌 Próximos Passos (Roadmap)
  [ ] Integração com banco de dados relacional (PostgreSQL / Prisma)
  
  [ ] Upload real de imagens de imóveis (AWS S3 / Cloudinary)
  
  [ ] Módulo de reservas com seleção de datas via calendário
  
  [ ] Integração com gateway de pagamentos (Stripe / Mercado Pago)

📄 Licença
Este projeto está sob a licença MIT.

---

### 💡 Dicas antes de enviar para o GitHub:
1. Altere o link `[https://github.com/seu-usuario/vessel.git](https://github.com/seu-usuario/vessel.git)` para o endereço do seu repositório real.
2. Certifique-se de que o ficheiro `.gitignore` está configurado para não enviar a pasta `node_modules` nem o diretório `.next`.
