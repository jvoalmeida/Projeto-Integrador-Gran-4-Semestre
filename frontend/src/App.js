import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

import Produtos from './pages/Produtos';
import Fornecedores from './pages/Fornecedores';
import Associacoes from './pages/Associacoes';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div>
            <h1>Sistema de Produtos e Fornecedores</h1>
            <p>Projeto Integrador - Gran - 4º Semestre</p>
          </div>
        </header>

        <nav className="menu">
          <Link to="/produtos">Produtos</Link>
          <Link to="/fornecedores">Fornecedores</Link>
          <Link to="/associacoes">Associação Produto/Fornecedor</Link>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/produtos" replace />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/associacoes" element={<Associacoes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
