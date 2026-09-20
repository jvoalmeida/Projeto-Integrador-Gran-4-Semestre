import { useEffect, useState } from 'react';

const API = 'http://localhost:3001';

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');
  const [fornecedorEditando, setFornecedorEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const carregarFornecedores = async () => {
    try {
      const resposta = await fetch(`${API}/fornecedores`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao buscar fornecedores.');
      }

      setFornecedores(dados);
    } catch (e) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const limparFormulario = () => {
    setNome('');
    setCnpj('');
    setEndereco('');
    setContato('');
    setFornecedorEditando(null);
  };

  const salvarFornecedor = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (!nome.trim()) {
      setErro('O nome do fornecedor é obrigatório.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      cnpj: cnpj.trim(),
      endereco: endereco.trim(),
      contato: contato.trim()
    };

    try {
      const url = fornecedorEditando
        ? `${API}/fornecedores/${fornecedorEditando.id}`
        : `${API}/fornecedores`;

      const resposta = await fetch(url, {
        method: fornecedorEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || resultado.mensagem || 'Erro ao salvar fornecedor.');
      }

      setMensagem(
        fornecedorEditando
          ? 'Fornecedor atualizado com sucesso.'
          : 'Fornecedor cadastrado com sucesso.'
      );

      limparFormulario();
      await carregarFornecedores();
    } catch (e) {
      setErro(e.message);
    }
  };

  const editarFornecedor = (fornecedor) => {
    setFornecedorEditando(fornecedor);
    setNome(fornecedor.nome || '');
    setCnpj(fornecedor.cnpj || '');
    setEndereco(fornecedor.endereco || '');
    setContato(fornecedor.contato || '');
    setMensagem('');
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirFornecedor = async (id) => {
    const confirmar = window.confirm(
      'Deseja realmente excluir este fornecedor?'
    );

    if (!confirmar) return;

    setMensagem('');
    setErro('');

    try {
      const resposta = await fetch(`${API}/fornecedores/${id}`, {
        method: 'DELETE'
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || resultado.mensagem || 'Erro ao excluir fornecedor.');
      }

      setMensagem('Fornecedor excluído com sucesso.');
      await carregarFornecedores();
    } catch (e) {
      setErro(e.message);
    }
  };

  return (
    <div>
      <h1 className="page-title">Fornecedores</h1>
      <p className="page-description">
        Cadastro e gerenciamento de fornecedores.
      </p>

      <section className="card">
        <h2>
          {fornecedorEditando ? 'Editar fornecedor' : 'Cadastrar fornecedor'}
        </h2>

        <form onSubmit={salvarFornecedor}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nomeFornecedor">Nome</label>
              <input
                id="nomeFornecedor"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                id="cnpj"
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endereco">Endereço</label>
              <input
                id="endereco"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contato">Contato</label>
              <input
                id="contato"
                type="text"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn" type="submit">
              {fornecedorEditando
                ? 'Atualizar Fornecedor'
                : 'Cadastrar Fornecedor'}
            </button>

            {fornecedorEditando && (
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
        <h2>Fornecedores cadastrados</h2>

        {fornecedores.length === 0 ? (
          <p className="empty">Nenhum fornecedor cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Endereço</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {fornecedores.map((fornecedor) => (
                  <tr key={fornecedor.id}>
                    <td>{fornecedor.id}</td>
                    <td>{fornecedor.nome}</td>
                    <td>{fornecedor.cnpj || '-'}</td>
                    <td>{fornecedor.endereco || '-'}</td>
                    <td>{fornecedor.contato || '-'}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn"
                          type="button"
                          onClick={() => editarFornecedor(fornecedor)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => excluirFornecedor(fornecedor.id)}
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

export default Fornecedores;
