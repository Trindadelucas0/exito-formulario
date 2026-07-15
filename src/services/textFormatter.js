// Gera o mesmo texto numerado ("001. Pergunta == Resposta") que antes era
// enviado ao SheetMonkey, para o botão Copiar do admin colar no formato de sempre.
function montarTextoFormatado(titulo, questionsAndAnswers, dataEnvio) {
  let texto = `${titulo}\n`;
  texto += `DATA DE ENVIO == ${dataEnvio}\n`;
  texto += `TOTAL DE PERGUNTAS == ${questionsAndAnswers.length}\n`;
  texto += '----------------------------------------\n';

  questionsAndAnswers.forEach((item) => {
    const num = item.number.toString().padStart(3, '0');
    const answerText = (item.answer || '')
      .toString()
      .replace(/\r?\n/g, ' | ')
      .replace(/\s+/g, ' ')
      .trim();
    texto += `${num}. ${item.question} == ${answerText}\n`;
  });

  texto += '----------------------------------------\n';
  return texto;
}

module.exports = { montarTextoFormatado };
