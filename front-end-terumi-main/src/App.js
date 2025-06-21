import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Relatorios from "./pages/Relatorios"; // ou o caminho correto
import Clientes from "./pages/Clientes"; // ou o caminho correto
import RegistroPedido from "./pages/RegistroPedido"; // ou o caminho correto
import CadastroClientes from "./pages/CadastroClientes"; // ou o caminho correto

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import CadastroProduto from "./pages/CadastroProduto";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
`;

const Container = styled.div`
  position: relative; /* necessário para sobreposição funcionar */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(/sushi.png); /* nome SEM espaços */
  background-size: cover;        /* cobre toda a tela */
  background-repeat: no-repeat;  /* impede repetição */
  background-position: center;   /* centraliza a imagem */
`;

const Sobreposicao = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-image: url(/sheerred.png);
  background-repeat: no-repeat;      /* Impede repetição */
  background-size: cover;          
  background-position: center;       /* Centraliza */
  pointer-events: none;
  z-index: 1;
`;


const LoginBox = styled.div`
  position: relative;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  color: white;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #8b0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const Link = styled.a`
  color: white;
  font-size: 0.9rem;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
`;

function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (usuario && senha) {
      navigate("/cadastro-produto");
    } else {
      alert("Preencha todos os campos.");
    }
  };

  return (
    <Container>
       <Sobreposicao src="/sheerred.png" alt="sobreposição" />
      <LoginBox>
        <h2 style={{ textAlign: "center" }}>LOGIN</h2>
        <Input
          type="text"
          placeholder="Usuário:"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha:"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Link>Esqueci a senha</Link>
        <Button onClick={handleLogin}>Entrar</Button>
      </LoginBox>
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <GlobalStyle />
     <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro-produto" element={<CadastroProduto />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/registro-pedido" element={<RegistroPedido />} />
        <Route path="/cadastro-clientes" element={<CadastroClientes />} />
      </Routes>
    </Router>
  );
}
