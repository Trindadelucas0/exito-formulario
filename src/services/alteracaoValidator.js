const CAMPOS_OBRIGATORIOS_NOVO_SOCIO = [
  ['nome', 'Nome'],
  ['cpf', 'CPF'],
  ['rg', 'RG'],
  ['data_expedicao', 'Data de Expedição'],
  ['orgao_expedidor', 'Órgão Expedidor'],
  ['estado_civil', 'Estado Civil'],
  ['profissao', 'Profissão'],
  ['naturalidade', 'Naturalidade'],
  ['data_nascimento', 'Data de Nascimento'],
  ['filiacao', 'Filiação'],
  ['endereco_socio', 'Endereço'],
  ['cep_socio', 'CEP'],
  ['email_socio', 'E-mail'],
  ['telefone_socio', 'Telefone'],
  ['participacao', 'Participação no Capital Social']
];

function textoPreenchido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function validarAlteracao(body = {}) {
  const tiposAlteracao = Array.isArray(body.tipos_alteracao) ? body.tipos_alteracao : [];
  if (tiposAlteracao.length === 0) {
    return 'Selecione ao menos um tipo de alteração contratual.';
  }

  if (!tiposAlteracao.includes('quadro_societario')) return null;

  const possuiCampoLegado = textoPreenchido(body.novo_socio_nome);
  const quantidadeInformada = body.quantidade_novos_socios;
  const quantidadeNovosSocios = quantidadeInformada === undefined || quantidadeInformada === ''
    ? 0
    : Number(quantidadeInformada);

  if (!Number.isInteger(quantidadeNovosSocios) || quantidadeNovosSocios < 0 || quantidadeNovosSocios > 5) {
    return 'A quantidade de novos sócios deve ser um número inteiro entre 0 e 5.';
  }

  const possuiSaida = textoPreenchido(body.socio_a_retirar);
  const possuiTransferencia = textoPreenchido(body.transferencia_cotas);
  if (!possuiSaida && !possuiTransferencia && quantidadeNovosSocios === 0 && !possuiCampoLegado) {
    return 'Informe ao menos uma saída, entrada de novo sócio ou transferência de cotas.';
  }

  if (quantidadeNovosSocios === 0) return null;

  if (!Array.isArray(body.novos_socios) || body.novos_socios.length !== quantidadeNovosSocios) {
    return 'A quantidade de fichas de novos sócios não corresponde à quantidade informada.';
  }

  for (let indice = 0; indice < body.novos_socios.length; indice += 1) {
    const socio = body.novos_socios[indice];
    if (!socio || typeof socio !== 'object' || Array.isArray(socio)) {
      return `Os dados do novo sócio ${indice + 1} são inválidos.`;
    }

    for (const [campo, rotulo] of CAMPOS_OBRIGATORIOS_NOVO_SOCIO) {
      if (!textoPreenchido(socio[campo])) {
        return `Preencha ${rotulo} do novo sócio ${indice + 1}.`;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(socio.email_socio.trim())) {
      return `Informe um e-mail válido para o novo sócio ${indice + 1}.`;
    }
  }

  return null;
}

module.exports = { validarAlteracao };
