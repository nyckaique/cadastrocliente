import { useState, useRef, useEffect } from "react";
import buscacep from "./services/buscacep";

function App() {
  interface Cliente {
    nome: string;
    email: string;
    endereco: string;
    cep: string;
  }
  const getLocalStorage = () => {
    const storage = localStorage.getItem("clientes");
    if (storage) {
      return JSON.parse(storage);
    } else {
      return [];
    }
  };
  // const [cliente, setCliente] = useState<Cliente>();
  const [clientes, setClientes] = useState<Cliente[]>(getLocalStorage);
  const [index, setIndex] = useState<number>(0);
  const [atualizando, setAtualizando] = useState(false);
  const nome = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const cep = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nomeValue = nome.current;
    const emailValue = email.current;
    const cepValue = cep.current;
    if (
      nomeValue &&
      nomeValue.value.length > 0 &&
      emailValue &&
      emailValue.value.length > 0 &&
      cepValue &&
      cepValue.value.length > 0
    ) {
      try {
        //console.log(`${cep.current?.value}/json`);
        const response = await buscacep.get(`${cep.current?.value}/json`);
        const aux: Cliente = {
          nome: nome.current.value,
          email: email.current.value,
          endereco:
            response.data.logradouro +
            ", " +
            response.data.bairro +
            ", " +
            response.data.localidade +
            " - " +
            response.data.uf,
          cep: cepValue.value,
        };
        if (atualizando) {
          const lista: Cliente[] = [...clientes];
          lista[index] = aux;
          setClientes(lista);
          setAtualizando(false);
          limpar();
        } else {
          const lista: Cliente[] = [...clientes];
          lista.push(aux);
          setClientes(lista);
          limpar();
        }
      } catch (e) {
        alert("Deu um erro na busca!");
        console.log(e);
      }
    }
  }

  function limpar() {
    nome.current.value = "";
    email.current.value = "";
    cep.current.value = "";
  }

  function editar(index) {
    const lista = [...clientes];
    nome.current.value = lista[index].nome;
    email.current.value = lista[index].email;
    cep.current.value = lista[index].cep;
    setIndex(index);
    setAtualizando(true);
  }

  function excluir(index: number) {
    const lista = [...clientes];
    lista.splice(index, 1);
    setClientes(lista);
  }
  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);
  return (
    <>
      <h1>Cadastro de Clientes</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome</label>
        <input type="text" ref={nome} />
        <label>E-mail</label>
        <input type="email" ref={email} />
        <label>CEP</label>
        <input type="text" ref={cep} />
        <button type="submit">{atualizando ? "Atualizar" : "Cadastrar"}</button>
        <button onClick={() => limpar()}>Limpar</button>
      </form>
      <ul>
        {clientes.map((c, index) => (
          <li key={index}>
            <span>Nome {c?.nome}</span>
            <span>E-mail {c?.email}</span>
            <span>Endereço {c?.endereco}</span>
            <button onClick={() => editar(index)}>Editar</button>
            <button onClick={() => excluir(index)}>Excluir</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
