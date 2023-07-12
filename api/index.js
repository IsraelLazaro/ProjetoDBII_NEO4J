const express = require('express');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;
const eventRouter = require('./routers/eventRouters');
const userRouter = require('./routers/userRouters');
const relacaoRouter = require('./routers/relacaoRouters');
const cors = require('cors');
const { getAuth, browserLocalPersistence, setPersistence } = require("firebase/auth");
const { app: firebaseApp } = require("./dataBase/firebaseDB");
const auth = getAuth(firebaseApp);
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/eventos', eventRouter);
app.use('/usuario', userRouter);
app.use('/relacoes', relacaoRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
