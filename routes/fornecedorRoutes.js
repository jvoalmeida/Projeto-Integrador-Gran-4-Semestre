const express = require('express');

const router = express.Router();

const fornecedorController = require('../controllers/fornecedorController');

// Fornecedores

router.get('/', fornecedorController.listarFornecedores);

router.get('/:id', fornecedorController.buscarFornecedor);

router.post('/', fornecedorController.criarFornecedor);

router.put('/:id', fornecedorController.atualizarFornecedor);

router.delete('/:id', fornecedorController.excluirFornecedor);

module.exports = router;