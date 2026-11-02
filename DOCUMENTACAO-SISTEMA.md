# Êxito Formulário — Documentação do Sistema

| Item | Valor |
|------|-------|
| Versão do sistema | 1.0.1 — Cadastro completo de novos sócios |
| Última atualização | 02/11/2026 — ficha completa de novos sócios na alteração contratual |
| Fonte oficial | Este arquivo |

## 1. Como usar este documento

Este documento é a fonte oficial do comportamento dos formulários públicos e do painel administrativo. O README permanece como guia de instalação e execução.

## 2. Tecnologias utilizadas

- Node.js e Express para servidor e rotas.
- EJS para as páginas.
- JavaScript e CSS sem framework no navegador.
- Arquivos JSON em `data/` para persistência das fichas enviadas.

### 2.1 Histórico de versões

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0.1 | 02/11/2026 | Cadastro de 0 a 5 novos sócios com ficha completa na Alteração Contratual. |
| 1.0.0 | Anterior | Constituição de Empresa, Alteração Contratual e painel administrativo. |

## 3. Mapa de telas e conexões

| Tela | Rota | Ação | Destino |
|------|------|------|---------|
| Constituição de Empresa | `/` ou `/constituicao` | Enviar ficha | `/api/constituicao` e `data/constituicao.json` |
| Alteração Contratual | `/alteracao-contratual` | Enviar solicitação | `/api/alteracao-contratual` e `data/alteracao-contratual.json` |
| Painel administrativo | `/admin` | Consultar e copiar fichas | Arquivos JSON de submissões |

## 4. Papéis e acesso

- Os formulários de Constituição e Alteração Contratual são públicos.
- O painel administrativo exige a sessão configurada pelo login de administrador.

## 5. Índice de rotas e onde olhar no código

| Comportamento | Onde olhar |
|---------------|------------|
| Tela de Alteração Contratual | `views/alteracao-contratual.ejs` |
| Campos dinâmicos e envio | `public/js/form-alteracao.js` |
| Validação do pedido | `src/services/alteracaoValidator.js` |
| Formatação para painel e cópia | `src/services/alteracaoFormatter.js` |
| Gravação da alteração | `src/controllers/alteracaoController.js` |

## 6. Telas e fluxos

### 6.1 Alteração Contratual — Quadro Societário

Ao marcar **Quadro Societário**, o usuário pode combinar saída de sócio, entrada de novos sócios e transferência de cotas. Pelo menos uma dessas ações precisa ser informada.

| Campo | Obrigatório | Como funciona |
|-------|-------------|---------------|
| Dados do Sócio a Ser Retirado | Condicional | Preencher quando houver saída. |
| Quantidade de Novos Sócios | Sim dentro da seção | Aceita de 0 a 5 e cria uma ficha para cada novo sócio. |
| Ficha do Novo Sócio | Condicional | Obrigatória para cada sócio indicado. Regime de casamento e indicação de administrador seguem opcionais, como na Constituição. |
| Detalhes da Transferência de Cotas/Participação | Condicional | Preencher quando houver transferência. |

A ficha de cada novo sócio contém: nome, CPF, RG, data de expedição, órgão expedidor, estado civil, regime de casamento, profissão, naturalidade, data de nascimento, filiação, endereço, CEP, e-mail, telefone, indicação de administrador e participação no capital social.

## 7. Regras de negócio

1. A quantidade de novos sócios deve ser um número inteiro entre 0 e 5.
2. A quantidade de fichas enviadas deve coincidir com a quantidade selecionada.
3. Cada ficha precisa conter os campos obrigatórios adotados no formulário de Constituição.
4. Ao reduzir a quantidade ou desmarcar Quadro Societário, fichas removidas não são enviadas.
5. O servidor repete as validações principais e não confia apenas na tela.
6. O campo antigo `novo_socio_nome` continua aceito temporariamente para requisições antigas.
7. Submissões já armazenadas não são modificadas.

## 8. Como usar o sistema

1. Acesse `/alteracao-contratual`.
2. Preencha a identificação da empresa.
3. Marque **Quadro Societário**.
4. Informe o sócio retirado, a transferência de cotas ou a quantidade de novos sócios, conforme o caso.
5. Para cada novo sócio, preencha a ficha exibida.
6. Clique em **Enviar Solicitação**.
7. No painel administrativo, abra a submissão para consultar ou copiar cada resposta.

## 9. Checklist de validação

- Envio apenas com saída de sócio.
- Envio apenas com transferência de cotas.
- Envio com 1 e com 5 novos sócios.
- Bloqueio da seção vazia e de fichas incompletas.
- Limpeza das fichas ao reduzir a quantidade ou desmarcar a seção.
- Exibição individual dos dados no painel administrativo.

## 10. Segurança

- A API valida a quantidade, a estrutura e os campos obrigatórios dos novos sócios.
- O painel EJS exibe respostas como texto escapado.
- Segredos de login e sessão devem permanecer nas variáveis de ambiente.

## 11. Deploy e ambiente

Consulte o README para instalação, variáveis de ambiente e execução com PM2. Nenhum segredo real deve ser registrado neste documento.

## 12. Ao atualizar este documento

Toda mudança perceptível em tela, campo, validação, rota ou fluxo deve atualizar a versão, o histórico, a ficha correspondente e o guia de uso na mesma entrega.
