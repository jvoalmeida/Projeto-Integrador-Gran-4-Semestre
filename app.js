const http = require('http');

const server = http.createServer((req, res) => {

// Inseri a codificação UTF-8 para evitar problemas de codificação de caracteres.
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    res.end('Olá, Mundo!');

});


const PORT = 3000;

server.listen(PORT, () => {

    console.log(`Servidor rodando em http://localhost:${PORT}/`);

});