module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorPieza");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/consultar', controlador.consultarPiezas);

    // Registra un empleado en la DB.
    router.post('/registrar', controlador.registrarPieza);

    // Modifica un registro de tipo de pieza en la db.
    router.put('/modificar', controlador.modificarPieza);

    // Elimina un registro de empleado de la DB.
    router.delete('/eliminar', controlador.deletePieza);


    // Ruta general de usaurios.
    app.use(process.env.API_URL + "pieza", router);
};
