const db = require('../database/database');

// Listar todos os produtos
exports.listarProdutos = (req, res) => {
    db.all('SELECT * FROM produtos', [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        res.json(rows);
    });
};

// Buscar produto por ID
exports.buscarProduto = (req, res) => {
    const { id } = req.params;

    db.get(
        'SELECT * FROM produtos WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    mensagem: 'Produto não encontrado'
                });
            }

            res.json(row);
        }
    );
};

// Cadastrar novo produto
exports.criarProduto = (req, res) => {
    const { nome, descricao, preco, codigo_barras } = req.body;

    if (!nome || preco === undefined) {
        return res.status(400).json({
            erro: 'Nome e preço são obrigatórios'
        });
    }

    const sql = `
        INSERT INTO produtos (nome, descricao, preco, codigo_barras)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nome, descricao, preco, codigo_barras],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.status(201).json({
                mensagem: 'Produto cadastrado com sucesso',
                id: this.lastID
            });
        }
    );
};


// Atualizar produto
exports.atualizarProduto = (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, codigo_barras } = req.body;

    if (!nome || preco === undefined) {
        return res.status(400).json({
            erro: 'Nome e preço são obrigatórios'
        });
    }

    const sql = `
        UPDATE produtos
        SET nome = ?,
            descricao = ?,
            preco = ?,
            codigo_barras = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [nome, descricao, preco, codigo_barras, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: 'Produto não encontrado'
                });
            }

            res.json({
                mensagem: 'Produto atualizado com sucesso'
            });
        }
    );
};


// Excluir produto
exports.excluirProduto = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM produtos WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: 'Produto não encontrado'
                });
            }

            res.json({
                mensagem: 'Produto excluído com sucesso'
            });
        }
    );
};