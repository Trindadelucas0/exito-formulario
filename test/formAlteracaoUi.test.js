const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const ejs = require('ejs');

test('a tela renderizada contém o seletor de 0 a 5 e o container dinâmico', async () => {
  const caminho = path.join(__dirname, '..', 'views', 'alteracao-contratual.ejs');
  const html = await ejs.renderFile(caminho);

  assert.match(html, /id="quantidade_novos_socios"/);
  assert.match(html, /<option value="0">0<\/option>/);
  assert.match(html, /<option value="5">5<\/option>/);
  assert.match(html, /id="novos-socios-container"/);
  assert.doesNotMatch(html, /id="novo_socio_nome"/);
});

test('a ficha dinâmica replica os campos completos do formulário de Constituição', () => {
  const elementoFormulario = { addEventListener() {} };
  global.document = {
    addEventListener() {},
    querySelectorAll() { return []; },
    getElementById() { return elementoFormulario; }
  };

  const caminhoScript = require.resolve('../public/js/form-alteracao.js');
  delete require.cache[caminhoScript];
  const { criarFormularioNovoSocio, atualizarFormulariosNovosSocios } = require(caminhoScript);
  delete global.document;

  const html = criarFormularioNovoSocio(5);
  const camposEsperados = [
    'novo_socio_nome_5',
    'novo_socio_cpf_5',
    'novo_socio_rg_5',
    'novo_socio_data_expedicao_5',
    'novo_socio_orgao_expedidor_5',
    'novo_socio_estado_civil_5',
    'novo_socio_regime_casamento_5',
    'novo_socio_profissao_5',
    'novo_socio_naturalidade_5',
    'novo_socio_data_nascimento_5',
    'novo_socio_filiacao_5',
    'novo_socio_endereco_5',
    'novo_socio_cep_5',
    'novo_socio_email_5',
    'novo_socio_telefone_5',
    'novo_socio_administrador_5',
    'novo_socio_participacao_5'
  ];

  assert.match(html, /Dados do Novo Sócio 5/);
  camposEsperados.forEach(campo => assert.ok(html.includes(campo), `Campo ausente: ${campo}`));

  const itens = [];
  const container = {
    querySelectorAll() { return itens; },
    insertAdjacentHTML(_posicao, conteudo) {
      const numero = Number(conteudo.match(/id="novo-socio-(\d+)"/)[1]);
      itens.push({ numero });
    },
    querySelector(seletor) {
      const numero = Number(seletor.match(/(\d+)$/)[1]);
      const item = itens.find(candidato => candidato.numero === numero);
      if (!item) return null;
      return { remove: () => itens.splice(itens.indexOf(item), 1) };
    }
  };
  const seletorQuantidade = { value: '5' };
  global.document = {
    getElementById(id) {
      return id === 'quantidade_novos_socios' ? seletorQuantidade : container;
    }
  };

  atualizarFormulariosNovosSocios();
  assert.deepEqual(itens.map(item => item.numero), [1, 2, 3, 4, 5]);
  const primeiroItem = itens[0];

  seletorQuantidade.value = '2';
  atualizarFormulariosNovosSocios();
  assert.deepEqual(itens.map(item => item.numero), [1, 2]);
  assert.equal(itens[0], primeiroItem, 'A ficha 1 deve ser preservada ao reduzir a quantidade');
  delete global.document;
});
