import { useEffect, useState } from 'react';

const API = 'http://localhost:3001';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch(`${API}/produtos`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao buscar produtos.');
      }

      setProdutos(dados);
    } catch (e) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setCodigoBarras('');
    setProdutoEditando(null);
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (!nome.trim() || preco === '') {
      setErro('Nome e preço são obrigatórios.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: Number(preco),
      codigo_barras: codigoBarras.trim()
    };

    try {
      const url = produtoEditando
        ? `${API}/produtos/${produtoEditando.id}`
        : `${API}/produtos`;

      const resposta = await fetch(url, {
        method: produtoEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || resultado.mensagem || 'Erro ao salvar produto.');
      }

      setMensagem(
        produtoEditando
          ? 'Produto atualizado com sucesso.'
          : 'Produto cadastrado com sucesso.'
      );

      limparFormulario();
      await carregarProdutos();
    } catch (e) {
      setErro(e.message);
    }
  };

  const editarProduto = (produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome || '');
    setDescricao(produto.descricao || '');
    setPreco(produto.preco ?? '');
    setCodigoBarras(produto.codigo_barras || '');
    setMensagem('');
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirProduto = async (id) => {
    const confirmar = window.confirm(
      'Deseja realmente excluir este produto?'
    );

    if (!confirmar) return;

    setMensagem('');
    setErro('');

    try {
      const resposta = await fetch(`${API}/produtos/${id}`, {
        method: 'DELETE'
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || resultado.mensagem || 'Erro ao excluir produto.');
      }

      setMensagem('Produto excluído com sucesso.');
      await carregarProdutos();
    } catch (e) {
      setErro(e.message);
    }
  };

  return (
    <div>
      <h1 className="page-title">Produtos</h1>
      <p className="page-description">
        Cadastro e gerenciamento de produtos.
      </p>

      <section className="card">
        <h2>{produtoEditando ? 'Editar produto' : 'Cadastrar produto'}</h2>

        <form onSubmit={salvarProduto}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preco">Preço</label>
              <input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>

            <div className="form-group full">
              <label htmlFor="descricao">Descrição</label>
              <input
                id="descricao"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="form-group full">
              <label htmlFor="codigoBarras">Código de barras</label>
              <input
                id="codigoBarras"
                type="text"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">
              {produtoEditando ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>

            {produtoEditando && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={limparFormulario}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>

        {mensagem && <div className="message success">{mensagem}</div>}
        {erro && <div className="message error">{erro}</div>}
      </section>

      <section className="card">
        <h2>Produtos cadastrados</h2>

        {produtos.length === 0 ? (
          <p className="empty">Nenhum produto cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Código de barras</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.descricao || '-'}</td>
                    <td>R$ {Number(produto.preco).toFixed(2)}</td>
                    <td>{produto.codigo_barras || '-'}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn"
                          type="button"
                          onClick={() => editarProduto(produto)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => excluirProduto(produto.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Produtos;
