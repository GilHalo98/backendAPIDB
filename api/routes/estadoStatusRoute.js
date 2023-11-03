module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorEstadoStatus");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/consultar', controlador.consultarEstadoStatus);

    // Guarda un registro en la DB.
    router.post('/registrar', controlador.registrarEstadoStatus);

    // Modifica un registro en la db.
    router.put('/modificar', controlador.modificarEstadoStatus);

    // Elimina un registro de la DB.
    router.delete('/eliminar', controlador.deleteEstadoStatus);

    // Ruta general de Lineas.
    app.use(process.env.API_URL + "estadoStatus", router);
};
