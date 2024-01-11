const mysql = require('mysql2/promise');

async function obterProdutosDoBanco() {
  try {
    const connection = await connect(); // Utiliza a função de conexão que você já possui
    const [rows] = await connection.query('SELECT * FROM produtos'); // Consulta todos os produtos na tabela 'produtos'

    return rows;
  } catch (error) {
    console.error('Erro ao obter produtos do banco:', error);
    throw error;
  }
}

// ...

// Recupera os dados armazenados no MySQL
async function exibirProdutos() {
  try {
    const produtos = await obterProdutosDoBanco();

    if (produtos.length > 0) {
      const tbody = document.getElementById('tbody');
      tbody.innerHTML = ''; // Limpa o conteúdo anterior

      produtos.forEach(produto => {
        const tr = document.createElement('tr');

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = produto.codigo;
        tr.appendChild(tdCodigo);

        const tdProduto = document.createElement('td');
        tdProduto.innerText = produto.produto;
        tr.appendChild(tdProduto);

        const tdMarca = document.createElement('td');
        tdMarca.innerText = produto.marca;
        tr.appendChild(tdMarca);

        const tdModelo = document.createElement('td');
        tdModelo.innerText = produto.modelo;
        tr.appendChild(tdModelo);

        const tdValor = document.createElement('td');
        tdValor.innerText = `R$ ${produto.valor}`;
        tr.appendChild(tdValor);

        const tdQuantidade = document.createElement('td');
        tdQuantidade.innerText = produto.quantidade;
        tr.appendChild(tdQuantidade);

        tbody.appendChild(tr);
      });
    } else {
      // Se não existirem, exibe uma mensagem informando que não há produtos no estoque
      const tbody = document.getElementById('tbody');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = headerCells.length;
      td.innerText = "Não há produtos no estoque.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  } catch (error) {
    console.error('Erro ao exibir produtos:', error);
  }
}

// ...

// Chame a função para exibir os produtos
exibirProdutos();
