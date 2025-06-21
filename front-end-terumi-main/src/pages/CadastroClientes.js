import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Início: Estilos convertidos para objetos JavaScript ---

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
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    padding: "2rem",
    color: "white",
    overflowY: 'auto',
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1rem 0',
    maxWidth: '800px',
  },
  linha: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'white',
    color: '#333'
  },
  rotulo: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
  },
  botao: {
    background: '#3b0a0a',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: 'fit-content',
    transition: 'background-color 0.3s',
  },
  popup: {
    background: '#28a745',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
    fontWeight: 'bold',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    animation: 'fadeInOut 3s ease-in-out',
  },
};

const getSidebarItemStyle = (isActive) => ({
  fontWeight: 'bold',
  background: isActive ? '#000' : '#3b0a0a',
  padding: '0.5rem',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background 0.3s',
  marginBottom: '1rem',
});

// --- Fim dos Estilos ---

export default function CadastroClientes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cliente, setCliente] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    cep: "",
    numero: "",
    bairro: ""
  });

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8080/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar cliente');
        }

        console.log("Cliente cadastrado:", await response.json());

        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);

        // Limpa o formulário
        setCliente({
            nome: "",
            cpf: "",
            telefone: "",
            cep: "",
            numero: "",
            bairro: ""
        });
    } catch (error) {
        console.error("Falha no cadastro:", error);
        alert("Não foi possível cadastrar o cliente. Verifique o console para mais detalhes.");
    } finally {
        setLoading(false);
    }
  };
  
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
             <div style={getSidebarItemStyle(location.pathname === "/cadastro-produto")} onClick={() => navigate("/cadastro-produto")}>
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

        <main style={styles.main}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Cadastro de Clientes
          </h2>
          <hr style={styles.linhaTitulo} />

          <form style={styles.formulario} onSubmit={handleSubmit}>
            <div style={styles.linha}>
              <div style={{ flex: 1 }}>
                <label style={styles.rotulo}>Nome</label>
                <input name="nome" placeholder="Nome completo" value={cliente.nome} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.rotulo}>CPF</label>
                <input name="cpf" placeholder="000.000.000-00" value={cliente.cpf} onChange={handleChange} required style={styles.input} />
              </div>
            </div>

            <div style={styles.linha}>
              <div style={{ flex: 1 }}>
                <label style={styles.rotulo}>Telefone</label>
                <input name="telefone" type="tel" placeholder="(00) 00000-0000" value={cliente.telefone} onChange={handleChange} required style={styles.input} />
              </div>
            </div>

            <hr style={styles.linhaTitulo} />

            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Endereço</h4>
            <div style={styles.linha}>
              <div style={{ flex: 1 }}>
                <label style={styles.rotulo}>CEP</label>
                <input name="cep" placeholder="00000-000" value={cliente.cep} onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.rotulo}>Número</label>
                <input name="numero" placeholder="Nº" value={cliente.numero} onChange={handleChange} style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.rotulo}>Bairro</label>
                <input name="bairro" placeholder="Bairro" value={cliente.bairro} onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <button type="submit" style={styles.botao} disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </main>
      </div>

      {showPopup && <div style={styles.popup}>Cadastro realizado com sucesso!</div>}
    </>
  );
}