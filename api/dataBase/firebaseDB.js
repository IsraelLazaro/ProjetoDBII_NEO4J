const { initializeApp } = require("firebase/app");


const firebaseConfig = {
   apiKey: "AIzaSyAkZ4zykw5sv60kHJMux_8I1aIWQRotq2w",
  authDomain: "aula-533a1.firebaseapp.com",
  projectId: "aula-533a1",
  storageBucket: "aula-533a1.appspot.com",
  messagingSenderId: "565889463530",
  appId: "1:565889463530:web:66f19468f12314624ad393",
  measurementId: "G-03XSJFX27R"
};

const app = initializeApp(firebaseConfig);

module.exports = {app};