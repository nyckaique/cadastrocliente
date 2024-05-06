import { toast } from "react-toastify";
export default function ImportButton({ handleImport }) {
  const handleFileChange = (e) => {
    //Impede de recarregar a página
    e.preventDefault();
    const file = e.target.files[0];

    //Se não tiver um arquivo, retorna
    if (!file) {
      toast.info("Selecione um arquivo JSON");
      return;
    }

    //Leitura do arquivo
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        //Converte de json string para JS object
        const json = JSON.parse(event.target.result);
        //Salva o JS Object no state clientes
        handleImport(json);
        //Salva o arquivo importado no local storage
        saveToLocalStorage(json);
      } catch (error) {
        toast.error("Erro ao ler o arquivo JSON");
      }
    };
    reader.readAsText(file);
  };

  const saveToLocalStorage = (data) => {
    //Converte de Js Object para Json string e salva no local storage com a tag clientes
    localStorage.setItem("clientes", JSON.stringify(data));
    toast.success("Dados salvos no Local Storage do seu navegador");
  };

  const handleButtonClick = () => {
    //Faz o button de importar clientes clicar no input file que está oculto
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };
  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <button onClick={handleButtonClick} className="btn btn-color">
        Importar Clientes <i class="fa-solid fa-file-arrow-up"></i>
      </button>
    </div>
  );
}
