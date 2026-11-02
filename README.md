# Apple Premium — Website Concept

Website multipáginas premium para loja de tecnologia Apple, com identidade visual editorial inspirada em campanhas cinematográficas.

## Stack

- React 18 + Vite
- React Router DOM
- Lucide React (ícones)
- GSAP (disponível para animações)
- Supabase (autenticação administrativa, catálogo e imagens)
- LocalStorage (persistência do carrinho)
- CSS3 puro (glassmorphism, gradientes, variáveis)

## Funcionalidades

- Navegação multipáginas com sidebar glassmorphism
- Catálogo com filtros combináveis e ordenação
- Páginas individuais de produto
- Carrinho funcional com persistência
- Busca em tempo real
- Design responsivo (desktop → mobile)
- Identidade visual consistente em todas as páginas

## Páginas

1. **Home** — Hero editorial, destaques, categorias, lançamentos, ofertas
2. **Produtos** — Catálogo completo com filtros
3. **Detalhe do Produto** — Galeria, specs, opções, relacionados
4. **Categorias** — Grid visual de categorias
5. **Ofertas** — Promoções e descontos
6. **Sobre nós** — Institucional
7. **Contato** — Formulário + canais

## Como rodar

```bash
cd apple-premium
npm install
npm run dev
```

Abra http://localhost:5173

## Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com/) e copie a URL e a chave publicável (ou a chave `anon`) em `.env.local`, usando `.env.example` como modelo. Nunca coloque uma chave `service_role` em variáveis `VITE_*`.
2. No SQL Editor do Supabase, execute `supabase/migrations/202611020001_initial_schema.sql`. A migração cria as tabelas, índices, políticas RLS, categorias, configurações da loja e o bucket público de imagens de produto.
3. Crie o usuário administrador em **Authentication → Users**. Depois, promova somente esse usuário executando no SQL Editor (substitua o e-mail):

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (
     select id from auth.users where email = 'admin@sualoja.com'
   );
   ```

4. Reinicie o Vite depois de configurar `.env.local` e entre em **Configurações** com o e-mail e a senha desse usuário.
5. No painel, use **Importar catálogo inicial** para copiar os produtos demonstrativos para o banco. A importação pode ser repetida sem duplicar produtos. Produtos novos e imagens enviados pelo painel ficam no Supabase.

O navegador usa somente a URL e a chave publicável. A autorização de administrador e o acesso a dados são validados no Supabase com Auth e Row Level Security; não exponha chaves `service_role`. O catálogo demonstrativo local continua disponível enquanto o Supabase não estiver configurado. O carrinho e o checkout por WhatsApp ainda são locais/externos; as tabelas de pedidos, mensagens e configurações estão preparadas para integrações futuras, mas o envio dessas entidades ao banco não foi conectado nesta etapa.

Para deploy, configure as mesmas variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente da Vercel.

## Deploy na Vercel

Importe este repositório na Vercel com a raiz do projeto (`apple-premium`). A configuração em `vercel.json` define `npm run build`, publica a pasta `dist` e direciona URLs das páginas para o app, permitindo abrir rotas como `/produtos` e `/produto/1` diretamente.

Também é possível publicar pela CLI da Vercel após instalar as dependências:

```bash
npx vercel
```

## Estrutura

```
src/
  components/   # Sidebar, Cart, Search, ProductCard, Footer, Layout
  context/      # CartContext (LocalStorage)
  data/         # products.js (dados demonstrativos)
  pages/        # Home, Products, ProductDetail, Categories, Offers, About, Contact
  styles/       # global.css
```

## Notas

- Dados de produtos são mockados e prontos para integração com API/backend.
- Imagens via Unsplash (substituir por assets próprios em produção).
- Carrinho persiste no LocalStorage do navegador.
- Preparado para evolução com gateway de pagamento e banco de dados.
