const btnConsultar = document.getElementById('btnConsultar');
const tbodyList = document.getElementById('tbodyList');
const containerModal = document.getElementById('containerModal');
const FecharModal = document.getElementById('FecharModal');
const btnIncluir = document.getElementById('btnIncluir');
const CadModal = document.getElementById('CadModal');
const DelModal = document.getElementById('DelModal');
const AltModal = document.getElementById('AltModal');

const inpCod = document.getElementById('inpCod');
const inpNome = document.getElementById('inpNome');
const inpDesc = document.getElementById('inpDesc');
const inpQtda = document.getElementById('inpQtda');
const inpFab = document.getElementById('inpFab');
const inpPreco = document.getElementById('inpPreco');
const inpCusto = document.getElementById('inpCusto');
const inpData = document.getElementById('inpData');

let codDelete;
let codAltera;

const api = axios.create({
    baseURL:'http://localhost:2020/'
});


function limpar(){
  inpCod.value = '';
  inpNome.value = '';
  inpDesc.value= '';
  inpFab.value= '';
  inpQtda.value= '';
  inpPreco.value= '';
  inpCusto.value= '';
  inpData.value='';
}

async function consultar (){

  try {
        console.log('Consultando produtos.....');
        const resp = await api.get('produtos');
        const dados = resp.data;
        console.log(resp.data);
   

        let rows = '';
  
        for (let i = 0; i < dados.length; i++) {
          let dataFormatada = new Date(dados[i].data)
          .toLocaleDateString('pt-BR', {timeZone:'UTC'});
            let tr = '<tr>' +
                          '<td>' + dados[i].codpro + '</td>' +
                          '<td>' + dados[i].nome + '</td>' +
                          '<td>' + dados[i].descri + '</td>' +
                          '<td>' + dados[i].fabricante + '</td>' +
                          '<td>' + dados[i].qtda + '</td>' +
                          '<td>' + dados[i].preco + '</td>' +
                          '<td>' + dados[i].custo + '</td>' +
                          '<td>' + dataFormatada + '</td>' +
                          '<td id="controler">'+
                          '<a id="btnTrash" onclick="exibeUpdatePro(this)"><img src="../assets/edit.png" class="icons"></a>'+
                          '<a id="btnlixeira" onclick="deleteProd(this)"><img src="../assets/lixeira.png" class="icons"></a>'+
                          '</td>' +
                      '</tr>';
            rows += tr;
        };

        tbodyList.innerHTML = rows;

  } catch (error) {
    console.error('Erro ao consultar produtos:', error);
  };

}


async function create(){
  try {
    const nome = inpNome.value;
    const desc = inpDesc.value;
    const fab = inpFab.value;
    const qtda = inpQtda.value;
    const preco = inpPreco.value;
    const custo = inpCusto.value;

    data = {
      'nome':nome,
      'descri':desc,
      'fabricante':fab,
      'qtda':qtda,
      'preco':preco,
      'custo':custo,
    };

    const response = await api.post('produtos', data);

    Swal.fire({
      title: "Produto cadastrado!!!!",
      text: "Seu produto foi cadastrado com sucesso",
      icon: "success"
    });
  } catch (error) {
      console.log(`Error ao cadastrar produto. ${error}`);
      
  };
  
};

async function deleteProd(td){
  let dateselection = td.parentElement.parentElement;

  containerModal.style.display = 'block';

  inpCod.disabled = true;
  inpData.disabled = true;
  inpNome.disabled = true;
  inpDesc.disabled = true;
  inpFab.disabled = true;
  inpQtda.disabled = true;
  inpPreco.disabled = true;
  inpCusto.disabled = true;

  DelModal.disabled = false;
  CadModal.disabled = true;
  AltModal.disabled = true;

  inpCod.value = dateselection.cells[0].innerHTML;
  inpNome.value = dateselection.cells[1].innerHTML;
  inpDesc.value = dateselection.cells[2].innerHTML;
  inpFab.value = dateselection.cells[3].innerHTML;
  inpCusto.value = dateselection.cells[4].innerHTML;
  inpPreco.value = dateselection.cells[5].innerHTML;
  inpQtda.value = dateselection.cells[6].innerHTML;
  inpData.value = dateselection.cells[7].innerHTML;  
  codDelete = inpCod.value;
};
async function exibeUpdatePro(td){
  let dateselection = td.parentElement.parentElement;
  containerModal.style.display = 'block';
  inpCod.disabled = true;
  inpData.disabled = true;
  inpNome.disabled = false;
  inpDesc.disabled = false;
  inpFab.disabled = false;
  inpQtda.disabled = false;
  inpPreco.disabled = false;
  inpCusto.disabled = false;

  DelModal.disabled = true;
  CadModal.disabled = true;
  AltModal.disabled = false;

  inpCod.value = dateselection.cells[0].innerHTML;
  inpNome.value = dateselection.cells[1].innerHTML;
  inpDesc.value = dateselection.cells[2].innerHTML;
  inpFab.value = dateselection.cells[3].innerHTML;
  inpCusto.value = dateselection.cells[6].innerHTML;
  inpPreco.value = dateselection.cells[5].innerHTML;
  inpQtda.value = dateselection.cells[4].innerHTML;
  inpData.value = dateselection.cells[7].innerHTML; 

  codAltera = inpCod.value;
}

async function updatePro(){
  try {
    const nome = inpNome.value;
    const desc = inpDesc.value;
    const fab = inpFab.value;
    const qtda = inpQtda.value;
    const preco = inpPreco.value;
    const custo = inpCusto.value;

    data = {
      'nome':nome,
      'descri':desc,
      'fabricante':fab,
      'qtda':qtda,
      'preco':preco,
      'custo':custo
    }
    
    const response = await api.put(`produtos/${codAltera}`, data);
    console.log(response);
    
    if(response.status == 201){
      Swal.fire({
        icon: "success",
        title: 'Registro alterado com sucesso!',
      });
    }
    containerModal.style.display = 'none';
    consultar();
    
  } catch (error) {
      console.log(`Error ao alterar o produto. ${error}`);
  }
}

DelModal.onclick = async ()=>{
  
  try {
    const response = await api.delete('produtos/'+codDelete);
   
    
   const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  
  swalWithBootstrapButtons.fire({
    title: "Tem certeza que deseja deletar?",
    text: "Você não poderá reverter essa ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, desejo deletar.",
    cancelButtonText: "Não, não desejo deletar.",
    reverseButtons: true
  })
  
  .then((result) => {
    if (result.isConfirmed) {
       
    containerModal.style.display = 'none'; 
    consultar();
      
      swalWithBootstrapButtons.fire({
        title: "Deletado!",
        text: "Arquivo deletado com êxito!",
        icon: "success"
      });
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "Arquivo não deletado.",
        icon: "error"
      });
    }
  });
  
  } catch (error) {
    
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
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor.');      
    }
  }
}

//Botões            

consultar();
btnConsultar.onclick = async ()=>{
  consultar();

};

btnIncluir.onclick = ()=>{
  containerModal.style.display = 'block';
  limpar();
  inpNome.focus();
  inpCod.disabled = true;
  inpData.disabled = true;
  inpNome.disabled = false;
  inpDesc.disabled = false;
  inpFab.disabled = false;
  inpQtda.disabled = false;
  inpPreco.disabled = false;
  inpCusto.disabled = false;

  DelModal.disabled = true;
  CadModal.disabled = false;
  AltModal.disabled = true;
  
};

FecharModal.onclick =()=>{
  containerModal.style.display = 'none'; 
};

CadModal.onclick = ()=>{
  create();
};

AltModal.onclick = ()=>{
  updatePro();
}