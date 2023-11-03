module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorPLC");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Registra las lineas y zonas de las lineas
    router.post('/registrar/lineasZonas', controlador.registrarLineaZona);

    router.post('/iniciar/tracking', controlador.iniciarTracking);

    router.post('/actualizar/tracking', controlador.actualizarTracking);

    router.post('/terminar/tracking', controlador.terminarTracking);

    router.post('/generar/reporte', controlador.generarReporte);

    // Ruta general de usaurios.
    app.use(process.env.API_URL + "plc", router);
};
