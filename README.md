# E-commerce API - Backend

API RESTful para aplicação de e-commerce com autenticação, gerenciamento de produtos, carrinho de compras e sistema de pedidos.

## 🚀 Tecnologias

- **Node.js** + **Express**
- **PostgreSQL** (via node-postgres)
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **PapaParse** para processamento de CSV

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repo>
cd ecommerce-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=seu_secret_super_seguro_aqui
NODE_ENV=development
```

### 4. Configure o banco de dados

Execute o script SQL de migração:

```bash
psql -U seu_usuario -d ecommerce -f migrations/schema.sql
```

Ou conecte-se ao banco e execute manualmente o conteúdo de `migrations/schema.sql`.

### 5. Inicie o servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:5000`

## 📚 Documentação da API

### Autenticação

#### Registrar usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123",
  "role": "CLIENT" // ou "SELLER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "role": "CLIENT"
  },
  "token": "jwt_token"
}
```

#### Obter perfil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Deletar conta (CLIENT)
```http
DELETE /api/auth/account
Authorization: Bearer {token}
```

#### Desativar conta (SELLER)
```http
POST /api/auth/deactivate
Authorization: Bearer {token}
```

---

### Produtos

#### Listar produtos (público)
```http
GET /api/products?search=termo&page=1&limit=12
```

#### Obter produto por ID
```http
GET /api/products/:id
```

#### Criar produto (SELLER)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nome do Produto",
  "price": 99.90,
  "description": "Descrição",
  "image_url": "https://exemplo.com/imagem.jpg"
}
```

#### Criar produtos em lote via CSV (SELLER)
```http
POST /api/products/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
  "products": [
    {
      "name": "Produto 1",
      "price": 50.00,
      "description": "Desc 1",
      "image_url": "url1"
    },
    {
      "name": "Produto 2",
      "price": 75.00,
      "description": "Desc 2",
      "image_url": "url2"
    }
  ]
}
```

**Formato CSV esperado:**
```csv
name,price,description,image_url
Produto 1,50.00,Descrição do produto,https://exemplo.com/img1.jpg
Produto 2,75.00,Outra descrição,https://exemplo.com/img2.jpg
```

#### Listar meus produtos (SELLER)
```http
GET /api/products/seller/my-products
Authorization: Bearer {token}
```

#### Atualizar produto (SELLER)
```http
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nome Atualizado",
  "price": 109.90,
  "description": "Nova descrição",
  "image_url": "https://exemplo.com/nova.jpg"
}
```

#### Deletar produto (SELLER)
```http
DELETE /api/products/:id
Authorization: Bearer {token}
```

---

### Favoritos

#### Listar favoritos
```http
GET /api/products/favorites/list
Authorization: Bearer {token}
```

#### Adicionar aos favoritos
```http
POST /api/products/:productId/favorite
Authorization: Bearer {token}
```

#### Remover dos favoritos
```http
DELETE /api/products/:productId/favorite
Authorization: Bearer {token}
```

---

### Carrinho (CLIENT)

#### Obter carrinho
```http
GET /api/cart
Authorization: Bearer {token}
```

#### Adicionar item ao carrinho
```http
POST /api/cart
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": "uuid-do-produto",
  "quantity": 2
}
```

#### Atualizar quantidade
```http
PUT /api/cart/:product_id
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 5
}
```

#### Remover item
```http
DELETE /api/cart/:product_id
Authorization: Bearer {token}
```

#### Limpar carrinho
```http
DELETE /api/cart
Authorization: Bearer {token}
```

---

### Pedidos (CLIENT)

#### Criar pedido (Checkout)
```http
POST /api/orders
Authorization: Bearer {token}
```

#### Listar histórico
```http
GET /api/orders?page=1&limit=10
Authorization: Bearer {token}
```

#### Obter detalhes do pedido
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

---

### Dashboard (SELLER)

#### Obter estatísticas
```http
GET /api/seller/dashboard
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "dashboard": {
    "total_products": 25,
    "total_sold": 150,
    "total_revenue": "12500.00",
    "top_product": {
      "name": "Produto Mais Vendido",
      "id": "uuid",
      "sold": 45
    }
  }
}
```

---

## 🗂️ Estrutura do Projeto

```
ecommerce-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do PostgreSQL
│   ├── middleware/
│   │   ├── auth.js               # Middlewares de autenticação
│   │   └── validation.js         # Validações com express-validator
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── products.routes.js
│   │   ├── cart.routes.js
│   │   ├── orders.routes.js
│   │   └── seller.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── products.controller.js
│   │   ├── cart.controller.js
│   │   ├── orders.controller.js
│   │   └── seller.controller.js
│   ├── services/
│   │   └── csv.service.js        # Processamento de CSV
│   ├── utils/
│   │   └── queries.js            # Queries SQL organizadas
│   └── index.js                  # Servidor principal
├── migrations/
│   └── schema.sql                # Schema do banco
├── .env                          # Variáveis de ambiente (não commitar)
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- JWT com expiração de 7 dias
- Validação de inputs com express-validator
- Proteção contra SQL injection (queries parametrizadas)
- CORS habilitado

## 📊 Banco de Dados

### Entidades principais:

- **users**: Usuários (CLIENT/SELLER)
- **products**: Produtos cadastrados
- **favorites**: Produtos favoritados
- **cart_items**: Itens do carrinho
- **orders**: Pedidos realizados
- **order_items**: Itens de cada pedido


## 📝 Notas

- O carrinho persiste no banco de dados (não é apenas localStorage)
- Ao desativar conta de vendedor, produtos são automaticamente ocultados
- Ao deletar conta de cliente, histórico de compras é mantido
- Upload de CSV processa produtos em lote de forma eficiente

## 🖥️ Frontend

Este é o frontend do projeto de e-commerce desenvolvido em **Next.js**, focado em performance, experiência do usuário e uma identidade visual que remete a **dinheiro, valor e luxo**.

## Identidade Visual

A paleta de cores principal utiliza tons de:

- **Verde** → associado a **dinheiro, prosperidade, crescimento e confiança**.  
  É uma cor amplamente usada em produtos financeiros e transmite estabilidade e credibilidade ao usuário.

- **Branco** → utilizado para reforçar **luxo, simplicidade, elegância e sofisticação**.  
  Ajuda a criar contraste com o verde e realça o caráter premium da aplicação.

Essa combinação foi escolhida para entregar uma experiência que remete a:
- Exclusividade  
- Segurança  
- Alto valor agregado  
- Limpeza visual  
- Navegação intuitiva

## Tecnologias Utilizadas

- **Next.js 14**
- **React 18**
- **TypeScript**
- **TailwindCSS**

## 🚀 Deploy

- O deploy dessa aplicação foi feito a partir da plataforma Render
- Foi criado 3 enviroments sendo eles: web-api, front-end e database
- É possível estar acessando o site em produção através da URL: **https://e-commerce-frontend-n1p4.onrender.com**

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.