const cobranca = {

  loadCobrancas: () => {

    Inputmask.remove($('input[type="dinheiro"]'));
    $('#cobranca').html('');

    diaria.criar_diaria.cobranca.map( ( el , numb) => {

      $('#cobranca').append(`
        <div class="item">
          <div class="ct-inputs -input-flex">
            <div class="input --input-motivo">
              <input type="text" placeholder="Motivo" value="${el.motivo}" oninput="cobranca.input(this, 'motivo', ${numb})">
            </div>
            <div class="input --input-valor">
              <input type="dinheiro" placeholder="R$ 0,00" value="${el.valor}" oninput="cobranca.input(this, 'valor', ${numb})">
            </div> 
            <div class="cobranca-botao" id="removerCobranca" onclick="cobranca.removerCobranca(${numb});">
              <img src="../images/closeIcon.svg" width="15px" height="15px">
            </div>
          </div>
        </div>
      `);

    });

    $('input[type="dinheiro"]').inputmask('currency', dinheiroConfig);

  },

  input: ( el, tipo, posicao ) => {

    const cobrancaItem = diaria.criar_diaria.cobranca[posicao];

    cobrancaItem[tipo] = tipo == valor ? structuredClone($(el).val()*1) : structuredClone($(el).val());
    

  },

  removerCobranca: ( cobrancaPosicao ) => {

    if(confirm('Você confirma a remoção dessa cobrança?')){

      const index = diaria.criar_diaria.cobranca.indexOf(diaria.criar_diaria.cobranca[cobrancaPosicao]);
      if (index > -1) {
        diaria.criar_diaria.cobranca.splice(index, 1);
      }

      cobranca.loadCobrancas();
    }


  },

  adicionarCobranca: () => {

    const cobrancaArray = diaria.criar_diaria.cobranca;

    cobrancaArray.push({
      "motivo": '',
      "valor": 0
    });

    cobranca.loadCobrancas();
  },



};
