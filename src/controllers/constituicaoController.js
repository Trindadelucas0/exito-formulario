const { v4: uuidv4 } = require('uuid');
const path = require('path');
const jsonStore = require('../services/jsonStore');
const { formatarConstituicao } = require('../services/constituicaoFormatter');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'constituicao.json');

function showForm(req, res) {
  res.render('constituicao');
}

function submitForm(req, res) {
  const { razao_social, nome_fantasia } = req.body || {};
  if (!razao_social && !nome_fantasia) {
    return res.status(400).json({ ok: false, message: 'Informe ao menos a razão social ou o nome fantasia.' });
  }

  try {
    const dataEnvio = new Date().toLocaleString('pt-BR');
    const { questionsAndAnswers, formattedText, resumo } = formatarConstituicao(req.body, dataEnvio);

    const submission = {
      id: uuidv4(),
      tipo: 'constituicao',
      dataEnvio,
      resumo,
      totalPerguntas: questionsAndAnswers.length,
      questionsAndAnswers,
      formattedText
    };

    jsonStore.appendSubmission(DATA_FILE, submission);

    const redirect = `/ok?tipo=constituicao&empresa=${encodeURIComponent(resumo.nomeEmpresa)}&telefone=${encodeURIComponent(resumo.telefone)}&data=${encodeURIComponent(dataEnvio)}`;
    res.json({ ok: true, redirect });
  } catch (error) {
    console.error('Erro ao salvar ficha de constituição:', error);
    res.status(500).json({ ok: false, message: 'Erro ao salvar os dados. Tente novamente.' });
  }
}

module.exports = { showForm, submitForm };
