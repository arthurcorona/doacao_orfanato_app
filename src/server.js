console.log('Iniciando o servidor...');

const express = require('express');
const path = require('path');
const volunteerRoutes = require('./routes/volunteerRoute'); 

const app = express();
const port = 8888;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

//routes
app.get('/', (req, res) => {
  res.render('home'); 
});

app.get("/donations", (req, res) => {
    res.render("donations")
})

app.get("/login", (req,res) => {
    res.render("login")
})

app.get("/account", (req, res) => {
    res.render("account")
})

app.use('/', volunteerRoutes); 


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});