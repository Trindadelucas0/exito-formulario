const { montarTextoFormatado } = require('./textFormatter');

const SOCIEDADE_LABELS = {
  ltda: 'LTDA (Sociedade Limitada)',
  sa: 'S.A. (Sociedade Anônima)',
  me: 'ME (Microempresa)',
  epp: 'EPP (Empresa de Pequeno Porte)',
  mei: 'MEI (Microempreendedor Individual)',
  simples: 'Sociedade Simples'
};

const REGIME_LABELS = {
  lucro_presumido: 'Lucro Presumido',
  simples_nacional: 'Simples Nacional',
  lucro_real: 'Lucro Real'
};

function formatarConstituicao(body = {}, dataEnvio) {
  const {
    razao_social,
    nome_fantasia,
    endereco,
    bairro,
    iptu,
    cep,
    metragem,
    dias_semana = [],
    horarios = {},
    telefone_empresa,
    email_empresa,
    capital_social,
    objeto_social,
    cnae_primario,
    cnae_secundario,
    sociedade,
    nome_socio_receita,
    quantidade_socios,
    regime,
    socios = []
  } = body;

  const questionsAndAnswers = [];
  let questionNum = 1;
  const add = (question, answer) => {
    if (answer) questionsAndAnswers.push({ number: questionNum++, question, answer });
  };

  add('Razão Social', razao_social);
  add('Nome Fantasia', nome_fantasia);
  add('Endereço', endereco);
  add('Bairro', bairro);
  add('IPTU Nº', iptu);
  add('CEP', cep);
  add('Metragem', metragem);

  if (Array.isArray(dias_semana) && dias_semana.length > 0) {
    const horariosFormatados = dias_semana.map((dia) => {
      const horario = horarios[dia];
      if (horario && (horario.inicio || horario.fim)) {
        return `${dia}: ${horario.inicio || ''} às ${horario.fim || ''}`.trim();
      }
      return dia;
    });
    add('Horário de Funcionamento', horariosFormatados.join('\n'));
  }

  add('Telefone', telefone_empresa);
  add('E-mail', email_empresa);
  add('Capital Social', capital_social);
  add('Objeto Social (Atividades Econômicas Exercidas)', objeto_social);
  add('CNAE Primário', cnae_primario);
  add('CNAE Secundário', cnae_secundario);

  if (sociedade) add('Sociedade', SOCIEDADE_LABELS[sociedade] || sociedade);

  add('Nome do sócio perante a Receita', nome_socio_receita);
  add('Quantidade de Sócios', quantidade_socios);

  if (regime) add('Regime de Tributação', REGIME_LABELS[regime] || regime);

  (Array.isArray(socios) ? socios : []).forEach((socio) => {
    if (!socio || !socio.nome) return;
    add(`Sócio ${socio.numero} - Nome`, socio.nome);
    add(`Sócio ${socio.numero} - CPF`, socio.cpf);
    add(`Sócio ${socio.numero} - RG`, socio.rg);
    add(`Sócio ${socio.numero} - Data de Expedição`, socio.data_expedicao);
    add(`Sócio ${socio.numero} - Órgão Expedidor`, socio.orgao_expedidor);
    add(`Sócio ${socio.numero} - Estado Civil`, socio.estado_civil);
    add(`Sócio ${socio.numero} - Regime de Casamento`, socio.regime_casamento);
    add(`Sócio ${socio.numero} - Profissão`, socio.profissao);
    add(`Sócio ${socio.numero} - Naturalidade`, socio.naturalidade);
    add(`Sócio ${socio.numero} - Data de Nascimento`, socio.data_nascimento);
    add(`Sócio ${socio.numero} - Filiação`, socio.filiacao);
    add(`Sócio ${socio.numero} - Endereço`, socio.endereco_socio);
    add(`Sócio ${socio.numero} - CEP`, socio.cep_socio);
    add(`Sócio ${socio.numero} - E-mail`, socio.email_socio);
    add(`Sócio ${socio.numero} - Telefone`, socio.telefone_socio);
    if (socio.administrador) {
      add(`Sócio ${socio.numero} - Sócio Administrador`, socio.administrador === 'sim' ? 'Sim' : 'Não');
    }
    add(`Sócio ${socio.numero} - Valor da Participação no Capital Social (%)`, socio.participacao);
  });

  const formattedText = montarTextoFormatado('FICHA DE CONSTITUICAO DE EMPRESA', questionsAndAnswers, dataEnvio);

  const resumo = {
    nomeEmpresa: (razao_social || nome_fantasia || 'Não informado').toString().trim() || 'Não informado',
    telefone: (telefone_empresa || 'Não informado').toString().trim() || 'Não informado',
    email: (email_empresa || 'Não informado').toString().trim() || 'Não informado'
  };

  return { questionsAndAnswers, formattedText, resumo };
}

module.exports = { formatarConstituicao };
