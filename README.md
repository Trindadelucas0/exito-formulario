# Exito Formulário

Aplicação Express + EJS que substitui o SheetMonkey: os formulários de **Constituição de Empresa** e **Alteração Contratual** salvam as respostas em arquivos JSON (`data/constituicao.json` e `data/alteracao-contratual.json`), e um painel admin protegido por login permite consultar e copiar essas informações.

## Estrutura

```
server.js                  # bootstrap do Express
src/routes/                # rotas públicas, API e admin
src/controllers/           # regras de cada rota
src/services/              # jsonStore (persistência) e formatadores de Q&A
src/middleware/            # requireAuth (protege /admin)
data/                      # "banco de dados" em JSON (não versionado)
views/                     # templates EJS
public/                    # CSS e JS servidos ao navegador
```

## Rodando localmente

```bash
npm install
copy .env.example .env    # no Windows (ou "cp" no Linux/Mac)
npm start
```

Edite o `.env` e defina `ADMIN_USER`, `ADMIN_PASS` e `SESSION_SECRET` antes de subir em produção.

Acesse (porta padrão `5050`, ajuste no `.env` se necessário):

- `http://localhost:5050/` — Ficha de Constituição de Empresa
- `http://localhost:5050/alteracao-contratual` — Ficha de Alteração Contratual
- `http://localhost:5050/admin/login` — Painel administrativo

### Atenção às portas já usadas no servidor

Antes de definir `PORT` no `.env` de produção, confira quais portas já estão ocupadas por outros serviços no seu servidor (painéis, containers, outros apps Node etc.). No servidor via SSH:

```bash
ss -tulnp | grep LISTEN
```

Evite reutilizar portas que já aparecem em uso (por exemplo, 22 é a porta do próprio SSH e nunca deve ser usada pela aplicação). Escolha uma porta livre e defina em `PORT=` no `.env`.

## Deploy no servidor (GitHub + PM2)

```bash
git clone <url-do-repositorio>
cd exito-formulario
npm install --production
cp .env.example .env
# edite o .env com PORT, ADMIN_USER, ADMIN_PASS e SESSION_SECRET reais

pm2 start ecosystem.config.js
pm2 save
```

Os arquivos `data/constituicao.json` e `data/alteracao-contratual.json` são criados automaticamente na primeira execução, caso não existam.

Para acompanhar logs: `pm2 logs exito-formulario`. Para reiniciar após atualizar o código: `git pull && pm2 restart exito-formulario`.
