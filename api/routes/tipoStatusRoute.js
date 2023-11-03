module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorTipoStatus");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/consultar', controlador.consultarTipoStatus);

    // Registra un tipo de pieza en la DB.
    router.post('/registrar', controlador.registrarTipoStatus);

    // Modifica un registro de tipo de pieza en la db.
    router.put('/modificar', controlador.modificarTipoStatus);

    // Elimina un registro de empleado de la DB.
    router.delete('/eliminar', controlador.deleteTipoStatus);

    // Ruta general de usaurios.
    app.use(process.env.API_URL + "tipoStatus", router);
};