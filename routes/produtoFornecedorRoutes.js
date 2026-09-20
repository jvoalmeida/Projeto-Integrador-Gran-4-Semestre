const express = require('express');

const router = express.Router();

const produtoFornecedorController = require('../controllers/produtoFornecedorController');


// Associar produto a fornecedor
router.post(
    '/',
    produtoFornecedorController.associarProdutoFornecedor
);


// Listar fornecedores de um produto
router.get(
    '/produto/:produto_id',
    produtoFornecedorController.listarFornecedoresDoProduto
);


// Listar produtos de um fornecedor
router.get(
    '/fornecedor/:fornecedor_id',
    produtoFornecedorController.listarProdutosDoFornecedor
);


// Remover associação
router.delete(
    '/produto/:produto_id/fornecedor/:fornecedor_id',
    produtoFornecedorController.removerProdutoFornecedor
);


module.exports = router;