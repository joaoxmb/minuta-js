const diaria =  {

  open_diaria: 0,
  open_tipo: '',
  criar_diaria: {},

  abrirContainer(){
    $('#aba-diaria').css({ 'top': '100%', 'display': 'block' });
    $('#aba-inicio').css({ transform: 'translate(-50%, -0%) scale(0.93)', filter: 'brightness(0.85)', padding: '20px 0 0 0', overflow: 'hidden'});
    $('body').css({ background: '#231f20' });
  
    setTimeout(function () {
      $('#aba-diaria').css({ 'top': 'calc(0% + 40px)', 'display': 'block' });
    }, 100);
  },

  abrir: ( diariaNumber ) => {
    diaria.open_diaria = diariaNumber;
    diaria.open_tipo = 'abrir';
    diaria.criar_diaria = structuredClone(DATA.diarias[diaria.open_diaria]);

    const verificandoCobrancas = () => {
      if( diaria.criar_diaria.cobranca.length == 0 ){
        diaria.criar_diaria.cobranca.push({
          motivo: '',
          valor: 0
        });
        cobranca.loadCobrancas();
      }
    };

    $('#aba-diaria .nome-page').html('Editar diaria');
    $('#inicio').val(diaria.criar_diaria.inicio);
    $('#ocorrencia').val(diaria.criar_diaria.ocorrencia);
    $('#aba-diaria #apagarDiaria').css({ display: 'block' });
    $('#aba-diaria #termino').css({ display: 'block' });
    
    $('#aba-diaria #valor').val(DATA.tipo == 'pacote' ? diaria.criar_diaria.valor : calculadora.valorPorHora(diaria.criar_diaria.horas));

    if (DATA.tipo == 'pacote') {
      $('#aba-diaria #termino').parent().css({ display: 'none' });
      $('#aba-diaria #valor').parent().removeAttr('desativado');
    } else {
      diaria.load_termino();
      $('#aba-diaria #valor').parent().attr('desativado', 'desativado');
    }

    cobranca.loadCobrancas();
    diaria.abrirContainer();
    verificandoCobrancas();
  },

  criar: () => {

    diaria.open_tipo = 'criar';

    $('#aba-diaria .nome-page').html('Nova diaria');
    diaria.criar_diaria = {
      inicio: '',
      horas: DATA.tipo == 'tabela' ? TABELA.find(e => e.id == DATA.valor.tabela).valores[0].horas: DATA.valor.minimoDeHoras,
      ocorrencia: '',
      cobranca: [
        {
          "motivo": '',
          "valor": 0
        }
      ],
    };
                    
    $('#ocorrencia,#inicio,#termino,#valor').val('');
    $('#aba-diaria #apagarDiaria').css({display: 'none'});
    $('#aba-diaria #termino').css({display: 'block'});
    $('#aba-diaria #valor').parent().attr('desativado', 'desativado');

    if(DATA.tipo == 'pacote'){
      $('#aba-diaria #termino').parent().css({display: 'none'});
      $('#aba-diaria #valor').parent().removeAttr('desativado');
    }
    
    cobranca.loadCobrancas();
    diaria.abrirContainer();
  },

  fechar: function(){ 
    $('#aba-diaria').css({'top': '100%'});
    $('#aba-inicio').css({transform: 'translate(-50%, -0%) scale(1)',filter: 'brightness(1)', padding: '0', overflow: 'unset'});
    $('body').css({background: ''});
  
    setTimeout(function() {
      $('#aba-diaria').css('display', 'none');
    }, 200);
  },

  salvar: function(){

    const deleteCobrancaNull = () => {
      return diaria.criar_diaria.cobranca.filter(function( element ) {return element.valor != 0 && element.motivo != ''});;
    };
    // setando array filtrado
    diaria.criar_diaria.cobranca = deleteCobrancaNull();

    if(diaria.open_tipo == 'criar'){
      DATA.diarias.push(structuredClone(diaria.criar_diaria));
      diaria.fechar();
      minuta.load.diarias();
    }else{
      DATA.diarias[diaria.open_diaria] = structuredClone(diaria.criar_diaria);
      diaria.fechar();
      minuta.load.diarias();    
    }
    setarDataHash();
  },

  apagar: function(){
  
    var index = DATA.diarias.indexOf(DATA.diarias[diaria.open_diaria]);
    if (index > -1) {
      DATA.diarias.splice(index, 1);
    }

    diaria.fechar();
    minuta.load.diarias();

    console.log('execute');

  },

  input: {

    ocorrencia: ( value ) => {
      diaria.criar_diaria.ocorrencia = $(value).val();
    },
    inicio: ( value ) => {
      diaria.criar_diaria.inicio = $(value).val();
      diaria.load_termino();
    },
    termino: ( value ) => {
      value = $(value).val();
      diaria.criar_diaria.horas = value;
      $('#aba-diaria #valor').val(calculadora.valorPorHora(value));
    },
    valor: ( value ) => {
      diaria.criar_diaria.valor = $(value).val();
    },
    
  },

  load_termino: () => {

    $('#aba-diaria #termino').html('');

    if( DATA.tipo == 'tabela' ){

      const length = TABELA.find(e => e.id == DATA.valor.tabela).valores.length;
      
      for(let i=0;i < length;i++){

        const dataCalculada = moment(diaria.criar_diaria.inicio).add(DATA.valor.minimoDeHoras, 'hours').add(i, 'hours');
        const horas = (DATA.valor.minimoDeHoras) + i;
  
        $('#aba-diaria #termino').append(`
          <option value="${horas}">
            ${moment(dataCalculada).format('HH:mm')} | ${horas.toFixed(1)} h
          </option>
        `);

      }

    }else if( DATA.tipo == 'corrida' ){

      for(let i=0;i < 21;i++){

        let dataCalculada = moment(diaria.criar_diaria.inicio).add(DATA.valor.minimoDeHoras, 'hours').add((i/2), 'hours');
        let horas = (DATA.valor.minimoDeHoras) + (i / 2);
  
        let el = `<option value="${horas}">
                    ${moment(dataCalculada).format('HH:mm')} | ${horas.toFixed(1)} h
                  </option>`;
  
        $('#aba-diaria #termino').append(el);
  
      }

    }

    $('#aba-diaria #termino').val(diaria.criar_diaria.horas||DATA.valor.minimoDeHoras||TABELA.find(e => e.id == DATA.valor.tabela).valores[0].horas).change();
    $('#aba-diaria #valor').val(calculadora.valorPorHora(diaria.criar_diaria.horas));
  }

}