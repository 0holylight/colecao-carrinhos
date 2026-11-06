# 🏎️ Coleção de Carrinhos — API

API REST para colecionadores de miniaturas cadastrarem e organizarem sua coleção: conta própria, login e gerenciamento completo dos carrinhos, incluindo foto de cada peça.

> ✅ **Status:** concluído e publicado · [acessar o app](https://colecao-carrinhos.vercel.app) · [repositório do front-end](https://github.com/0holylight/colecao-carrinhos-frontend)

## Tecnologias

- **Node.js** (ES Modules) + **Express 5**
- **Sequelize** (ORM) + **PostgreSQL** (hospedado no Supabase)
- **Supabase Storage** para as fotos, com **sharp** para reprocessar as imagens
- **JWT** + **cookie-parser** para autenticação
- **bcrypt** para hash de senhas
- **Multer** para receber os uploads
- **Helmet**, **express-rate-limit** e **CORS** para segurança
- Deploy no **Render**

## Funcionalidades

- Cadastro (já com login automático), login, logout e edição de perfil
- CRUD completo de carrinhos (nome, coleção, cor, ano e foto)
- Envio, troca e remoção da foto de cada carrinho
- Limite de 25 carrinhos por coleção
- Cada usuário acessa e edita **apenas os próprios dados**

## Arquitetura em produção

```
Navegador ──► Vercel (front-end React)
                 │  /api/*  (rewrite)
                 ▼
              Render (esta API)
                 ├──► Supabase PostgreSQL (dados)
                 └──► Supabase Storage (fotos, bucket público)
```

O front-end repassa as chamadas de `/api` para o Render. Assim, para o navegador, front e API estão no **mesmo domínio**: o cookie de sessão funciona com `sameSite: strict`, sem depender de cookies de terceiros. Como a API fica atrás de dois intermediários (Vercel e Render), o Express usa `trust proxy` para enxergar o IP real de quem faz a requisição, que é o dado usado pelo rate limit.

## Segurança

Segurança foi prioridade desde o início do projeto:

- **JWT em cookie httpOnly**, com `sameSite: strict`, `secure` em produção e validade de 30 minutos: o token não fica acessível via JavaScript no navegador, reduzindo o risco de roubo por XSS
- **Senhas com hash bcrypt**, nunca armazenadas em texto puro
- **Mensagem de erro genérica no login**, a mesma para usuário inexistente e senha errada, para não revelar quais usuários existem
- **Dados de outros usuários respondem 404**, e não 403, para não confirmar que aquele ID existe
- **Rate limit** no login (20 tentativas a cada 10 minutos por IP) e na criação de contas (5 por hora por IP)
- **Validação de tipos e tamanhos** nos dados recebidos (nome, usuário e senha com limite de caracteres; ano entre 1968, lançamento da Hot Wheels, e o ano atual); JSON malformado recebe 400
- **Uploads validados** por tipo (JPEG, PNG e GIF) e tamanho (até 8 MB)
- **Metadados removidos das fotos** JPEG e PNG (como a localização GPS) ao reprocessar a imagem, e nomes de arquivo aleatórios (UUID)
- **Sem fotos órfãs:** ao trocar, remover ou excluir, a foto antiga é apagada do Storage, sempre depois que o banco foi atualizado
- **Helmet** para cabeçalhos HTTP de segurança e **tratamento centralizado de erros**

## Rotas

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/usuarios` | Cadastro de usuário (já inicia a sessão) | — |
| GET | `/usuarios/me` | Usuário da sessão atual | ✅ |
| GET | `/usuarios/:id` | Perfil do usuário, com total de carrinhos | ✅ |
| PUT | `/usuarios/:id` | Editar perfil (nome) | ✅ |
| POST | `/tokens` | Login (define o cookie) | — |
| DELETE | `/tokens` | Logout (apaga o cookie) | — |
| POST | `/carros` | Cadastrar carrinho (com foto) | ✅ |
| GET | `/carros` | Listar carrinhos do usuário | ✅ |
| PUT | `/carros/:id` | Editar carrinho (foto opcional) | ✅ |
| DELETE | `/carros/:id` | Excluir carrinho | ✅ |
| DELETE | `/carros/:id/photo` | Remover só a foto do carrinho | ✅ |

- Cadastro e edição de carrinhos recebem `multipart/form-data`, com a imagem no campo `photo`.
- O logout não exige sessão válida de propósito: quem está com o token expirado também precisa conseguir sair.

## Modelagem

- **User:** `name`, `username` (único), `password` (hash)
- **Car:** `name`, `collection` (opcional), `color`, `year`, `photoUrl` (opcional, endereço público no Supabase Storage)
- **Relacionamento:** um usuário tem muitos carrinhos (1:N)

Cada registro de `Car` representa uma miniatura física da coleção: dois exemplares do mesmo modelo em cores diferentes são dois registros.

## Como rodar localmente

Você vai precisar de **Node.js**, um banco **PostgreSQL** e um projeto no **Supabase** com um bucket público chamado `car-photos` (para as fotos).

```bash
# clone o repositório
git clone https://github.com/0holylight/colecao-carrinhos.git
cd colecao-carrinhos

# instale as dependências
npm install

# configure as variáveis de ambiente
cp .env.example .env
# preencha o .env conforme a lista abaixo

# rode em modo de desenvolvimento
npm run dev
```

A API sobe em `http://localhost:3001`, e as tabelas são criadas automaticamente na primeira execução.

### Variáveis de ambiente

```env
# Banco de dados (PostgreSQL)
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=

# Supabase Storage (fotos)
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# Autenticação
JWT_SECRET=

# Servidor
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> `SUPABASE_SERVICE_KEY` é a chave de serviço do Supabase: ela fica só no back-end e nunca deve ir para o front-end ou para o repositório.

## Pendências conhecidas

O `npm audit` ainda aponta vulnerabilidades moderadas em dependências indiretas que só seriam corrigidas com `npm audit fix --force`, que **rebaixaria** pacotes e quebraria o projeto:

- `uuid`, via **Sequelize**: a correção forçada rebaixaria o Sequelize para a versão 3
- dependências do **nodemon**, usado só em desenvolvimento (não vai para produção)

Essas correções não foram forçadas; a ideia é acompanhar as próximas versões do Sequelize e do nodemon.

## Próximos passos

- [ ] Testes automatizados (Jest) nas rotas principais
- [ ] Filtro da coleção por coleção de lançamento e ano (`?colecao=&ano=`)
- [ ] IDs não sequenciais (UUID) como defesa extra contra enumeração
- [ ] Tela de perfil no front-end (as rotas já existem)

## Autor

**Guilherme Almeida** · [LinkedIn](https://www.linkedin.com/in/guilherme-almeida00/)

