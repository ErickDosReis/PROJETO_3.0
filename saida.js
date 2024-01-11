// Array que armazena os produtos em estoque
var produtos = [];

// Função para buscar o produto pelo código informado
async function buscarProduto() {
  var codigo = document.getElementById("codigo").value;
  try {
    const connection = await connect();
    const [rows] = await connection.execute('SELECT * FROM produtos WHERE codigo = ?', [codigo]);
    if (rows.length > 0) {
      document.getElementById("produto").value = rows[0].produto;
      document.getElementById("marca").value = rows[0].marca;
      document.getElementById("modelo").value = rows[0].modelo;
      document.getElementById("valor").value = rows[0].valor;
      document.getElementById("quantidade").value = 1;
    } else {
      alert("Produto não encontrado.");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar produto.");
  }
}

// Função para incluir um produto na lista de saída
function retirar() {
  var lista = document.getElementById("listaSelect");
  var codigo = document.getElementById("codigo").value;
  var produto = document.getElementById("produto").value;
  var marca = document.getElementById("marca").value;
  var modelo = document.getElementById("modelo").value;
  var valor = document.getElementById("valor").value;
  var quantidade = document.getElementById("quantidade").value;

  // Verifica se o produto já foi incluído na lista de saída
  for (var i = 0; i < lista.options.length; i++) {
    if (lista.options[i].value == codigo) {
      alert("Este produto já foi incluído na lista de saída.");
      return;
    }
  }

  // Verifica se a quantidade informada é maior que a quantidade em estoque
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].codigo == codigo) {
      if (quantidade > produtos[i].quantidade) {
        alert("Quantidade informada é maior que a quantidade em estoque.");
        return;
      }
      break;
    }
  }

  // Adiciona o produto à lista de saída
  var option = document.createElement("option");
  option.value = codigo;
  option.text = produto + " - " + marca + " - " + modelo + " - " + valor + " - " + quantidade + " unidades";
  lista.add(option);
}

// Função para excluir o produto selecionado da lista de saída
function excluirSelecionado() {
  var lista = document.getElementById("listaSelect");
  var index = lista.selectedIndex;
  if (index >= 0) {
    lista.options[index] = null;
  }
}

// Função para excluir todos os produtos da lista de saída
function excluirTodos() {
  var lista = document.getElementById("listaSelect");
  lista.options.length = 0;
}

// Função para finalizar a saída dos produtos
async function finalizar() {
  var lista = document.getElementById("listaSelect");
  if (lista.options.length == 0) {
    alert("Lista de saída vazia.");
    return;
  }

  try {
    const connection = await connect();
    for (var i = 0; i < lista.options.length; i++) {
      var codigo = lista.options[i].value;
      var quantidade = lista.options[i].text.split("-")[4].trim().split(" ")[0];
      await connection.execute('UPDATE produtos SET quantidade = quantidade - ? WHERE codigo = ?', [quantidade, codigo]);
    }
    alert("Saída de produtos realizada com sucesso.");
    excluirTodos();
  } catch (error) {
    console.error(error);
    alert("Erro ao finalizar saída de produtos.");
  }
}

const mysql = require('mysql2/promise');

let pool;

async function connect() {
  if (!pool) {
    pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '7070',
      database: 'gerenciamento_estoque',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}
