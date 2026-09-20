const express = require('express');

const router = express.Router();

const produtoController = require('../controllers/produtoController');

//Produto
router.get('/', produtoController.listarProdutos);
router.get('/:id', produtoController.buscarProduto);
router.post('/', produtoController.criarProduto);
router.put('/:id', produtoController.atualizarProduto);
router.delete('/:id', produtoController.excluirProduto);

module.exports = router;