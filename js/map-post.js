let map;
let marker;
const urlApi = 'http://localhost:3000/eventos';
let center = {lat:-6.892021526686363, lng:-38.55870364759306};
const btnCadastro = document.getElementById('btnSalvar');
/* INSTANCIANADO O MAPA NA PÁGINA */
async function initMap() {
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        center: center,
        zoom: 15,    
    });
    /* BLOCO - ADICIONANDO BOTÃO DE MUDAR O TIPO DE MAPA  */
    // Criando o contêiner para os botões    
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    // Criando o botão para o modo Satélite
    const btnSatelite = document.createElement("button");
    btnSatelite.textContent = "Satélite";
    btnSatelite.classList.add("btnMapModo");
    // Criando o botão para o modo Padrão
    const btnPadrao = document.createElement("button");
    btnPadrao.textContent = "Padrão";
    btnPadrao.classList.add("btnMapModo");
    // Adicionando os botões ao contêiner
    btnContainer.appendChild(btnSatelite);
    btnContainer.appendChild(btnPadrao);
    // Posicionando o contêiner com os botões no canto superior esquerdo do mapa
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(btnContainer);
    // Adicionando um evento de clique ao botão de Satélite
    btnSatelite.addEventListener("click", function () {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
    });
    // Adicionando um evento de clique ao botão de Padrão
    btnPadrao.addEventListener("click", function () {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    });
/* FIM DO BLOCO - ADICIONANDO BOTÃO DE MUDAR O TIPO DE MAPA  */
    marker = new google.maps.Marker({
        map: map,
        position: center,
        draggable: true,
        title: "Cajazeiras",
        animation: google.maps.Animation.BOUNCE
    });    
    map.addListener("click", (event)=>{
        addMarker(event);
    });
    function addMarker(event){
        marker.setPosition(event.latLng);
        const imput = document.getElementById("eventCoordinates");
        imput.value = event.latLng;     
    };
};
initMap();



btnCadastro.addEventListener('click', (event)=>{  
    event.preventDefault();
    let latitude = marker.getPosition().lat();
    let longitude = marker.getPosition().lng();
    const evento ={
        author:document.querySelector('#author').value,
        eventName: document.querySelector('#eventName').value,
        eventDescription: document.querySelector('#eventDescription').value,
        dataInicio: document.querySelector('#dataInicio').value,
        dataTermino: document.querySelector('#dataTermino').value,
        lat:latitude,
        lng: longitude
    };
    if(validarCampos(evento)){
        carregar();
        salvarEvento(evento);
        marker.setPosition(center);
        map.setCenter(center);        
        setTimeout(() => {
            window.location.reload();
        }, 2000);

    }else{
        exibirAlerta('Campos obrigatórios não preenchidos. Tente novamente!!');
    }
      
});

async function salvarEvento(obj){
    try {
        const response = await fetch(urlApi, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });      
        if (response.ok) {                 
                exibirAlerta('Evento salvo com sucesso!');
                limparCampos();
        } else {
            exibirAlerta('Ocorreu um erro ao salvar o evento.');
            };
    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
    };        
};

function validarCampos(obj){
    const aux = document.querySelector('#eventCoordinates').value;
    if(obj.eventName==="" || obj.eventDescription==="" || obj.dataInicio==="" || aux===""){
        return false;      
    }else{
        return true;}
}

