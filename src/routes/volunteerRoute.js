
const express = require('express');
const router = express.Router(); // Usamos o Router do Express
const db = require('../config/firebaseConfig');

router.post('/enviar-voluntario', async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;
    const novoVoluntario = {
      nome,
      email,
      mensagem,
      dataCriacao: new Date()
    };

    await db.collection('voluntarios').add(novoVoluntario);
    console.log('Voluntário salvo com sucesso!');
    res.redirect('/home');

  } catch (error) {
    console.error('Erro ao salvar voluntário:', error);
    res.status(500).send('Ocorreu um erro ao registrar sua solicitação.');
  }
});

module.exports = router;