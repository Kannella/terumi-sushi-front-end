import React, { useState, useEffect } from "react";
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
  },
  pedidoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '2rem',
  },
  linhaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  select: {
    padding: '0.75rem',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ccc',
    flexGrow: 1,
  },
  quantidadeBtn: {
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  quantidade: {
    width: '30px',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  addItemBtn: {
    background: 'none',
    border: '1px dashed #888',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '1rem',
    padding: '0.5rem',
    borderRadius: '5px',
    transition: 'background 0.3s',
  },
  totalsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '350px',
    marginLeft: 'auto',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
  },
  popup: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    zIndex: 999,
    animation: 'slideIn 0.5s ease forwards, fadeOut 0.5s ease 2.5s forwards',
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

const getEnviarBtnStyle = (isHovered) => ({
  marginTop: '1.5rem',
  padding: '0.75rem 1.5rem',
  background: isHovered ? '#a60000' : '#8b0000',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.3s',
});

// CORRIGIDO: A chave 'fontSize' não está mais duplicada.
const getTotalLineStyle = (isTotal) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.25rem 0',
  color: 'white',
  fontWeight: isTotal ? 'bold' : 'normal',
  fontSize: isTotal ? '1.3rem' : '1.1rem',
  paddingTop: isTotal ? '1rem' : '0.25rem',
  borderTop: isTotal ? '1px solid #555' : 'none',
});

// --- Fim dos Estilos ---

export default function PedidoRegistro() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para dados do backend
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);

  // Estados para o pedido atual
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [itensPedido, setItensPedido] = useState([
    { produtoId: '', quantidade: 1 }
  ]);
  
  // Estados de UI
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [isBtnEnviarHovered, setIsBtnEnviarHovered] = useState(false);

  // Busca dados do backend ao carregar o componente
  useEffect(() => {
    // Buscar produtos
    fetch("http://localhost:8080/api/produtos")
      .then((res) => res.json())
      .then((data) => setProdutosDisponiveis(data))
      .catch((err) => console.error("Falha ao buscar produtos:", err));

    // Buscar clientes
    fetch("http://localhost:8080/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientesDisponiveis(data))
      .catch((err) => console.error("Falha ao buscar clientes:", err));
  }, []);

  const alterarQuantidade = (index, delta) => {
    setItensPedido((prevItens) =>
      prevItens.map((item, i) =>
        i === index
          ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
          : item
      )
    );
  };

  const handleItemChange = (index, novoProdutoId) => {
    setItensPedido((prevItens) =>
      prevItens.map((item, i) =>
        i === index ? { ...item, produtoId: novoProdutoId } : item
      )
    );
  };

  const adicionarItem = () => {
    setItensPedido([...itensPedido, { produtoId: '', quantidade: 1 }]);
  };

  const handleEnviarPedido = async () => {
    if (!selectedClienteId) {
        alert("Por favor, selecione um cliente.");
        return;
    }

    const itensParaEnviar = itensPedido
        .filter(item => item.produtoId && item.quantidade > 0)
        .map(item => ({
            produtoId: parseInt(item.produtoId, 10),
            quantidade: item.quantidade
        }));

    if (itensParaEnviar.length === 0) {
        alert("Por favor, adicione pelo menos um produto ao pedido.");
        return;
    }

    const pedidoDTO = {
        clienteId: parseInt(selectedClienteId, 10),
        itens: itensParaEnviar
    };

    try {
        const response = await fetch("http://localhost:8080/api/pedidos", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoDTO)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar pedido');
        }

        await response.json();
        setMostrarPopup(true);
        setTimeout(() => setMostrarPopup(false), 3000);

        // Resetar formulário
        setSelectedClienteId('');
        setItensPedido([{ produtoId: '', quantidade: 1 }]);

    } catch (error) {
        console.error("Erro no pedido:", error);
        alert("Falha ao registrar o pedido. Verifique o console.");
    }
  };
  
  const calcularSubTotal = () => {
      return itensPedido.reduce((total, item) => {
          const produto = produtosDisponiveis.find(p => p.id.toString() === item.produtoId);
          return total + (produto ? produto.preco * item.quantidade : 0);
      }, 0);
  };

  const subTotal = calcularSubTotal();
  const taxaAtendimento = subTotal * 0.10;
  const totalPedido = subTotal + taxaAtendimento;
  
  const keyframes = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(30px); }
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

        <main style={{ flex: 1, padding: "2rem", color: "white" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Registro de Pedido</h2>
          <hr style={styles.linhaTitulo} />

          <div style={styles.pedidoContainer}>
            <select
                style={styles.select}
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
            >
                <option value="">Selecione um Cliente</option>
                {clientesDisponiveis.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
            </select>
            
            <hr style={{border: '1px solid #444', margin: '1rem 0'}}/>

            {itensPedido.map((item, index) => (
              <div key={index} style={styles.linhaItem}>
                <select 
                    style={styles.select} 
                    value={item.produtoId} 
                    onChange={(e) => handleItemChange(index, e.target.value)}
                >
                  <option value="">Selecione um Produto</option>
                  {produtosDisponiveis.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco.toFixed(2)}</option>
                  ))}
                </select>

                <button style={styles.quantidadeBtn} onClick={() => alterarQuantidade(index, -1)}>-</button>
                <span style={styles.quantidade}>{item.quantidade}</span>
                <button style={styles.quantidadeBtn} onClick={() => alterarQuantidade(index, 1)}>+</button>
              </div>
            ))}

            <button style={styles.addItemBtn} onClick={adicionarItem}>
              Adicionar mais itens +
            </button>
          </div>
          
           <div style={{display: 'flex', justifyContent: 'flex-end'}}>
             <div style={styles.totalsContainer}>
                <div style={getTotalLineStyle(false)}>
                  <span>Sub-total</span>
                  <span>{subTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div style={getTotalLineStyle(false)}>
                  <span>Taxa de atendimento (10%)</span>
                  <span>{taxaAtendimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div style={getTotalLineStyle(true)}>
                  <span>Total do pedido</span>
                  <span>{totalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <button 
                  style={getEnviarBtnStyle(isBtnEnviarHovered)} 
                  onClick={handleEnviarPedido}
                  onMouseEnter={() => setIsBtnEnviarHovered(true)}
                  onMouseLeave={() => setIsBtnEnviarHovered(false)}
                 >
                 Enviar Pedido
                </button>
            </div>
           </div>

        </main>
      </div>

      {mostrarPopup && <div style={styles.popup}>Pedido enviado com sucesso!</div>}
    </>
  );
}
