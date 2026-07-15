const { v4: uuidv4 } = require('uuid');
const path = require('path');
const jsonStore = require('../services/jsonStore');
const { formatarAlteracao } = require('../services/alteracaoFormatter');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'alteracao-contratual.json');

function showForm(req, res) {
  res.render('alteracao-contratual');
}

function submitForm(req, res) {
  const tiposAlteracao = Array.isArray(req.body?.tipos_alteracao) ? req.body.tipos_alteracao : [];
  if (tiposAlteracao.length === 0) {
    return res.status(400).json({ ok: false, message: 'Selecione ao menos um tipo de alteração contratual.' });
  }

  try {
    const dataEnvio = new Date().toLocaleString('pt-BR');
    const { questionsAndAnswers, formattedText, resumo } = formatarAlteracao(req.body, dataEnvio);

    const submission = {
      id: uuidv4(),
      tipo: 'alteracao_contratual',
      dataEnvio,
      resumo,
      totalPerguntas: questionsAndAnswers.length,
      questionsAndAnswers,
      formattedText
    };

    jsonStore.appendSubmission(DATA_FILE, submission);

    const redirect = `/ok?tipo=alteracao_contratual&empresa=${encodeURIComponent(resumo.nomeEmpresa)}&telefone=${encodeURIComponent(resumo.telefone)}&data=${encodeURIComponent(dataEnvio)}`;
    res.json({ ok: true, redirect });
  } catch (error) {
    console.error('Erro ao salvar ficha de alteração contratual:', error);
    res.status(500).json({ ok: false, message: 'Erro ao salvar os dados. Tente novamente.' });
  }
}

module.exports = { showForm, submitForm };
