const path = require('path');
const jsonStore = require('../services/jsonStore');

const CONSTITUICAO_FILE = path.join(__dirname, '..', '..', 'data', 'constituicao.json');
const ALTERACAO_FILE = path.join(__dirname, '..', '..', 'data', 'alteracao-contratual.json');

function showLogin(req, res) {
  res.render('admin/login', { error: null });
}

function login(req, res) {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }

  res.render('admin/login', { error: 'Usuário ou senha inválidos.' });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
}

function showDashboard(req, res) {
  const constituicao = jsonStore.readSubmissions(CONSTITUICAO_FILE);
  const alteracao = jsonStore.readSubmissions(ALTERACAO_FILE);
  res.render('admin/dashboard', { constituicao, alteracao });
}

module.exports = { showLogin, login, logout, showDashboard };
