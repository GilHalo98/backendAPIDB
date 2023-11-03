module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorDashboard");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/seguimiento/piezas', controlador.seguimientoPiezas);

    // Buscamos la linea y zona de una pieza.
    router.get('/buscar/lineaZona', controlador.buscarLineaZona);

    // Ruta general de Lineas.
    app.use(process.env.API_URL + "dashboard", router);
};
