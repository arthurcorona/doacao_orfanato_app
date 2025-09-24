// test-server.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 8888; // <-- MUDE AQUI

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Servidor Node.js puro está funcionando.\n');
});

server.listen(port, hostname, () => {
  // Mensagem de log atualizada
  console.log(`Servidor puro rodando em http://${hostname}:${port}/`); 
  console.log('Este processo deve permanecer ativo.');
});

console.log('Tentando iniciar o servidor...');