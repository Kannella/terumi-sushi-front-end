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
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    padding: "2rem",
    color: "white",
    overflowY: 'auto',
  },
  filtroContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  inputDate: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  botao: {
    backgroundColor: '#8b0000',
    color: 'white',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  tabelaContainer: {
    marginTop: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    maxHeight: 'calc(100vh - 350px)',
    overflowY: 'auto',
  },
  tabela: {
    width: '100%',
    borderCollapse: 'collapse',
    color: 'white',
  },
  th: {
    backgroundColor: '#4b0000',
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '2px solid #a60000',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #555',
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

export default function Relatorios() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega as bibliotecas para exportação de Excel
  useEffect(() => {
    const carregarScripts = () => {
      const scriptXLSX = document.createElement('script');
      scriptXLSX.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js";
      scriptXLSX.async = true;
      document.body.appendChild(scriptXLSX);

      const scriptFileSaver = document.createElement('script');
      scriptFileSaver.src = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js";
      scriptFileSaver.async = true;
      document.body.appendChild(scriptFileSaver);
    };
    carregarScripts();
  }, []);

  const handleBuscarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      alert('Por favor, selecione a data de início e a data de fim.');
      return;
    }

    setLoading(true);
    setError(null);
    setPedidos([]);

    const dataInicioFormatada = `${dataInicio}T00:00:00`;
    const dataFimFormatada = `${dataFim}T23:59:59`;

    try {
      const url = `http://localhost:8080/api/pedidos?dataInicio=${dataInicioFormatada}&dataFim=${dataFimFormatada}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('A resposta da rede não foi OK');
      }
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError('Falha ao buscar o relatório. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportarParaExcel = () => {
    if (pedidos.length === 0) {
      alert("Não há dados para exportar. Por favor, gere um relatório primeiro.");
      return;
    }
    
    // Verifica se as bibliotecas foram carregadas
    if (typeof XLSX === 'undefined' || typeof saveAs === 'undefined') {
        alert("As bibliotecas de exportação ainda estão carregando. Tente novamente em alguns segundos.");
        return;
    }

    // Formata os dados para uma planilha (flat structure)
    const dadosFormatados = pedidos.flatMap(pedido => 
        pedido.itens.map(item => ({
            'ID Pedido': pedido.pedidoId,
            'Data Pedido': new Date(pedido.dataPedido).toLocaleString('pt-BR'),
            'Cliente': pedido.nomeCliente,
            'Produto': item.nomeProduto,
            'Quantidade': item.quantidade,
            'Preço Unitário': item.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'Subtotal Item': item.subTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            'Valor Total Pedido': pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        }))
    );

    const planilha = XLSX.utils.json_to_sheet(dadosFormatados);
    const livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, planilha, "Relatório de Pedidos");
    const excelBuffer = XLSX.write(livro, { bookType: "xlsx", type: "array" });
    const arquivo = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(arquivo, `relatorio_pedidos_${dataInicio}_a_${dataFim}.xlsx`);
  };

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
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Relatórios de Pedidos</h2>
          <hr style={styles.linhaTitulo} />

          <div style={styles.filtroContainer}>
            <label htmlFor="dataInicio">De:</label>
            <input type="date" id="dataInicio" style={styles.inputDate} value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            <label htmlFor="dataFim">Até:</label>
            <input type="date" id="dataFim" style={styles.inputDate} value={dataFim} onChange={e => setDataFim(e.target.value)} />
            <button style={styles.botao} onClick={handleBuscarRelatorio} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar Relatório'}
            </button>
            <button style={{...styles.botao, backgroundColor: '#006400'}} onClick={exportarParaExcel} disabled={pedidos.length === 0}>
              Exportar para Excel
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={styles.tabelaContainer}>
            <table style={styles.tabela}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID Pedido</th>
                        <th style={styles.th}>Data</th>
                        <th style={styles.th}>Cliente</th>
                        <th style={styles.th}>Itens</th>
                        <th style={styles.th}>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.length > 0 ? (
                        pedidos.map(pedido => (
                            <tr key={pedido.pedidoId}>
                                <td style={styles.td}>{pedido.pedidoId}</td>
                                <td style={styles.td}>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</td>
                                <td style={styles.td}>{pedido.nomeCliente}</td>
                                <td style={styles.td}>
                                    {pedido.itens.map(item => 
                                        <div key={item.produtoId}>{item.quantidade}x {item.nomeProduto}</div>
                                    )}
                                </td>
                                <td style={styles.td}>{pedido.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                           <td colSpan="5" style={{...styles.td, textAlign: 'center'}}>
                                {loading ? 'Carregando dados...' : 'Nenhum pedido encontrado para o período selecionado.'}
                           </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}