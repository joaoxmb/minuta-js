const calculadora = {

  valorPorHora: ( horas ) =>{
    if( DATA.tipo == 'tabela' ) {
  
      const use_tabela = TABELA.find(e => e.id == DATA.valor.tabela);
  
      horas = Math.max(horas, use_tabela.valores[0].horas);
      return use_tabela.valores.find(e => e.horas == horas).valor;
  
    }else if( DATA.tipo == 'corrida' ){
  
      horas = Math.max(horas, DATA.valor.minimoDeHoras);
      return horas * DATA.valor.valorHora;
  
    }
  },

  valorCobranca: () => {
    const todasCobrancas = DATA.diarias.map(( diaria ) => diaria.cobranca.map(( cobranca ) => cobranca.valor)).filter(( element ) => element.length != 0);

    if( todasCobrancas.length != 0 ){
      const somaDasCobrancas = todasCobrancas.reduce(( array, i ) => array.concat(i)).reduce(( valor, i ) => valor+i);
      return somaDasCobrancas;
    }else{
      return 0;
    }
  },

  valorTotal: () => {

    const cobranca = Number(calculadora.valorCobranca());
    let horas = 0;
    let horas_extra = 0;
    let total_extra = 0;
    let total = 0;

    DATA.diarias.forEach((value) => {

      horas += Number(value.horas); // total horas

      if( DATA.tipo == 'tabela' ){

        const use_tabela = TABELA.find(e => e.id == DATA.valor.tabela);

        horas_extra += value.horas - use_tabela.valores[0].horas;
        total_extra += calculadora.valorPorHora(value.horas) - use_tabela.valores[0].valor;

      }
      if( DATA.tipo != 'pacote'){

        total += calculadora.valorPorHora(value.horas);

      }else{
        total += value.valor||0;
      }

    });

    total += cobranca;

    return {cobranca,horas,horas_extra,total_extra,total}
  },

};