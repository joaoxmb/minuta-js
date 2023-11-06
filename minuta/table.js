let DATA;

const dinheiro = ( value ) => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

const formatarNome = ( name ) => {
  return (name.split(' ').map((i) => {
    return i.charAt(0).toUpperCase() + i.slice(1).toLowerCase()
  })).join(' ')
};

const user = () => {
  const dataComMunicipio = ( ) => {
    let date = moment(new Date()).locale('pt-br');
    return (USER.empresa.endereco.municipio + ', ' + date.format('D') + ' DE ' + date.format('MMMM') + ' DE ' + date.format('YYYY')).toUpperCase();
  }

  $('#user-name').text(USER.nome);
  $('#user-info').html(`
    ${USER.empresa.cnpj} <br> 
    ${USER.contato.email} <br> 
    ${USER.contato.celular} <br> 
    ${USER.funcao} <br> 
    DRT ${USER.drt}
  `);
  $('#fechamento-data').text(`${dataComMunicipio()}`);

  $('#minuta-descriminacao').html(`
    Serviço prestado como ${USER.funcao}, solicitado por <b>${DATA.solicitante}</b>, para a empresa <b>${DATA.produtora}</b> no Job <b>${DATA.job}</b>.
  `);

};

const inserirDiarias = () => {
  tipoDaMinuta();
  DATA.diarias.forEach(element => {

    const total = () => {
      return DATA.tipo == 'pacote' ? dinheiro(element.valor) : dinheiro(calculadora.valorPorHora(element.horas));
    };

    if(DATA.tipo != 'pacote'){
      const periodo = () => {
        const inicio = moment(element.inicio);
        const termino = moment(inicio).add(element.horas, 'hours')
        return inicio.format('HH:mm') + ' as ' + termino.format('HH:mm')
      };

      $('table tbody').append(`
        <tr>
          <td rowspan="${element.cobranca.length+1}"><span>${moment(element.inicio).format('DD/MM/YYYY')}</span></td>
          <td>${element.ocorrencia}</td>
          <td>${periodo()}</td>
          <td>${element.horas}</td>
          <td>${total()}</td>
        </tr>
      `);
      
    }else{
      $('table tbody').append(`
        <tr>
          <td rowspan="${element.cobranca.length+1}"><span>${moment(element.inicio).format('DD/MM/YYYY HH:mm')}</span></td>
          <td colspan="3">${element.ocorrencia}</td>
          <td>${total()}</td>
        </tr>
      `);
    }

    element.cobranca.forEach(( data ) => {
      $('table tbody').append(`
      <tr class="cobranca-item">
        <td colspan="3">${ data.motivo }</td>
        <td>${ dinheiro(data.valor) }</td>
      </tr>
      `);
    });

  });
};

const inserirTotal = () => {
  const resultado = calculadora.valorTotal();

  resultado.cobranca == 0 ? $('#cobranca-total').parent().remove() :  null;
  $('#cobranca-total').text(dinheiro(resultado.cobranca))
  $('#valor-total').text(dinheiro(resultado.total));

  if( DATA.tipo != 'pacote'){
    $('#horas-total').text(resultado.horas);
    
  }else{
    $('#diarias-total').text(DATA.diarias.length);
  }

};

const inserirObservacao = () => {
  
  if(DATA.observacao != ''){
    $('#obs').html(`
      <b>Observação:</b>
      ${DATA.observacao}
    `);
  }

};

const tipoDaMinuta = () => {
  if( DATA.tipo == 'pacote' ){
    $('#table_por_hora').remove();
  }else{
    $('#table_pacote').remove();
  }
};

(async () => {

  const hash = `blob:${location.origin}/${location.search.replace('?', '')}`;
  const response = await fetch(hash).catch(() => {
    window.close();
  });
  const blob = await response.blob();
  const text = await blob.text();

  DATA = JSON.parse(text);

  user();
  inserirDiarias();
  inserirTotal();
  inserirObservacao();
  
  share();

})();




