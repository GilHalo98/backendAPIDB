module.exports = (app) => {
    // Controlador del endpoint.
    const controlador = require("../controllers/controladorLinea");

    // Se importan las variables del ambiente.
    require("dotenv").config();

    // Enrutador de funciones.
    var router = require("express").Router();

    // Consulta los registros de la DB.
    router.get('/consultar', controlador.consultarLinea);

    // Guarda un registro en la DB.
    router.post('/registrar', controlador.registrarLinea);

    // Modifica un registro en la db.
    router.put('/modificar', controlador.modificarLinea);

    // Elimina un registro de la DB.
    router.delete('/eliminar', controlador.deleteLinea);

    // Ruta general de Lineas.
    app.use(process.env.API_URL + "linea", router);
};
