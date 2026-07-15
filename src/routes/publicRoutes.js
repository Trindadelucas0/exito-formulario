const express = require('express');
const router = express.Router();

const constituicaoController = require('../controllers/constituicaoController');
const alteracaoController = require('../controllers/alteracaoController');

router.get('/', constituicaoController.showForm);
router.get('/constituicao', constituicaoController.showForm);
router.get('/alteracao-contratual', alteracaoController.showForm);

router.get('/ok', (req, res) => {
  const { tipo, empresa, telefone, data } = req.query;
  res.render('ok', {
    tipo: tipo === 'alteracao_contratual' ? 'alteracao_contratual' : 'abertura_empresa',
    empresa: empresa || 'Não informado',
    telefone: telefone || 'Não informado',
    data: data || 'Não informado'
  });
});

module.exports = router;
