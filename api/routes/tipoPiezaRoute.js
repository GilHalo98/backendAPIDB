module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorTipoPieza");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/consultar', controlador.consultarTipoPieza);

    // Registra un tipo de pieza en la DB.
    router.post('/registrar', controlador.registrarTipoPieza);

    // Modifica un registro de tipo de pieza en la db.
    router.put('/modificar', controlador.modificarTipoPieza);

    // Elimina un registro de empleado de la DB.
    router.delete('/eliminar', controlador.deleteTipoPieza);

    // Ruta general de usaurios.
    app.use(process.env.API_URL + "tipoPieza", router);
};
