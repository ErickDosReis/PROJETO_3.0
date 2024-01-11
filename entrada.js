let codigo = document.getElementById('codigo');
let produto = document.getElementById('produto');
let marca = document.getElementById('marca');
let modelo = document.getElementById('modelo');
let valor = document.getElementById('valor');
let quantidade = document.getElementById('quantidade');
let lista = document.getElementById('listaSelect');
let cadastros = [];

async function buscarProduto() {
  const codigoPesquisa = document.getElementById('codigo').value;
  if (codigoPesquisa) {
    try {
      const connection = await connect();
      const [rows] = await connection.execute('SELECT * FROM produtos WHERE codigo = ?', [codigoPesquisa]);
      if (rows.length > 0) {
        preencherCampos(rows[0]);
      } else {
        document.getElementById('produto').focus();
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar produto.');
    }
  } else {
    alert('Por favor, preencha o campo "Código" antes de pesquisar.');
  }
}

function preencherCampos(produto) {
  document.getElementById('codigo').value = produto.codigo;
  document.getElementById('produto').value = produto.produto;
  document.getElementById('marca').value = produto.marca;
  document.getElementById('modelo').value = produto.modelo;
  document.getElementById('valor').focus();
}

// Função para incluir um novo produto no estoque
async function incluir() {
  var produto = document.getElementById("produto").value;
  var marca = document.getElementById("marca").value;
  var modelo = document.getElementById("modelo").value;
  var valor = document.getElementById("valor").value;
  var quantidade = document.getElementById("quantidade").value;

  try {
    const connection = await connect();
    await connection.execute(
      'INSERT INTO produtos (produto, marca, modelo, valor, quantidade) VALUES (?, ?, ?, ?, ?)',
      [produto, marca, modelo, valor, quantidade]
    );
    alert("Produto incluído com sucesso.");
  } catch (error) {
    console.error(error);
    alert("Erro ao incluir novo produto.");
  }
}

  
  const mysql = require('mysql2/promise');

  let pool;
  
  // Inicializar o pool imediatamente
  (async () => {
    pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '7070',
      database: 'gerenciamento_estoque',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  })();
  
  // Função para conectar ao banco de dados
  async function connect() {
    return pool;
  }
  

async function finalizar() {
  if (cadastros.length === 0) {
    window.alert('Não há produtos para cadastrar!');
    return;
  }

  try {
    const connection = await connect();
    const insertQuery = 'INSERT INTO produtos (codigo, produto, marca, modelo, valor, quantidade) VALUES ?';
    const values = cadastros.map(cadastro => [
      cadastro.codigo,
      cadastro.produto,
      cadastro.marca,
      cadastro.modelo,
      cadastro.valor,
      cadastro.quantidade,
    ]);
    await connection.query(insertQuery, [values]);
    window.alert('Todos os produtos foram cadastrados com sucesso!');
    cadastros.length = 0;
    reinicia();
    excluirTodos();
  } catch (err) {
    console.error(err);
    window.alert('Erro ao cadastrar produtos!');
  }
}

function excluirTodos() {
  if (lista.length == 0) {
    window.alert('Não há ítens a serem apagados.');
  } else {
    const select = document.forms.myForm.listaSelect;
    while (select.length > 0) {
      select.remove(0);
    }
    cadastros.splice(0, cadastros.length);
  }
}

function excluirSelecionado() {
  if (lista.length == 0) {
    window.alert('Não há ítens a serem apagados.');
  } else {
    const select = document.forms.myForm.listaSelect;
    select.remove(select.selectedIndex);
    cadastros.splice(select.selectedIndex, 1);
  }
}

function reinicia() {
  produto.value = '';
  codigo.value = '';
  marca.value = '';
  modelo.value = '';
  valor.value = '';
  quantidade.value = '';
  codigo.focus();
}

function preencherFormulario() {
  // Array com informações sobre os itens de vestuário
  const itens = [
    { nome: "Camiseta", marca: "Nike", modelo: "Dry Fit", valor: 49.90, quantidade: 10 },
    { nome: "Camisa", marca: "Polo Ralph Lauren", modelo: "Slim Fit", valor: 199.90, quantidade: 5 },
    { nome: "Calça Jeans", marca: "Levi's", modelo: "501", valor: 249.90, quantidade: 7 },
    { nome: "Bermuda", marca: "Osklen", modelo: "Tropical", valor: 159.90, quantidade: 4 },
    { nome: "Jaqueta", marca: "North Face", modelo: "Thermoball", valor: 799.90, quantidade: 2 },
    { nome: "Blazer", marca: "Zara", modelo: "Slim Fit", valor: 399.90, quantidade: 3 },
    // adicionar mais itens aqui...
  ];

  // Seleciona os campos do formulário
  const codigo = document.getElementById("codigo");
  const produto = document.getElementById("produto");
  const marca = document.getElementById("marca");
  const modelo = document.getElementById("modelo");
  const valor = document.getElementById("valor");
  const quantidade = document.getElementById("quantidade");

  // Preenche o formulário com as informações dos itens
  for (let i = 0; i < 50; i++) {
    const item = itens[Math.floor(Math.random() * itens.length)];
    codigo.value = i + 1;
    produto.value = item.nome;
    marca.value = item.marca;
    modelo.value = item.modelo;
    valor.value = item.valor.toFixed(2);
    quantidade.value = item.quantidade;
    incluir();
  }
}