// server.js (Versão Corrigida)

console.log('Iniciando o servidor...');

const express = require('express');
const path = require('path');

const app = express();
const port = 8889;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

//routes
app.get('/', (req, res) => {
  res.render('login'); 
});

app.get("/donations", (req, res) => {
    res.render("donations")
})

app.get("/volunteer", (req,res) => {
    res.render("volunteer-register") 
})

app.get("/volunteer-dashboard", (req,res) => {
    res.render("volunteer-dashboard")
})

app.get("/acolito", (req,res) => {
    res.render("acolito-register")
})

app.get("/acolito-dashboard", (req,res) => {
    res.render("acolito-dashboard")
})

app.get("/account", (req, res) => {
    res.render("account")
})


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});