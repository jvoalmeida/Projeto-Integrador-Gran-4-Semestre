const express = require('express');
const cors = require('cors');

const app = express();

//Aceite requisições que venham do nosso frontend React.
app.use(cors());

// Permite receber dados em JSON
app.use(express.json());

// Importa as rotas 
const produtoRoutes = require('./routes/produtoRoutes');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const produtoFornecedorRoutes = require('./routes/produtoFornecedorRoutes');


// Define as rotas principais
app.use('/produtos', produtoRoutes);
app.use('/fornecedores', fornecedorRoutes);
app.use('/produto-fornecedor', produtoFornecedorRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});