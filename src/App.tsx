import { useState, useRef, useEffect } from "react";
import buscacep from "./services/buscacep";
import ExportButton from "./components/export.jsx";

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
  const [toggle, setToggle] = useState(false);
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
    nome.current!.value = "";
    email.current!.value = "";
    cep.current!.value = "";
    setIndex(0);
    setAtualizando(false);
  }

  function editar(index: number) {
    setToggle(true);
    const lista = [...clientes];
    nome.current!.value = lista[index].nome;
    email.current!.value = lista[index].email;
    cep.current!.value = lista[index].cep;
    nome.current!.focus();
    setIndex(index);
    setAtualizando(true);
  }

  function excluir(index: number) {
    const lista = [...clientes];
    if (confirm(`Deseja excluir ${lista[index].nome}?`)) {
      lista.splice(index, 1);
      setClientes(lista);
      limpar();
    }
  }
  function handleToggle() {
    setToggle(!toggle);
  }
  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);
  return (
    <div className="w-full min-h-screen bg-stone-400 background py-4 text-gray-700">
      <div className="flex justify-center items-center gap-4 font-bold text-lg mb-4 flex-col gap-4 sm:flex-row">
        <h1 className="text-center w-fit bg-white shadow-md rounded px-8 py-2">
          Cadastro de Clientes
        </h1>
        <button
          className=" w-10 h-10 shrink-0 btn-color rounded-[50%]"
          onClick={() => handleToggle()}
        >
          <i className="fa-solid fa-plus "></i>
        </button>
        <ExportButton data={clientes} />
      </div>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className={toggle ? "show" : "hide"}
      >
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Nome</label>
          <input
            type="text"
            ref={nome}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">E-mail</label>
          <input
            type="email"
            ref={email}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">CEP</label>
          <input
            type="text"
            ref={cep}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row  items-center justify-between">
          <button type="submit" className="btn btn-color">
            {atualizando ? "Atualizar" : "Cadastrar"}
          </button>
          <button onClick={() => limpar()} className="btn btn-color">
            {atualizando ? "Cancelar" : "Limpar"}
          </button>
        </div>
      </form>

      <div className="max-w-[90%] w-[90%] mx-auto overflow-x-auto rounded mb-6">
        <table className=" bg-white shadow-md rounded mx-auto ">
          <thead>
            <tr className="border-b-2 border-lime-400 ">
              <th className="p-2 font-bold">Nome</th>
              <th className="p-2  font-bold">E-mail</th>
              <th className="p-2  font-bold">Endereço</th>
              <th className="p-2  font-bold">Editar</th>
              <th className="p-2  font-bold">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, index) => (
              <tr key={index} className="border-b-2 h-[3em]">
                <td className="px-2">{c?.nome}</td>
                <td className="px-2">{c?.email}</td>
                <td className="px-2">{c?.endereco}</td>
                <td className="text-center">
                  <button onClick={() => editar(index)}>
                    <i className="fa-regular fa-pen-to-square text-lg hover:text-lime-400 transition-all"></i>
                  </button>
                </td>
                <td className="text-center">
                  <button onClick={() => excluir(index)}>
                    <i className="fa-regular fa-trash-can text-lg hover:text-lime-400 transition-all"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="w-full bg-black bg-opacity-10 text-center py-2 font-bold fixed
  bottom-0"
      >
        <p>
          Desenvolvido por{" "}
          <a
            href="https://linkedin.com/in/nycollaskaique"
            target="_blank"
            className="underline"
          >
            Nycollas Kaique
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
