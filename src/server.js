console.log('Iniciando o servidor...');
require('dotenv').config()
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8889;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

//routes
app.get('/', (req, res) => {
  res.render('volunteer-register'); 
});

app.get("/volunteer-dashboard", (req,res) => {
    res.render("volunteer-dashboard")
})

app.get("/login", (req,res) => {
    res.render("login")
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});