// Menu_Inicial.js

function abrirPagina(pagina) {
    window.open(pagina, '_self');
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const botoesMenu = document.querySelectorAll('.alinhaBtns');
    
    // Adiciona um listener para cada botão do menu
    botoesMenu.forEach(function (botao) {
      botao.addEventListener('click', function () {
        const pagina = botao.getAttribute('data-pagina');
        abrirPagina(pagina);
      });
    });
  });
  