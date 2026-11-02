const test = require('node:test');
const assert = require('node:assert/strict');

const { validarAlteracao } = require('../src/services/alteracaoValidator');

function criarNovoSocio(sobrescritas = {}) {
  return {
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
    participacao: '50%',
    ...sobrescritas
  };
}

test('aceita alteração societária somente com saída de sócio', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    socio_a_retirar: 'João - CPF 111.111.111-11',
    quantidade_novos_socios: 0,
    novos_socios: []
  });

  assert.equal(erro, null);
});

test('aceita alteração societária somente com transferência de cotas', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    transferencia_cotas: 'Transferir 20% de João para Maria',
    quantidade_novos_socios: 0,
    novos_socios: []
  });

  assert.equal(erro, null);
});

test('rejeita quadro societário sem saída, entrada ou transferência', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 0,
    novos_socios: []
  });

  assert.match(erro, /ao menos uma saída/);
});

test('aceita ficha completa de novo sócio', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 1,
    novos_socios: [criarNovoSocio()]
  });

  assert.equal(erro, null);
});

test('aceita cinco fichas completas de novos sócios', () => {
  const novosSocios = Array.from({ length: 5 }, (_, indice) => (
    criarNovoSocio({
      numero: indice + 1,
      nome: `Sócio ${indice + 1}`,
      email_socio: `socio${indice + 1}@example.com`
    })
  ));
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 5,
    novos_socios: novosSocios
  });

  assert.equal(erro, null);
});

test('rejeita divergência entre quantidade e fichas enviadas', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 2,
    novos_socios: [criarNovoSocio()]
  });

  assert.match(erro, /não corresponde/);
});

test('rejeita ficha incompleta de novo sócio', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 1,
    novos_socios: [criarNovoSocio({ cpf: '' })]
  });

  assert.equal(erro, 'Preencha CPF do novo sócio 1.');
});

test('rejeita quantidade fora da faixa permitida', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    quantidade_novos_socios: 6,
    novos_socios: []
  });

  assert.match(erro, /entre 0 e 5/);
});

test('mantém compatibilidade com o campo antigo de novo sócio', () => {
  const erro = validarAlteracao({
    tipos_alteracao: ['quadro_societario'],
    novo_socio_nome: 'Maria da Silva'
  });

  assert.equal(erro, null);
});

module.exports = { criarNovoSocio };
