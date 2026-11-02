const { montarTextoFormatado } = require('./textFormatter');

const TIPOS_LABELS = {
  dados_cadastrais: 'Dados Cadastrais',
  quadro_societario: 'Quadro Societário',
  retirada_atividades: 'Retirada de Atividades da Empresa',
  novas_atividades: 'Inclusão de Novas Atividades',
  abertura_filial: 'Abertura de Filial',
  baixa_empresa: 'Baixa de Empresa',
  outras_alteracoes: 'Outras Alterações'
};

const TIPO_SOCIEDADE_LABELS = {
  ltda: 'LTDA (Sociedade Limitada)',
  sa: 'S.A. (Sociedade Anônima)',
  me: 'ME (Microempresa)',
  epp: 'EPP (Empresa de Pequeno Porte)',
  mei: 'MEI (Microempreendedor Individual)',
  simples: 'Sociedade Simples'
};

function formatarAlteracao(body = {}, dataEnvio) {
  const {
    razao_social_atual,
    cnpj_empresa,
    telefone_contato,
    email_contato,
    tipos_alteracao = [],
    novo_nome_fantasia,
    nova_razao_social,
    novo_endereco,
    novo_tipo_sociedade,
    socio_a_retirar,
    novo_socio_nome,
    quantidade_novos_socios,
    novos_socios = [],
    transferencia_cotas,
    cnaes_retirar,
    cnaes_incluir,
    dados_filial,
    obs_baixa,
    descricao_alteracao
  } = body;

  const questionsAndAnswers = [];
  let questionNum = 1;
  const add = (question, answer) => {
    if (answer) questionsAndAnswers.push({ number: questionNum++, question, answer });
  };

  add('Razão Social da Empresa', razao_social_atual);
  add('CNPJ da Empresa', cnpj_empresa);
  add('Telefone para Contato', telefone_contato);
  add('E-mail para Contato', email_contato);

  if (Array.isArray(tipos_alteracao) && tipos_alteracao.length > 0) {
    add(
      'Tipo(s) de Alteração Solicitada(s)',
      tipos_alteracao.map((tipo) => TIPOS_LABELS[tipo] || tipo).join(', ')
    );
  }

  add('Novo Nome Fantasia', novo_nome_fantasia);
  add('Nova Razão Social', nova_razao_social);
  add('Novo Endereço', novo_endereco);
  if (novo_tipo_sociedade) {
    add('Novo Tipo de Sociedade', TIPO_SOCIEDADE_LABELS[novo_tipo_sociedade] || novo_tipo_sociedade);
  }

  if (Array.isArray(tipos_alteracao) && tipos_alteracao.includes('quadro_societario')) {
    add('Dados do Sócio a Ser Retirado', socio_a_retirar);
    if (quantidade_novos_socios !== undefined && quantidade_novos_socios !== null) {
      add('Quantidade de Novos Sócios', String(quantidade_novos_socios));
    }

    const novosSociosValidos = Array.isArray(novos_socios) ? novos_socios : [];
    novosSociosValidos.forEach((socio, indice) => {
      if (!socio || !socio.nome) return;
      const numero = socio.numero || indice + 1;
      add(`Novo Sócio ${numero} - Nome`, socio.nome);
      add(`Novo Sócio ${numero} - CPF`, socio.cpf);
      add(`Novo Sócio ${numero} - RG`, socio.rg);
      add(`Novo Sócio ${numero} - Data de Expedição`, socio.data_expedicao);
      add(`Novo Sócio ${numero} - Órgão Expedidor`, socio.orgao_expedidor);
      add(`Novo Sócio ${numero} - Estado Civil`, socio.estado_civil);
      add(`Novo Sócio ${numero} - Regime de Casamento`, socio.regime_casamento);
      add(`Novo Sócio ${numero} - Profissão`, socio.profissao);
      add(`Novo Sócio ${numero} - Naturalidade`, socio.naturalidade);
      add(`Novo Sócio ${numero} - Data de Nascimento`, socio.data_nascimento);
      add(`Novo Sócio ${numero} - Filiação`, socio.filiacao);
      add(`Novo Sócio ${numero} - Endereço`, socio.endereco_socio);
      add(`Novo Sócio ${numero} - CEP`, socio.cep_socio);
      add(`Novo Sócio ${numero} - E-mail`, socio.email_socio);
      add(`Novo Sócio ${numero} - Telefone`, socio.telefone_socio);
      if (socio.administrador) {
        add(`Novo Sócio ${numero} - Sócio Administrador`, socio.administrador === 'sim' ? 'Sim' : 'Não');
      }
      add(`Novo Sócio ${numero} - Valor da Participação no Capital Social (%)`, socio.participacao);
    });

    if (novosSociosValidos.length === 0) {
      add('Nome Completo do Novo Sócio', novo_socio_nome);
    }
    add('Detalhes da Transferência de Cotas/Participação', transferencia_cotas);
  }

  add('CNAEs a Retirar', cnaes_retirar);
  add('Novos CNAEs a Incluir', cnaes_incluir);

  add('Dados da Filial a Ser Aberta', dados_filial);

  add('Observações sobre a Baixa', obs_baixa);

  add('Descrição da Alteração Desejada', descricao_alteracao);

  const formattedText = montarTextoFormatado('FICHA DE ALTERACAO CONTRATUAL', questionsAndAnswers, dataEnvio);

  const resumo = {
    nomeEmpresa: (razao_social_atual || 'Não informado').toString().trim() || 'Não informado',
    telefone: (telefone_contato || 'Não informado').toString().trim() || 'Não informado',
    email: (email_contato || 'Não informado').toString().trim() || 'Não informado'
  };

  return { questionsAndAnswers, formattedText, resumo };
}

module.exports = { formatarAlteracao };
