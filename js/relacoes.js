const urlApiRelacao = 'http://localhost:3000/relacoes';
let uidUser = localStorage.getItem("uid");
const divSugestoes = document.getElementById('eventos-sugeridos')

window.interacaolike=interacaolike;
function interacaolike(event, idE) {
    var button = event.target;
    if (button.classList.contains('liked')) {
      dislikeEvent(idE, uidUser);
      button.classList.remove('liked');
    } else {
      likeEvent(idE, uidUser);
      button.classList.add('liked');
    }
};
window.interacaoSubscribe=interacaoSubscribe;
function interacaoSubscribe(event, idE){
  var button = event.target;
  if (button.classList.contains('liked')) {
    removerSubscribeEvent(idE, uidUser);
    button.classList.remove('liked');
  } else {
    subscribeEvent(idE, uidUser);
    button.classList.add('liked');
  }
};
async function likeEvent(idEvnt, idUser){
  const relacao = {
    "usuarioId": idUser,
    "eventoId": idEvnt
  }
  try{
    const response = await fetch(`${urlApiRelacao}/gostou`, {
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(relacao)
    });
    if(response.ok){
      exibirAlerta(`Você gostou do evento!`);
    }else{
      exibirAlerta("ERRO")
    }
    }catch(error){
      console.log(error)}
};
async function dislikeEvent(idEvnt, idUser) {
  const relacao = {
    usuarioId: idUser,
    eventoId: idEvnt
  };

  try {
    const response = await fetch(`${urlApiRelacao}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(relacao)
    });

    if (response.ok) {
      exibirAlerta('Você não gostou do evento!');
    } else {
      const errorText = await response.text();
      exibirAlerta(`Erro: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Ocorreu um erro na solicitação:', error);
    exibirAlerta('Ocorreu um erro na solicitação. Por favor, tente novamente.');
  }
};
async function subscribeEvent(idEvnt, idUser){
  const relacao = {
    "usuarioId": idUser,
    "eventoId": idEvnt
  }
  try{
    const response = await fetch(`${urlApiRelacao}/subscribe`, {
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(relacao)
    });
    if(response.ok){
      exibirAlerta(`Você Se inscreveu do evento!`);
    }else{
      exibirAlerta("ERRO")
    }
    }catch(error){
      console.log(error)}
};
async function removerSubscribeEvent(idEvnt, idUser) {
  const relacao = {
    usuarioId: idUser,
    eventoId: idEvnt
  };

  try {
    const response = await fetch(`${urlApiRelacao}/remove/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(relacao)
    });

    if (response.ok) {
      exibirAlerta('Você removeu sua inscrição do evento!');
    } else {
      const errorText = await response.text();
      exibirAlerta(`Erro: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Ocorreu um erro na solicitação:', error);
    exibirAlerta('Ocorreu um erro na solicitação. Por favor, tente novamente.');
  }
};
async function verificarSubscribeEvent(idEvnt) {
  try {
    const response = await fetch(`${urlApiRelacao}/event/participaram/${idEvnt}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      const total = data.total;
      return total;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
};
window.verificarSubscribeEvent=verificarSubscribeEvent;
async function verificarLikeEvent(idEvnt) {
  try {
    const response = await fetch(`${urlApiRelacao}/event/gostaram/${idEvnt}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      const total = data.total;
      return total;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
};
window.verificarLikeEvent=verificarLikeEvent;
async function verificarRelacaoLike(idEvent) {
  const relacao = {
    usuarioId: uidUser,
    eventoId: idEvent
  };
  try {
    const response = await fetch(`${urlApiRelacao}/check/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(relacao)
    });
    console.log(response.ok)
    if (response.ok) {
      const data = await response.json();
      const existeRelacionamento = data.existeRelacionamento;
      return existeRelacionamento;
    } else {
      console.error('Erro ao verificar o relacionamento "GOSTOU"');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};
window.verificarRelacaoLike=verificarRelacaoLike;
async function verificarRelacaoSub(idEvent){
  const relacao = {
    usuarioId: uidUser,
    eventoId: idEvent
  };
  try {
    const response = await fetch(`${urlApiRelacao}/check/sub`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(relacao)
    });

    if (response.ok) {
      const data = await response.json();
      const existeRelacionamento = data.existeRelacionamento;
      return existeRelacionamento;
    } else {
      console.error('Erro ao verificar o relacionamento "Inscritos"');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
window.verificarRelacaoSub=verificarRelacaoSub;
async function mostrarEventosSugeridos(eventos) {
  // const divPrimeiroEvento = document.getElementById('melhorEvent');
  // const divSegundoEvento = document.getElementById('SecMelhorEvent');
  const pontuacoes = [];
  for (const evento of eventos) {
    const id = evento._id;
    try {
      const subscribeResult = await verificarSubscribeEvent(id);
      const likeResult = await verificarLikeEvent(id);
      const existeRelacionamentoLike = await verificarRelacaoLike(id);
      const existeRelacionamentoSub = await verificarRelacaoSub(id);

      const pontuacao = (likeResult * 6 + subscribeResult * 4) / 10;
      pontuacoes.push({ evento, pontuacao, existeRelacionamentoLike, existeRelacionamentoSub, subscribeResult, likeResult });
    } catch (error) {
      console.error(error);
    }
  }

  pontuacoes.sort((a, b) => b.pontuacao - a.pontuacao);

  divSugestoes.innerHTML = ""; // Limpa o conteúdo atual da divSugestoes antes de exibir os novos eventos

  for (let i = 0; i < Math.min(2, pontuacoes.length); i++) {
    const { evento, existeRelacionamentoLike, existeRelacionamentoSub, subscribeResult, likeResult } = pontuacoes[i];
    const id = evento._id;
    const autor = evento.author;
    const nome = evento.eventName;
    const descricao = evento.eventDescription;
    const dataInicio = formatarData(evento.dataInicio);
    const dataTermino = formatarData(evento.dataTermino);
    const latiMostra = evento.lat;
    const longMostra = evento.lng;

    const novoEvento = `
      <div class="containerEvento">
        <div class="nomeEvento"><h4 class="panel-title" style="padding: 2%;">${nome}</h4></div>
        <div class="descricaoMostra"><p>${descricao}</p></div>
        <div class="dataMostra">
          <p>DATA: ${dataInicio}</p>
          <p>DATA: ${dataTermino}</p>
        </div>
        <div class="buttonInterationSugest">
          <div class="btnSugest">
            <button class="buttonInterationEvent ${existeRelacionamentoLike ? 'liked' : ''}" id="likeEvent" onclick="interacaolike(event, '${id}')"><img classe="imgBtn" src="../img/gostar1.png" alt=""></button>
            <button class="buttonInterationEvent ${existeRelacionamentoSub ? 'liked' : ''}" id="subEvent" onclick="interacaoSubscribe(event,'${id}')"><img classe="imgBtn" src="../img/inscrever-se.png" alt=""></button>
            <button class="buttonInterationEvent" onclick="editarEvento('${id}','${autor}','${nome}',' ${descricao}',' ${dataInicio}',' ${dataTermino}',' ${latiMostra}',' ${longMostra}')"><img classe="imgBtn" src="../img/editar.png" alt=""></button>
            <button class="buttonInterationEvent" onclick="centralizarMarker(' ${latiMostra}',' ${longMostra}')"><img classe="imgBtn" src="../img/pesquisa.png" alt=""></button>
          </div>
          <div class="likeSubSugest">
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

    divSugestoes.innerHTML += novoEvento;
  }
};
window.mostrarEventosSugeridos=mostrarEventosSugeridos;
/* OUTRAS FUNÇÕES */
function formatarData(dataAntiga) {
  const data = new Date(dataAntiga);
  const dia = data.getUTCDate();
  const mes = data.getUTCMonth() + 1;
  const ano = data.getUTCFullYear();
  const dataFormatada = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${ano}`;
  return dataFormatada;
};