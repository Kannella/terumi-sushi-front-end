import React, { useEffect, useState } from "react";
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
  inputFiltro: {
    padding: "0.75rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "1.5rem",
    width: "300px",
    backgroundColor: 'white',
    color: '#333',
  },
  clienteContainer: {
    marginBottom: '2rem',
  },
  pedidoCard: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
  },
  itemPedido: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.25rem 1rem",
  },
  itemQuantidade: {
    width: "50px",
    padding: "0.4rem",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#eee",
    color: '#333',
    textAlign: "center"
  }
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

export default function Clientes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [todosClientes, setTodosClientes] = useState([]);
  const [todosPedidos, setTodosPedidos] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [clientesRes, pedidosRes] = await Promise.all([
          fetch('http://localhost:8080/api/clientes'),
          fetch('http://localhost:8080/api/pedidos')
        ]);

        if (!clientesRes.ok || !pedidosRes.ok) {
          throw new Error('Erro ao buscar dados do servidor.');
        }

        const clientesData = await clientesRes.json();
        const pedidosData = await pedidosRes.json();

        setTodosClientes(clientesData);
        setTodosPedidos(pedidosData);

      } catch (err) {
        setError("Não foi possível carregar os dados. Verifique a conexão com o backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const clientesFiltrados = todosClientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  return (
    <>
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
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Consulta de Clientes e Pedidos</h2>
          <hr style={styles.linhaTitulo} />

          <label htmlFor="filtro" style={{ fontWeight: "bold", marginBottom: "0.25rem", display: "block" }}>
            Buscar cliente por nome:
          </label>
          <input
            id="filtro"
            type="text"
            placeholder="Digite o nome do cliente"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            style={styles.inputFiltro}
          />

          {loading && <p>Carregando dados...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {!loading && !error && (
            <div>
              {clientesFiltrados.map((cliente) => {
                const pedidosDoCliente = todosPedidos.filter(p => p.clienteId === cliente.id);
                return (
                  <div key={cliente.id} style={styles.clienteContainer}>
                    <h3 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: '#ffc107' }}>{cliente.nome}</h3>
                    {pedidosDoCliente.length > 0 ? (
                      pedidosDoCliente.map((pedido) => (
                        <div key={pedido.pedidoId} style={styles.pedidoCard}>
                          <strong style={{ display: "block", marginBottom: "0.5rem" }}>
                            Pedido #{pedido.pedidoId} - {new Date(pedido.dataPedido).toLocaleString('pt-BR')} - Total: {pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </strong>
                          {pedido.itens.map((item) => (
                            <div key={item.produtoId} style={styles.itemPedido}>
                              <span>{item.nomeProduto}</span>
                              <span style={styles.itemQuantidade}>{item.quantidade}x</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p style={{ marginLeft: '1rem', fontStyle: 'italic' }}>Nenhum pedido encontrado para este cliente.</p>
                    )}
                  </div>
                );
              })}
              {clientesFiltrados.length === 0 && filtroNome && (
                 <p>Nenhum cliente encontrado com o nome "{filtroNome}".</p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}