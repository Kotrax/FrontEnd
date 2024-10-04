const btnConsultar = document.getElementById('btnConsultar');
const tbodyList = document.getElementById('tbodyList');
const containerModal = document.getElementById('containerModal');
const FecharModal = document.getElementById('FecharModal');
const FecharModal2 = document.getElementById('FecharModal2');
const CadModal = document.getElementById('CadModal');
const delModal = document.getElementById('delModal')

const inpNome = document.getElementById('inpNome')
const inpDescri = document.getElementById('inpDescri')
const inpFab = document.getElementById('inpFab')
const inpQtda = document.getElementById('inpQtda')
const inpPreco = document.getElementById('inpPreco')
const inpCusto = document.getElementById('inpCusto')
const inpCod = document.getElementById('inpCod')
const inpData = document.getElementById('inpData')

let codDelete;

const api = axios.create({
    baseURL:'http://localhost:2020/'
});


async function consultar(){

  try {
    console.log('Consultando produtos.....');
    const resp = await api.get('produtos');
    const dados = resp.data;
    console.log(resp.data);


    let rows = '';

    for (let i = 0; i < dados.length; i++) {
      let dataFormatada = new Date(dados[i].data)
          .toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        let tr = '<tr>' +
                      '<td>' + dados[i].codpro + '</td>' +
                      '<td>' + dados[i].nome + '</td>' +
                      '<td>' + dados[i].descri + '</td>' +
                      '<td>' + dados[i].fabricante + '</td>' +
                      '<td>' + dados[i].custo + '</td>' +
                      '<td>' + dados[i].preco + '</td>' +
                      '<td>' + dados[i].qtda + '</td>' +
                      '<td>' + dataFormatada + '</td>' +       
                      '<td id="controler">'+
                                '<img src="../imagens/editar.png" class="icons">'  + 
                                '<a id="btnLixo" onclick="deletePro(this)"><img src="../imagens/lixo.png" class="icons"></a>' +
                                '<img src="../imagens/voltar.png" class="icons">' + 
                          '</td>' 
        rows += tr;
    }
    tbodyList.innerHTML = rows;  
  } catch (error) {
  console.error('Erro ao consultar produtos:', error);
  } 
}

async function create(){

  try{
    
      const Nome = inpNome.value;
      const Descri = inpDescri.value;
      const Fab = inpFab.value;
      const Qtda = inpQtda.value;
      const Preco = inpPreco.value;
      const Custo = inpCusto.value;

    data = {
      'nome': Nome,
      'descri' : Descri,
      'fabricante' : Fab,
      'qtda' : Qtda,
      'preco' : Preco,
      'custo' : Custo
    }
    console.log(data);
    
    const response = await api.post('produtos', data);
    }

    catch (error) {
    console.log(`Error ao cadastrar produto. ${error}`);
    }

    };

    async function deletePro(td){
      let dateselection = td.parentElement.parentElement;
 
      containerModal.style.display = 'block';
    
      inpCod.value = dateselection.cells[0].innerHTML;
      inpNome.value = dateselection.cells[1].innerHTML;
      inpDescri.value = dateselection.cells[2].innerHTML;
      inpQtda.value = dateselection.cells[3].innerHTML;
      inpFab.value = dateselection.cells[4].innerHTML;
      inpPreco.value = dateselection.cells[5].innerHTML;
      inpCusto.value = dateselection.cells[6].innerHTML;
      inpData.value = dateselection.cells[7].innerHTML;  
      codDelete = inpCod.value;
    }

      delModal.onclick = async ()=>{
      const response = await api.delete('produtos/'+codDelete);
      try {
        Swal.fire({
          title: "Tem certeza que deseja deletar?",
          text: "Você não poderá reverter depois.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sim!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deletado com sucesso.",
              text: "Seu arquivo foi deletado.",
              icon: "success"
            });
          
        ;
        if(response.status == 200){
          Swal.fire({
            icon: "successo ",
            title: 'Registro deletado com sucesso',
          });
          containerModal.style.display = 'none'; 
          consultar();
        
         };
        }else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
         } )}
      catch (error) {
          if (error.response) {
            // Verifica se o status é 409 (Conflict)

            if (error.response.status === 409) {
              Swal.fire({
                icon: "error",
                title: error.response.data.msg,
              });
              containerModal.style.display = 'none'; 
            } else {
              alert('Erro ao deletar o produto. Tente novamente.');
            }
          } else {
            // Tratamento para erros de conexão ou outros problemas
            
            console.error('Erro na requisição:', error);

            alert('Erro de conexão com o servidor.');      
          }
       }}

//Botões

FecharModal.onclick = ()=>{
  containerModal.style.display = 'none'; 
};

CadModal.onclick = ()=>{
  create();
};


btnIncluir.onclick = ()=>{
  containerModal.style.display = 'block';
};

btnConsultar.onclick = async ()=>{
  consultar();
}
FecharModal2.onclick = ()=>{
  containerModal.style.display = 'none'; 
};