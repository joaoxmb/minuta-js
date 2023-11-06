function share(){

  let IMAGE;
  const capturarImagemMinuta = () => {
    html2canvas(document.querySelector('.minuta'), {
      scale: 3,
    }).then( canva => {
      IMAGE = canva.toDataURL();

      const element = $('#download');
      element.attr('href', IMAGE);
      element.attr('download', `${nomeArquivo.archive()}.png`);

    });
  }

  const compartilhar = async () =>{
    if(navigator.share){
      const blob = await (await fetch(IMAGE)).blob();
      const file = new File([blob], `${nomeArquivo.archive()}.png`, { type: 'image/png' });
      navigator.share({
        files: [file],
      });
    }else{
      window.print();
    }
  };

  const nomeArquivo = {
      ultimaDiaria: DATA.diarias[DATA.diarias.length-1],
      title(){
        return `${DATA.job} - ${DATA.produtora} - ${DATA.solicitante}`
      },
      sub(){
        const { inicio, horas } = this.ultimaDiaria;
        return `${moment(moment(inicio).add(horas ,'hours')).format('DD/MM/YYYY')}`
      },
      archive(){
        const { inicio, horas } = this.ultimaDiaria;
        return `Minuta ${DATA.job} ${moment(moment(inicio).add(horas ,'hours')).format('DD-MM-YYYY')}`
      }
  };

  const inserirHeader = () => {
    $('#ct-title').html(nomeArquivo.title());
    $('#ct-subtitle').html(nomeArquivo.sub());
  };

  inserirHeader(); 
  capturarImagemMinuta();

  document.title = nomeArquivo.archive();

};