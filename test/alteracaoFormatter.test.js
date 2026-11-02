const test = require('node:test');
const assert = require('node:assert/strict');

const { formatarAlteracao } = require('../src/services/alteracaoFormatter');

const novoSocio = {
  numero: 1,
  nome: 'Maria da Silva',
  cpf: '000.000.000-00',
  rg: '1234567',
  data_expedicao: '2020-01-15',
  orgao_expedidor: 'SSP',
  estado_civil: 'Solteiro(a)',
  regime_casamento: '',
  profissao: 'Contadora',
  naturalidade: 'Brasília - DF',
  data_nascimento: '1990-05-20',
  filiacao: 'Nome da mãe e do pai',
  endereco_socio: 'Rua 1, 100',
  cep_socio: '70000-000',
  email_socio: 'maria@example.com',
  telefone_socio: '(61) 99999-9999',
  administrador: 'sim',
  participacao: '50%'
};

test('formata cada dado da ficha completa do novo sócio', () => {
  const resultado = formatarAlteracao({
    razao_social_atual: 'Empresa Teste LTDA',
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 1,
    novos_socios: [novoSocio]
  }, '02/11/2026 10:00:00');

  const respostas = Object.fromEntries(
    resultado.questionsAndAnswers.map(item => [item.question, item.answer])
  );

  assert.equal(respostas['Quantidade de Novos Sócios'], '1');
  assert.equal(respostas['Novo Sócio 1 - Nome'], 'Maria da Silva');
  assert.equal(respostas['Novo Sócio 1 - CPF'], '000.000.000-00');
  assert.equal(respostas['Novo Sócio 1 - Sócio Administrador'], 'Sim');
  assert.equal(respostas['Novo Sócio 1 - Valor da Participação no Capital Social (%)'], '50%');
  assert.match(resultado.formattedText, /Novo Sócio 1 - E-mail/);
});

test('continua formatando o campo legado de nome do novo sócio', () => {
  const resultado = formatarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    novo_socio_nome: 'Cadastro antigo'
  }, '02/11/2026 10:00:00');

  assert.ok(resultado.questionsAndAnswers.some(item => (
    item.question === 'Nome Completo do Novo Sócio' && item.answer === 'Cadastro antigo'
  )));
});

test('não inclui quantidade de sócios quando o quadro societário não foi selecionado', () => {
  const resultado = formatarAlteracao({
    tipos_alteracao: ['dados_cadastrais'],
    quantidade_novos_socios: 0,
    novos_socios: []
  }, '02/11/2026 10:00:00');

  assert.ok(!resultado.questionsAndAnswers.some(item => item.question === 'Quantidade de Novos Sócios'));
});
