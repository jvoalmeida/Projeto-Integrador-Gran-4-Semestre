const db = require('../database/database');

// Listar todos os fornecedores
exports.listarFornecedores = (req, res) => {
    db.all('SELECT * FROM fornecedores', [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        res.json(rows);
    });
};


// Buscar fornecedor por ID
exports.buscarFornecedor = (req, res) => {
    const { id } = req.params;

    db.get(
        'SELECT * FROM fornecedores WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    mensagem: 'Fornecedor não encontrado'
                });
            }

            res.json(row);
        }
    );
};


// Cadastrar novo fornecedor
exports.criarFornecedor = (req, res) => {
    const { nome, cnpj, endereco, contato } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome do fornecedor é obrigatório'
        });
    }

    const sql = `
        INSERT INTO fornecedores (
            nome,
            cnpj,
            endereco,
            contato
        )
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nome, cnpj, endereco, contato],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.status(201).json({
                mensagem: 'Fornecedor cadastrado com sucesso',
                id: this.lastID
            });
        }
    );
};


// Atualizar fornecedor
exports.atualizarFornecedor = (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, endereco, contato } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome do fornecedor é obrigatório'
        });
    }

    const sql = `
        UPDATE fornecedores
        SET nome = ?,
            cnpj = ?,
            endereco = ?,
            contato = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [nome, cnpj, endereco, contato, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: 'Fornecedor não encontrado'
                });
            }

            res.json({
                mensagem: 'Fornecedor atualizado com sucesso'
            });
        }
    );
};


// Excluir fornecedor
exports.excluirFornecedor = (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM fornecedores WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: 'Fornecedor não encontrado'
                });
            }

            res.json({
                mensagem: 'Fornecedor excluído com sucesso'
            });
        }
    );
};