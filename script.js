const dinheiro = ( value ) => value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
const abrirMinuta = () => {

  const blob = new Blob([JSON.stringify(DATA)], {type: 'application/json'});
  const link = URL.createObjectURL(blob).replace(`blob:${location.origin}/`, '');

  let popUp = window.open(`/minuta/index.html?${link}`);
      try {
          popUp.focus();
      }catch (e) {
          alert("Pop-up Blocker is enabled! Please disable your pop-up blocker.");
      }
};
const inserirCabecalho = () => {
  $('#user_nome').text(USER.nome);
  $('#user_cnpj').text(USER.empresa.cnpj);
};
const abrirNovaAba = () => {
  window.open(`/`);
};


$('select').change(function(){
  let text = $(this).find("option:selected").text();
  let $test = $("<span>").html(text)

  $test.appendTo($('body'));
  let width = $test.width();
  $test.remove();

  $(this).width(width);
});

const dinheiroConfig = {
  autoUnmask: true,
  radixPoint: ",",
  groupSeparator: ".",
  allowMinus: false,
  prefix: 'R$ ',
  digits: 2,
  digitsOptional: false,
  unmaskAsNumber: true,
  rightAlign: false
};

$('input[type="dinheiro"]').inputmask('currency', dinheiroConfig);

$('input[type="numero"]').inputmask('decimal', {
  autoUnmask: true,
  allowMinus: false,
  unmaskAsNumber: true,
});

$('.input').click(function (event) {
  $(this).find('input,textarea,select').focus();
});

const resizeTextArea = ( element ) => {
  element.style.height = 'auto';
  element.style.height = (element.scrollHeight) + 'px';
}

$('textarea').on('input', element => resizeTextArea(element.target))

inserirCabecalho();
minuta.iniciar();
minuta.load.diarias();
minuta.load.tabela();
resizeTextArea($('textarea')[0]);