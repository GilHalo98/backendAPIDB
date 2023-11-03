// Librerias de terceros
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const http = require('http');
var multer = require('multer');

// Para poder procesar form-data.
var upload = multer();

// Importa el ambiente en el que se trabaja.
require("dotenv").config();

// Variables del entorno.
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Instancia una app.
let app = express();

// Se configuran los request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());

// Se configura el frontend para recivir datos del backend.
app.use(cors({origin: "*"}));

// Aqui se agregan las rutas generales.
require("./routes/piezaRoute")(app);
require("./routes/tipoPiezaRoute")(app);
require("./routes/tipoReporteRoute")(app);
require("./routes/tipoStatusRoute")(app);
require("./routes/lineaRoute")(app);
require("./routes/zonaRoute")(app);
require("./routes/statusRoute")(app);
require("./routes/reporteRoute")(app);
require("./routes/PLCRoute")(app);
require ("./routes/estadoStatusRoute")(app);
require ("./routes/dashboardRoute")(app);

// Instancia un objeto servidor.
const server = http.createServer(app);

// Escuchamos sobre una IP y Puerto definido e instanciamos el servidor.
server.listen(PORT, HOST, (error) => {
    if (error) return console.log(`---| Cannot listen on Port: ${PORT}`);
    console.log(`---| Server is listening on: http://${HOST}:${PORT}/`);
});