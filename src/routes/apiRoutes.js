const express = require('express');
const router = express.Router();

const constituicaoController = require('../controllers/constituicaoController');
const alteracaoController = require('../controllers/alteracaoController');

router.post('/constituicao', constituicaoController.submitForm);
router.post('/alteracao-contratual', alteracaoController.submitForm);

module.exports = router;
