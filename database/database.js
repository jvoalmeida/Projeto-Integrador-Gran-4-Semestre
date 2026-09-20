const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
    } else {
        console.log('Conectado ao banco SQLite.');
    }
});

//ativa explicitamente as chaves estrangeiras do SQLite.Isso faz com que o SQLite realmente aplique as regras.
db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            codigo_barras TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT,
            endereco TEXT,
            contato TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS produto_fornecedor (
            produto_id INTEGER NOT NULL,
            fornecedor_id INTEGER NOT NULL,
            PRIMARY KEY (produto_id, fornecedor_id),
            FOREIGN KEY (produto_id) REFERENCES produtos(id),
            FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
        )
    `);

});

module.exports = db;