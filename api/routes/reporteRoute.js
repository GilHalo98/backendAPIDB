module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorReporte");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/consultar', controlador.consultarReportes);

    // Registra un empleado en la DB.
    router.post('/registrar', controlador.registrarReporte);

    // Modifica un registro de tipo de pieza en la db.
    router.put('/modificar', controlador.modificarReporte);

    // Elimina un registro de empleado de la DB.
    router.delete('/eliminar', controlador.deleteReporte);


    // Ruta general de usaurios.
    app.use(process.env.API_URL + "reporte", router);
};
