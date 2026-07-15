const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const requireAuth = require('../middleware/requireAuth');

router.get('/login', adminController.showLogin);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/', requireAuth, adminController.showDashboard);

module.exports = router;
