# 🏎️ Coleção de Carrinhos — API

API REST para colecionadores de miniaturas cadastrarem e organizarem sua coleção: conta própria, login e gerenciamento completo dos carrinhos, incluindo foto de cada peça.

> 🚧 **Status:** back-end concluído · front-end em construção ([repositório do front-end](https://github.com/0holylight/colecao-carrinhos-frontend))

## Tecnologias

- **Node.js** (ES Modules) + **Express**
- **Sequelize** (ORM) + **PostgreSQL** (hospedado no Supabase)
- **JWT** + **cookie-parser** para autenticação
- **bcrypt** para hash de senhas
- **Multer** para upload de imagens
- **Helmet**, **express-rate-limit** e **CORS** para segurança

## Funcionalidades

- Cadastro, login e edição de perfil de usuário
- CRUD completo de carrinhos (nome, coleção, cor, ano e foto)
- Upload de foto por carrinho
- Cada usuário acessa e edita **apenas os próprios dados**

## Segurança

Segurança foi prioridade desde o início do projeto:

- **JWT em cookie httpOnly**, com `sameSite: strict` e `secure` em produção: o token não fica acessível via JavaScript no navegador, reduzindo o risco de roubo por XSS
- **Senhas com hash bcrypt**, nunca armazenadas em texto puro
- **Mensagem de erro genérica no login**, a mesma para usuário inexistente e senha errada, para não revelar quais usuários existem
- **Rate limit** nas tentativas de login
- **Validação de uploads** por tipo (mimetype) e tamanho máximo de arquivo
- **Validação de dados** no model (limites de tamanho de nome, usuário e senha; ano entre 1968, lançamento da Hot Wheels, e o ano atual)
- **Helmet** para cabeçalhos HTTP de segurança e **tratamento centralizado de erros**

## Rotas

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/usuarios` | Cadastro de usuário | — |
| GET | `/usuarios/:id` | Perfil do usuário | ✅ |
| PUT | `/usuarios/:id` | Editar perfil | ✅ |
| POST | `/tokens` | Login (define o cookie) | — |
| POST | `/carros` | Cadastrar carrinho (com foto) | ✅ |
| GET | `/carros` | Listar carrinhos do usuário | ✅ |
| GET | `/carros/:id` | Detalhar carrinho | ✅ |
| PUT | `/carros/:id` | Editar carrinho | ✅ |
| DELETE | `/carros/:id` | Excluir carrinho | ✅ |

## Modelagem

- **User:** `name`, `username` (único), `password` (hash)
- **Car:** `name`, `collection` (opcional), `color`, `year`, `photoUrl` (opcional)
- **Relacionamento:** um usuário tem muitos carrinhos (1:N)

Cada registro de `Car` representa uma miniatura física da coleção: dois exemplares do mesmo modelo em cores diferentes são dois registros.

## Como rodar localmente

```bash
# clone o repositório
git clone https://github.com/0holylight/colecao-carrinhos.git
cd colecao-carrinhos

# instale as dependências
npm install

# configure as variáveis de ambiente
cp .env.example .env
# preencha o .env com os dados do seu banco PostgreSQL

# rode em modo de desenvolvimento
npm run dev
```

### Variáveis de ambiente

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
NODE_ENV=development
```

## Próximos passos

- [ ] Rota de logout
- [ ] Limite de carrinhos por usuário
- [ ] Testes automatizados (Jest)
- [ ] Deploy da API
- [ ] Armazenamento de fotos em object storage

## Autor

**Guilherme Almeida** · [LinkedIn](https://www.linkedin.com/in/guilherme-almeida00/)
