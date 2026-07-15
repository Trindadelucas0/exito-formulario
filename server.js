require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const publicRoutes = require('./src/routes/publicRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'exito-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
  })
);

app.use('/', publicRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
