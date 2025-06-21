import React, { useState } from "react";
// import styled from "styled-components"; // Removido para corrigir o erro de dependência
import { useNavigate, useLocation } from "react-router-dom";

// --- Início: Estilos convertidos para objetos JavaScript ---

// Estilos que não dependem de props ou estado
const styles = {
  aside: {
    width: '200px',
    background: '#3b0a0a',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  linhaTitulo: {
    width: '100%',
    height: '4px',
    background: 'linear-gradient(to right, #4b0000, #a60000)',
    marginTop: '0.5rem',
    marginBottom: '1.5rem',
    border: 'none',
    borderRadius: '2px',
  },
  fundo: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundImage: `url("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2070&auto=format&fit=crop")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -2,
  },
  sobreposicao: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: -1,
  },
  conteudo: {
    position: 'relative',
    zIndex: 2,
    height: '100vh',
    display: 'flex',
  },
  popupConfirmacao: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    fontWeight: 'bold',
    zIndex: 1000,
    animation: 'fadeInOut 3s ease-in-out',
  },
};

// Estilo para o item da barra lateral, que muda se estiver ativo
const getSidebarItemStyle = (isActive) => ({
  fontWeight: 'bold',
  background: isActive ? '#000' : '#3b0a0a',
  padding: '0.5rem',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background 0.3s',
  marginBottom: '1rem',
});

// Estilo para o botão de envio
const getBotaoEnviarStyle = (isHovered) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: isHovered ? '#a60000' : '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
});


// --- Fim dos Estilos ---


export default function CadastroProduto() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const categoriasDoBackend = ["ENTRADA", "COMBINADO", "TEMAKI", "BEBIDA"];

  const formatarParaReal = (valor) => {
    const numero = parseFloat(valor.replace(/[^0-9]/g, "")) / 100;
    if (isNaN(numero)) return "";
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  
  const converterPrecoParaNumero = (precoFormatado) => {
      if (!precoFormatado) return 0;
      const numeroString = precoFormatado.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
      return parseFloat(numeroString);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const produtoDTO = {
      nome: nome,
      descricao: descricao,
      preco: converterPrecoParaNumero(preco),
      categoria: categoria,
    };

    try {
      const response = await fetch("http://localhost:8080/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoDTO),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Produto cadastrado:", data);

      setMostrarConfirmacao(true);
      setTimeout(() => {
        setMostrarConfirmacao(false);
      }, 3000);

      setNome("");
      setDescricao("");
      setPreco("");
      setCategoria("");

    } catch (error) {
      console.error("Falha ao cadastrar produto:", error);
      alert("Falha ao cadastrar produto. Verifique o console para mais detalhes.");
    }
  };
  
  // A animação do popup precisa ser injetada como uma tag <style>
  const keyframes = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(20px); }
      15% { opacity: 1; transform: translateY(0); }
      85% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(20px); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.fundo} />
      <div style={styles.sobreposicao} />
      <div style={styles.conteudo}>
        <aside style={styles.aside}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img src="https://placehold.co/60x60/ffffff/3b0a0a?text=User" alt="Perfil" style={{ width: "60px", borderRadius: "50%"}} />
          </div>
          <div style={styles.sidebarMenu}>
             <div
                style={getSidebarItemStyle(location.pathname === "/cadastro-produto")}
                onClick={() => navigate("/cadastro-produto")}
             >
                Cadastro de produtos
            </div>
            <div style={getSidebarItemStyle(location.pathname === "/relatorios")} onClick={() => navigate("/relatorios")}>
                Relatórios
            </div>
            <div style={getSidebarItemStyle(location.pathname === "/clientes")} onClick={() => navigate("/clientes")}>
                Clientes
            </div>
            <div style={getSidebarItemStyle(location.pathname === "/registro-pedido")} onClick={() => navigate("/registro-pedido")}>
                Registro de pedido
            </div>
             <div style={getSidebarItemStyle(location.pathname === "/cadastro-clientes")} onClick={() => navigate("/cadastro-clientes")}>
                Cadastro de clientes
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, padding: "2rem", color: "white" }}>
          <h2>Cadastro de Produtos</h2>
          <hr style={styles.linhaTitulo} />
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              maxWidth: '800px'
            }}
          >
            <input
              placeholder="Nome do Produto"
              style={{ padding: "0.75rem", borderRadius: '5px', border: 'none' }}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            
            <select
              style={{ padding: "0.75rem", borderRadius: '5px', border: 'none' }}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categoriasDoBackend.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            
            <input
              placeholder="Descrição"
              style={{ padding: "0.75rem", gridColumn: "span 2", borderRadius: '5px', border: 'none' }}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
            
            <input
              placeholder="Preço"
              style={{ padding: "0.75rem", borderRadius: '5px', border: 'none' }}
              value={preco}
              onChange={(e) => setPreco(formatarParaReal(e.target.value))}
              required
            />

            <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={getBotaoEnviarStyle(isButtonHovered)}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                Enviar
              </button>
            </div>
          </form>

          {mostrarConfirmacao && (
            <div style={styles.popupConfirmacao}>Produto cadastrado com sucesso!</div>
          )}
        </main>
      </div>
    </>
  );
}