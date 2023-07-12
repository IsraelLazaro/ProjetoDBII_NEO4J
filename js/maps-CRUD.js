var map;
let marker;
let markers = [];
let center = { lat: -6.892021526686363, lng: -38.55870364759306 };
const urlApiEvent = 'http://localhost:3000/eventos';
const divEventos = document.querySelector('#listaDeEventos');
/* VARIÁVEIS */
const telaRegisterEdit = document.getElementById('telaCadastro');
const telaEventsMap = document.getElementById('telaEventos');
const textBusca = document.getElementById('busca');
const divFixed = document.querySelector('.section-fixed');

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });
};
initMap();
todosOsEventos();
async function todosOsEventos() {
  const conect = await fetch(urlApiEvent);
  const eventos = await conect.json();
  mostrarEventos(eventos);
  mostrarEventosSugeridos(eventos);
};
async function mostrarEventos(eventos) {
  for (const evento of eventos) {
    const id = evento._id;
    const autor = evento.author;
    const nome = evento.eventName;
    const descricao = evento.eventDescription;
    const dataInicio = formatarData(evento.dataInicio);
    const dataTermino = formatarData(evento.dataTermino);
    const latiMostra = evento.lat;
    const longMostra = evento.lng;
    addMarker(nome, descricao, latiMostra, longMostra);
    try {
      const subscribeResult = await verificarSubscribeEvent(id);
      const likeResult = await verificarLikeEvent(id);
      const existeRelacionamentoLike = await verificarRelacaoLike(id);
      const existeRelacionamentoSub = await verificarRelacaoSub(id);
      const novoEvento = `
        <div class="containerEvento">
          <div class="nomeEvento"><h4 class="panel-title" style="padding: 2%;">${nome}</h4></div>
          <div class="descricaoMostra"><p>${descricao}</p></div>
          <div class="dataMostra"><b><p>DATA: ${dataInicio}</p><p>DATA: ${dataTermino}</p></div>
          <div class="buttonInteration">
            <button class="buttonInterationEvent ${existeRelacionamentoLike ? 'liked' : ''}" id="likeEvent" onclick="interacaolike(event, '${id}')"><img classe="imgBtn" src="../img/gostar1.png" alt=""></button>
            <button class="buttonInterationEvent ${existeRelacionamentoSub ? 'liked' : ''}" id="subEvent" onclick="interacaoSubscribe(event,'${id}')"><img classe="imgBtn" src="../img/inscrever-se.png" alt=""></button>
            <button class="buttonInterationEvent" onclick="editarEvento('${id}','${autor}','${nome}',' ${descricao}',' ${dataInicio}',' ${dataTermino}',' ${latiMostra}',' ${longMostra}')"><img classe="imgBtn" src="../img/editar.png" alt=""></button>
            <button class="buttonInterationEvent" onclick="centralizarMarker(' ${latiMostra}',' ${longMostra}')"><img classe="imgBtn" src="../img/pesquisa.png" alt=""></button>
      
              <div class="likeSub">
                <table>
                <tr>
                <td><label for="participaram" ><img src="../img/inscrever-se.png" alt=""s></label></td>
                <td classe="imgLabel"><input type="text" class="totalSub" id="totalParticiparam" value="${subscribeResult}" disabled></td>
              </tr>
              <tr>
                <td><label for="gostaram" ><img src="../img/gostar1.png" alt=""></label></td>
                <td classe="imgLabel"><input type="text" class="totalSub" id="totalGostaram" value="${likeResult}" disabled></td>
              </tr>
                </table>
              </div>
          </div>
        </div>`;

      divEventos.innerHTML += novoEvento;
    } catch (error) {
      console.error(error);
    }
  }
};
function editarEvento(id, autor, nome, descricao, dataIn, dataTer, latiED, longED) {
  
  let dataInicio = new Date(stringParaData(dataIn));
  let dataTermino = new Date(stringParaData(dataTer));
  const validarAutor = prompt('Ensira o nome do autor do cadastro');
  if (validarAutor === autor) {
    divFixed.style.display='none';
    limparMarcadores();
    editMarker(nome, descricao, latiED, longED);
    ativarMarcadores();
    telaRegisterEdit.style.display = 'block';
    telaEventsMap.style.display = 'none';
    document.querySelector('#eventName').value = nome;
    document.querySelector('#dataInicio').valueAsDate = dataInicio;
    document.querySelector('#dataTermino').valueAsDate = dataTermino;
    document.querySelector('#eventDescription').value = descricao;
    const btnAtualizar = document.querySelector('#btnAtualizar');
    btnAtualizar.addEventListener('click', () => {
      let latitude = marker.getPosition().lat();
      let longitude = marker.getPosition().lng();
      const eventoAtualizado = {
        author: autor,
        eventName: document.querySelector('#eventName').value,
        eventDescription: document.querySelector('#eventDescription').value,
        dataInicio: document.querySelector('#dataInicio').value,
        dataTermino: document.querySelector('#dataTermino').value,
        lat: latitude,
        lng: longitude
      };
      if (validarCampos(eventoAtualizado)) {
        atualizarInfoEvento(eventoAtualizado, id);
      } else {
        exibirAlerta('Preencha os campos obrigatórios!!')
      }

    });
    const btnDeletar = document.querySelector('#deletar');
    btnDeletar.addEventListener('click', () => {
      deletarEvento(nome, id);
    });
  };
};
window.editarEvento = editarEvento;
async function atualizarInfoEvento(obj, id) {
  try {
    const response = await fetch(`${urlApiEvent}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(obj)
    });
    console.log(response);
    if (response.ok) {
      exibirAlerta('Evento atualizado com sucesso!!');
      limparMarcadores();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      exibirAlerta('Erro ao atualizar evento!!');
    };
  } catch (error) {
    console.log(error);
    exibirAlerta('Ocorreu um erro ao atualizar o evento.');
  };
};
async function deletarEvento(nome, id) {
  if (confirm(`Deseja realmente excluir o evento ${nome}?`)) {
    try {
      const response = await fetch(`${urlApiEvent}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        exibirAlerta(`O evento ${nome} foi deletado com sucesso!!`)
        limparMarcadores();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        exibirAlerta('Erro ao deletar evento!!');
      }
    } catch (erro) {
      exibirAlerta('Ocorreu um erro ao deletar o evento.');
      console.log(erro);
    };
  } else {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };
};
/* MARKERS */
function limparMarcadores() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
};
function ativarMarcadores() {
  map.addListener('click', (event) => {
    addMarker(event);
  });
  function addMarker(event) {

    marker.setPosition(event.latLng);
    const imput = document.getElementById("eventCoordinates");
    imput.value = event.latLng;
    marker.setDraggable(true);
  };
};
function editMarker(nome, descricao, lati, long) {
  addMarker(nome, descricao,parseFloat(lati), parseFloat(long));
  const posicao={
    lat : parseFloat(lati),
    lng : parseFloat(long)
  }
  map.setCenter(posicao);
  ativarMarcadores();
};
async function addMarker(nome, descricao, lati, long) {
 const marker = new google.maps.Marker({
    position: {
      lat: lati,
      lng: long
    },
    map: map,
    title: `<h4 style="border-bottom-style:groove;">${nome}</h4><p>${descricao}</p>`,
  });

  marker.setAnimation(google.maps.Animation.BOUNCE);
  const contentString=
  `<div><h1>${nome}</h1></div><br><div><p>${descricao}</p></div>`;
    const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: `${nome}`,
  });
  marker.addListener('click', () => {
    infowindow.open(map, marker);
    map.addListener('click', function () {
      infowindow.close();
    });
  });
  markers.push(marker);
};

function centralizarMarker(lati, long) {
  var posicao = new google.maps.LatLng(parseFloat(lati), parseFloat(long));
  map.setCenter(posicao);
  map.setZoom(16);
};
window.centralizarMarker = centralizarMarker
/* FORMATAçAO DE DATA */
function formatarData(dataAntiga) {
  const data = new Date(dataAntiga);
  const dia = data.getUTCDate();
  const mes = data.getUTCMonth() + 1;
  const ano = data.getUTCFullYear();
  const dataFormatada = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${ano}`;
  return dataFormatada;
};
function stringParaData(data) {
  const [day, month, year] = data.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date
};
function transfCoodenadasEmNumeros(coordenadas) {
  coordenadas = coordenadas.slice(1, -1);
  var numeros = coordenadas.split(',');
  var latCod = parseFloat(numeros[0].trim());
  var lngCod = parseFloat(numeros[1].trim());
  return [latCod, lngCod];
};
/* OUTRAS FUNÇÕES */
function validarCampos(obj) {
  const aux = document.querySelector('#eventCoordinates').value;
  if (obj.eventName === "" || obj.eventDescription === "" || obj.dataInicio === "" || aux === "") {
    return false;
  } else {
    return true;
  }
};
textBusca.addEventListener('input', (event) => {
  const textoDigitado = event.target.value;
  buscar(textoDigitado);
});
function buscar(texto) {
  divEventos.innerHTML = "";
  buscarEvento(texto);
};
async function buscarEvento(texto) {
  try {
    const response = await fetch(`${urlApiEvent}/${texto}`);
    if (response.ok) {
      const eventos = await response.json();
      limparMarcadores();
      mostrarEventos(eventos);
    } else {
      console.log('Erro ao buscar eventos:', response.status);
    };
  } catch (error) {
    console.log('Ocorreu um erro na busca:', error);
  };
};
