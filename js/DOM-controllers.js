
const callRegisterEvent = document.getElementById('callTelaCad');
const callTelaInicio = document.getElementById('back');

const secInicioEvent = document.getElementById('secInicio');
const secTelaCadastro = document.getElementById('secCadastro');

callRegisterEvent.addEventListener('click', ()=>{
    secInicioEvent.style.display="none";
    secTelaCadastro.style.display="block";
});
callTelaInicio.addEventListener('click', ()=>{
    secInicioEvent.style.display="block";
    secTelaCadastro.style.display="none";
});


function exibirAlerta(text) {
    var alerta = document.getElementById('alerta');
    var alertaMessage = document.getElementById('alertaMessage');
    var alertaButton = document.getElementById('alertaButton');

    alertaMessage.textContent = text;
    
    alerta.style.display = 'block';

    alertaButton.onclick = function() {
        alerta.style.display = 'none';
    }
};
window.exibirAlerta=exibirAlerta;

function carregar() {
    var overlay = document.getElementById('overlay');

    overlay.style.display = 'block';

    setTimeout(function() {
        overlay.style.display = 'none';
    }, 2000); 
};
window.carregar=carregar;