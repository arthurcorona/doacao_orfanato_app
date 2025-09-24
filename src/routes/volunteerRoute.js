// src/routes/volunteerRoute.js (VERSÃO DE TESTE)

const express = require('express');
const router = express.Router();

// Temporariamente, vamos remover a conexão com o Firebase (db)
// const db = require('../config/firebaseConfig');

// Rota POST simplificada que não usa o banco de dados
router.post('/enviar-voluntario', async (req, res) => {
  console.log('Formulário de voluntário recebido:', req.body);
  // Apenas redireciona sem tentar salvar
  res.send('Teste OK! Formulário recebido.');
});

module.exports = router;