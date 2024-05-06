import React from "react";

export default function ExportButton({ data }) {
  function handleExport() {
    // Converter o array de dados em formato JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Criar um objeto Blob a partir do JSON
    const blob = new Blob([jsonData], { type: "application/json" });

    // Criar uma URL para o Blob
    const url = URL.createObjectURL(blob);

    //Formatar o nome do arquivo como 'cliente_DIA-MES-ANO_HORAhMINUTOS.json'
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}_${currentDate.getHours()}h${currentDate.getMinutes()}`;
    const fileName = `clientes_${formattedDate}.json`;

    //Criar um elemento <a> para fazer o download do arquivo
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Nome do arquivo a ser baixado

    //Simular um clique no link para iniciar o download
    a.click();

    //Limpar a URL do Blob após o download
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={handleExport} className="btn btn-color">
      Exportar Clientes <i class="fa-solid fa-file-arrow-down"></i>
    </button>
  );
}
