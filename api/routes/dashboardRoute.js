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
    router.get('/buscar/pieza', controlador.buscarPieza);

    // Creamos un reporte de los status de las piezas.
    router.get('/reporte/status/pieza', controlador.piezasOkRechazadas);

    // Creamos un reporte de piezas procesadas por linea.
    router.get('/reporte/procesada/pieza', controlador.piezasProcesadasPorLinea);

    // Creamos un reporte de los diferentes tipos de piezas.
    router.get('/reporte/procesada/tipoPieza', controlador.conteoPiezasPorTipo);

    // Ruta general de Lineas.
    app.use(process.env.API_URL + "dashboard", router);
};
