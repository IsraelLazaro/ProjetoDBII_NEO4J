const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } = require("firebase/auth");
const { app } = require("../dataBase/firebaseDB");
const auth = getAuth(app);

let authToken = null;

const setTokenToServer = (token) => {
  authToken = token;
};

const getTokenFromServer = () => {
  return authToken;
};

// Função para realizar o logout do usuário
const logoutUser = () => {
  authToken = null;
};

// Observador de autenticação para atualizar o token
onAuthStateChanged(auth, (user) => {
  if (user) {
    user.getIdToken().then((token) => {
      setTokenToServer(token);
      // Execute outras ações necessárias
    });
  } else {
    authToken = null;
  }
});

const registrarUsuario = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    console.log('Usuário criado com sucesso', user);
    res.status(200).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o usuário' });
  }
};

const fazerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Usuário autenticado com sucesso', user);
    const token = await user.getIdToken();
    setTokenToServer(token); // Armazena o token no servidor
    res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Falha na autenticação' });
  }
};

module.exports = { registrarUsuario, fazerLogin, logoutUser, getTokenFromServer };
