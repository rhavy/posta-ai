Postaí — uma rede simples e direta para compartilhar ideias, textos, links ou reflexões.

🏗️ Estrutura de Funcionalidades
🔓 Público (sem login)
- Home com feed de posts (ordem cronológica ou popularidade)
- Visualização de post completo
- Busca por título ou autor
- Página de login/cadastro
🔐 Logado
- Pode comentar nos posts
- Acessa área pessoal:
- Criar novo post
- Editar/deletar seus posts
- Ver comentários recebidos
- Perfil com avatar, bio e lista de posts


🚀 Comandos Iniciais
1. Criar projeto Next.js com TypeScript
npx create-next-app@latest posta-ai --typescript
cd posta-ai


2. Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Configure tailwind.config.js e globals.css como mencionei antes.
3. Instalar Prisma
npm install prisma --save-dev
npx prisma init


Configure .env com sua DATABASE_URL e crie o schema acima. Depois:
npx prisma migrate dev --name init


4. Instalar shadcn/ui
npx shadcn-ui@latest init


Adicione componentes:
npx shadcn-ui@latest add button input textarea card


5. Autenticação (opcional)
Use NextAuth.js ou Lucia para login com segurança.

🧩 Extras que você pode adicionar depois
- Likes nos posts
- Tags ou categorias
- Upload de imagem (usando Cloudinary ou UploadThing)
- Dark mode com Tailwind
- API REST ou GraphQL

Se quiser, posso te ajudar a montar a primeira página, criar os componentes com shadcn/ui ou configurar a autenticação. Quer começar pela home ou pela área de criação de post?

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
