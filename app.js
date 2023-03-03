require('dotenv').config();

//1. importamos el modelo
const Server = require('./models/server');

//2. instanciamos el servidor o la clase
const server = new Server();

//3. Pongo a escuchar el servidor
server.listen();
