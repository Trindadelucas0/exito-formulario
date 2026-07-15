const fs = require('fs');
const path = require('path');

function ensureFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ submissions: [] }, null, 2));
  }
}

function readSubmissions(filePath) {
  ensureFile(filePath);
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data.submissions) ? data.submissions : [];
  } catch (error) {
    console.error(`Erro ao ler ${filePath}:`, error);
    return [];
  }
}

// Escrita atômica (grava em arquivo temporário e renomeia) para evitar
// corromper o JSON caso dois envios cheguem ao mesmo tempo.
function appendSubmission(filePath, submission) {
  const submissions = readSubmissions(filePath);
  submissions.unshift(submission);

  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify({ submissions }, null, 2));
  fs.renameSync(tmpPath, filePath);

  return submission;
}

module.exports = { readSubmissions, appendSubmission };
