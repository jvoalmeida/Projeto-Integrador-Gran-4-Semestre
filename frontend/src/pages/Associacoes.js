import { useEffect, useState } from 'react';

const API = 'http://localhost:3001';

function Associacoes() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [fornecedoresDoProduto, setFornecedoresDoProduto] = useState([]);
  const [produtosDoFornecedor, setProdutosDoFornecedor] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const carregarDados = async () => {
    try {
      const [resProdutos, resFornecedores] = await Promise.all([
        fetch(`${API}/produtos`),
        fetch(`${API}/fornecedores`)
      ]);

      const dadosProdutos = await resProdutos.json();
      const dadosFornecedores = await resFornecedores.json();

      if (!resProdutos.ok) {
        throw new Error(dadosProdutos.erro || 'Erro ao buscar produtos.');
      }

      if (!resFornecedores.ok) {
        throw new Error(
          dadosFornecedores.erro || 'Erro ao buscar fornecedores.'
        );
      }

      setProdutos(dadosProdutos);
      setFornecedores(dadosFornecedores);
    } catch (e) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const associar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (!produtoId || !fornecedorId) {
      setErro('Selecione um produto e um fornecedor.');
      return;
    }

    try {
      const resposta = await fetch(`${API}/produto-fornecedor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          produto_id: Number(produtoId),
          fornecedor_id: Number(fornecedorId)
        })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro || resultado.mensagem || 'Erro ao criar associação.'
        );
      }

      setMensagem('Produto associado ao fornecedor com sucesso.');
      await consultarFornecedoresDoProduto(produtoId);
      await consultarProdutosDoFornecedor(fornecedorId);
    } catch (e) {
      setErro(e.message);
    }
  };

  const consultarFornecedoresDoProduto = async (id = produtoId) => {
    setMensagem('');
    setErro('');

    if (!id) {
      setErro('Selecione um produto para consultar.');
      return;
    }

    try {
      const resposta = await fetch(
        `${API}/produto-fornecedor/produto/${id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao consultar associações.');
      }

      setFornecedoresDoProduto(dados);
    } catch (e) {
      setErro(e.message);
    }
  };

  const consultarProdutosDoFornecedor = async (id = fornecedorId) => {
    setMensagem('');
    setErro('');

    if (!id) {
      setErro('Selecione um fornecedor para consultar.');
      return;
    }

    try {
      const resposta = await fetch(
        `${API}/produto-fornecedor/fornecedor/${id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao consultar associações.');
      }

      setProdutosDoFornecedor(dados);
    } catch (e) {
      setErro(e.message);
    }
  };

  const removerAssociacao = async (idProduto, idFornecedor) => {
    const confirmar = window.confirm(
      'Deseja realmente remover esta associação?'
    );

    if (!confirmar) return;

    setMensagem('');
    setErro('');

    try {
      const resposta = await fetch(
        `${API}/produto-fornecedor/produto/${idProduto}/fornecedor/${idFornecedor}`,
        {
          method: 'DELETE'
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            resultado.mensagem ||
            'Erro ao remover associação.'
        );
      }

      setMensagem('Associação removida com sucesso.');

      await consultarFornecedoresDoProduto(idProduto);
      await consultarProdutosDoFornecedor(idFornecedor);
    } catch (e) {
      setErro(e.message);
    }
  };

  return (
    <div>
      <h1 className="page-title">Associação Produto/Fornecedor</h1>

      <p className="page-description">
        Associação, consulta e remoção de relacionamentos entre produtos e
        fornecedores.
      </p>

      <section className="card">
        <h2>Nova associação</h2>

        <form onSubmit={associar}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="produto">Produto</label>
              <select
                id="produto"
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
              >
                <option value="">Selecione um produto</option>

                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.id} - {produto.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fornecedor">Fornecedor</label>
              <select
                id="fornecedor"
                value={fornecedorId}
                onChange={(e) => setFornecedorId(e.target.value)}
              >
                <option value="">Selecione um fornecedor</option>

                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.id} - {fornecedor.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-success" type="submit">
              Associar Produto ao Fornecedor
            </button>
          </div>
        </form>

        {mensagem && <div className="message success">{mensagem}</div>}
        {erro && <div className="message error">{erro}</div>}
      </section>

      <section className="card">
        <h2>Fornecedores de um produto</h2>

        <div className="form-group">
          <label htmlFor="consultaProduto">
            Selecione o produto
          </label>

          <select
            id="consultaProduto"
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
          >
            <option value="">Selecione um produto</option>

            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.id} - {produto.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            className="btn"
            type="button"
            onClick={() => consultarFornecedoresDoProduto()}
          >
            Consultar fornecedores
          </button>
        </div>

        {fornecedoresDoProduto.length === 0 ? (
          <p className="empty">
            Nenhum fornecedor encontrado para este produto.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fornecedor</th>
                  <th>CNPJ</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {fornecedoresDoProduto.map((fornecedor) => (
                  <tr key={fornecedor.id}>
                    <td>{fornecedor.id}</td>
                    <td>{fornecedor.nome}</td>
                    <td>{fornecedor.cnpj || '-'}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() =>
                          removerAssociacao(
                            Number(produtoId),
                            fornecedor.id
                          )
                        }
                      >
                        Remover associação
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Produtos de um fornecedor</h2>

        <div className="form-group">
          <label htmlFor="consultaFornecedor">
            Selecione o fornecedor
          </label>

          <select
            id="consultaFornecedor"
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
          >
            <option value="">Selecione um fornecedor</option>

            {fornecedores.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.id} - {fornecedor.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            className="btn"
            type="button"
            onClick={() => consultarProdutosDoFornecedor()}
          >
            Consultar produtos
          </button>
        </div>

        {produtosDoFornecedor.length === 0 ? (
          <p className="empty">
            Nenhum produto encontrado para este fornecedor.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {produtosDoFornecedor.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>R$ {Number(produto.preco).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() =>
                          removerAssociacao(
                            produto.id,
                            Number(fornecedorId)
                          )
                        }
                      >
                        Remover associação
                      </button>
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

export default Associacoes;
