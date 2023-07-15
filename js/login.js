const firebaseConfig = {

};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('logado-form');
const recoverForm = document.getElementById('recover-form');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const btnLogin = document.getElementById('button-login');
const recoverSenha = document.getElementById('esqueceuSenha');
const callRegister = document.getElementById('linkCadastro');

const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const ConfirmRegisterPassword = document.getElementById('register-password-confirm');
const btnRegister = document.getElementById('button-register');
const callLogin = document.getElementById('linkLogin');
const linkCallLoginRecover = document.getElementById('linkLogin-recover');

const recoverEmail = document.getElementById('email-recover');
const btnRecover = document.getElementById('button-recover');
const callLoginRecover = document.getElementById("linkLogin-recover");

const userProfile = document.getElementById('user-profile');
const btnLogout = document.getElementById('logout-button');

const userCircle = document.querySelector('.user-circle');
const iconUser = document.querySelector('.icon-user');
let menuExpand = false;


auth.onAuthStateChanged((user) => {
    if(user){   
        localStorage.setItem("uid", user.uid)  ;   
    }else{
        localStorage.setItem("uid", "");
    }
});

userCircle.addEventListener('click', ()=>{
    iconUser.classList.toggle('expand');
    menuExpand= iconUser.classList.contains('expand');
    if (menuExpand) {
        auth.onAuthStateChanged((user) => {
            
            if (user) {
                if(menuExpand){
                    showProfile(user);
                }        
            } else {
                if(menuExpand){
                    showLogin();
                }                
            }
        });
    } else {
        closeForms();
    }
});
// FUNÇÃO PARA FAZER LOGIN
btnLogin.addEventListener('click', (event)=>{
    event.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value; 
    carregar();
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        showProfile(userCredential.user);
    }).catch((error)=>{
        exibirAlerta('Erro ao fazer o login. Verifique suas credenciais e tente novamente.');
        console.error(error);
        });
        loginEmail.value = '';
        loginPassword.value = '';
});
linkCallLoginRecover.addEventListener('click', ()=>{
    showLogin();
});
// FUNÇÃO PARA FAZER RESGISTRO
btnRegister.addEventListener('click', (event)=>{
    event.preventDefault();
    const name = registerName.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    const confirmPassword = ConfirmRegisterPassword.value;

    if(validarUsuario(email, password, confirmPassword)){
        carregar();
        auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
            showProfile(userCredential.user);
            userCredential.user.updateProfile({
            displayName: name
            });
            
        }).catch((error) => {
            exibirAlerta('Erro ao registrar. Verifique seus dados e tente novamente.');
            console.error(error);
            });
            registerName.value = '';
            registerEmail.value = '';
            registerPassword.value = '';
    }
    
});
// FUNÇÃO PARA FAZER LOGOUT
btnLogout.addEventListener('click', ()=>{
    auth.signOut().then(()=>{
        showLogin();
    }).catch((error) => {
        exibirAlerta('Erro ao sair. Tente novamente.');
        console.error(error);
    });
});
// FUNÇÃO RECUPERAR SENHA
btnRecover.addEventListener('click', (event)=>{
    event.preventDefault();
    const email = recoverEmail.value;
    sendPasswordResetEmail(auth, email).then(() => {
        console.log("Email enviado!")
    }).catch((error) => {
        console.logo(error);
    });   
});
callRegister.addEventListener('click', ()=>{
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});
callLogin.addEventListener('click', ()=>{
    showLogin();
});
recoverSenha.addEventListener('click', ()=>{
    loginForm.style.display = 'none';
    recoverForm.style.display = 'block';
});

function showProfile(user) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    profileForm.style.display = 'block';
    recoverForm.style.display = 'none';
    const profile = 
    `<h2>Olá, ${user.displayName}</h2>
    <p><strong>E-mail:</strong>${user.email}<p    
    `

    userProfile.innerHTML = profile;
    // 
};
function showLogin() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    profileForm.style.display = 'none';
    recoverForm.style.display = 'none';
};
window.showLogin=showLogin;
function closeForms(){
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    profileForm.style.display = 'none';
    recoverForm.style.display = 'none';
};

function validarUsuario(email, senha, confirmarSenha) {
    if (!validarEmail(email)) {
        exibirAlerta('Email inválido');
        return false;
    }
    if (!validarSenha(senha)) {
        exibirAlerta('Senha inválida');
        return false;
    }
    if (senha !== confirmarSenha) {
        exibirAlerta('As senhas não coincidem');
        return false;
    }
    return true;
};
function validarEmail(email) {
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexEmail.test(email);
};
function validarSenha(senha) {
    return senha.length >= 6;
};
