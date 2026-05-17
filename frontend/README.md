# Frontend — URL Shortener Platform

Interface web do URL Shortener, construída com Next.js 14 e TailwindCSS.

## Stack Técnica

| Camada          | Tecnologia                          |
|-----------------|-------------------------------------|
| Framework       | Next.js 14 (App Router)             |
| Linguagem       | TypeScript                          |
| Estilização     | TailwindCSS + PostCSS               |
| HTTP Client     | Fetch API nativa                    |
| Autenticação    | JWT (armazenado em localStorage)    |
| Deploy          | Vercel                              |

## Arquitetura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout global (header + footer)
│   │   ├── page.tsx        # Página principal (auth + shortener)
│   │   └── globals.css     # Estilos globais + Tailwind
│   └── lib/
│       └── api.ts          # Cliente HTTP para o API Gateway
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Funcionalidades

- Login / Registro com JWT
- Encurtamento de URLs
- Listagem de URLs do usuário com contagem de hits
- Exclusão de URLs
- Sessão persistida no localStorage

## Comunicação com o Backend

O frontend se comunica exclusivamente com o **API Gateway** (Spring Cloud Gateway) que roteia as requisições:

- `POST /auth/login` — Autenticação
- `POST /auth/register` — Registro
- `POST /api/shorten` — Criar URL curta
- `GET /api/urls` — Listar URLs do usuário
- `DELETE /api/urls/{shortCode}` — Excluir URL
- `GET /api/analytics/{code}` — Estatísticas

## Variáveis de Ambiente

| Variável              | Descrição                                | Default                  |
|-----------------------|------------------------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL` | URL do API Gateway                       | `http://localhost:9090`  |

Veja `.env.example` para referência.

## Como Rodar

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Build para Produção

```bash
npm run build
npm start
```

## Deploy (Vercel)

1. Importe o repositório no [Vercel](https://vercel.com)
2. Root directory: `frontend`
3. Defina `NEXT_PUBLIC_API_URL` apontando para o gateway em produção
