const db = require('../database/database');


// Associar um produto a um fornecedor
exports.associarProdutoFornecedor = (req, res) => {
    const { produto_id, fornecedor_id } = req.body;

    // Validação dos campos
    if (!produto_id || !fornecedor_id) {
        return res.status(400).json({
            erro: 'produto_id e fornecedor_id são obrigatórios'
        });
    }

    // Verificar se o produto existe
    db.get(
        'SELECT id FROM produtos WHERE id = ?',
        [produto_id],
        (err, produto) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!produto) {
                return res.status(404).json({
                    erro: 'Produto não encontrado'
                });
            }

            // Verificar se o fornecedor existe
            db.get(
                'SELECT id FROM fornecedores WHERE id = ?',
                [fornecedor_id],
                (err, fornecedor) => {

                    if (err) {
                        return res.status(500).json({
                            erro: err.message
                        });
                    }

                    if (!fornecedor) {
                        return res.status(404).json({
                            erro: 'Fornecedor não encontrado'
                        });
                    }

                    // Verificar se a associação já existe
                    db.get(
                        `
                        SELECT *
                        FROM produto_fornecedor
                        WHERE produto_id = ?
                        AND fornecedor_id = ?
                        `,
                        [produto_id, fornecedor_id],
                        (err, associacao) => {

                            if (err) {
                                return res.status(500).json({
                                    erro: err.message
                                });
                            }

                            if (associacao) {
                                return res.status(409).json({
                                    erro: 'Este produto já está associado a este fornecedor'
                                });
                            }

                            // Criar associação
                            db.run(
                                `
                                INSERT INTO produto_fornecedor (
                                    produto_id,
                                    fornecedor_id
                                )
                                VALUES (?, ?)
                                `,
                                [produto_id, fornecedor_id],
                                function (err) {

                                    if (err) {
                                        return res.status(500).json({
                                            erro: err.message
                                        });
                                    }

                                    res.status(201).json({
                                        mensagem: 'Produto associado ao fornecedor com sucesso'
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


// Listar fornecedores de um produto
exports.listarFornecedoresDoProduto = (req, res) => {

    const { produto_id } = req.params;

    // Verificar se o produto existe
    db.get(
        'SELECT id FROM produtos WHERE id = ?',
        [produto_id],
        (err, produto) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!produto) {
                return res.status(404).json({
                    erro: 'Produto não encontrado'
                });
            }

            const sql = `
                SELECT fornecedores.*
                FROM fornecedores
                INNER JOIN produto_fornecedor
                    ON fornecedores.id = produto_fornecedor.fornecedor_id
                WHERE produto_fornecedor.produto_id = ?
            `;

            db.all(
                sql,
                [produto_id],
                (err, rows) => {

                    if (err) {
                        return res.status(500).json({
                            erro: err.message
                        });
                    }

                    res.json(rows);
                }
            );
        }
    );
};


// Listar produtos de um fornecedor
exports.listarProdutosDoFornecedor = (req, res) => {

    const { fornecedor_id } = req.params;

    // Verificar se o fornecedor existe
    db.get(
        'SELECT id FROM fornecedores WHERE id = ?',
        [fornecedor_id],
        (err, fornecedor) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!fornecedor) {
                return res.status(404).json({
                    erro: 'Fornecedor não encontrado'
                });
            }

            const sql = `
                SELECT produtos.*
                FROM produtos
                INNER JOIN produto_fornecedor
                    ON produtos.id = produto_fornecedor.produto_id
                WHERE produto_fornecedor.fornecedor_id = ?
            `;

            db.all(
                sql,
                [fornecedor_id],
                (err, rows) => {

                    if (err) {
                        return res.status(500).json({
                            erro: err.message
                        });
                    }

                    res.json(rows);
                }
            );
        }
    );
};


// Remover associação entre produto e fornecedor
exports.removerProdutoFornecedor = (req, res) => {

    const { produto_id, fornecedor_id } = req.params;

    const sql = `
        DELETE FROM produto_fornecedor
        WHERE produto_id = ?
        AND fornecedor_id = ?
    `;

    db.run(
        sql,
        [produto_id, fornecedor_id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: 'Associação não encontrada'
                });
            }

            res.json({
                mensagem: 'Associação removida com sucesso'
            });
        }
    );
};