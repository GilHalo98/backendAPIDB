// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const TiposReporte = db.tipoReporte;

// Consulta los registros en la base de datos.
exports.consultarTipoReporte = async(request, respuesta) => {
    // GET Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Verificamos si se selecciono un offset.
        const offset = (
            !consulta.offset ? consulta.offset : parseInt(consulta.offset)
        );

        // Verificamos si se selecciono un maximo de elementos por pagina.
        const limit = (
            !consulta.limit ? consulta.limit : parseInt(consulta.limit)
        );

        // Construimos la consulta hacia la db.
        const datos = Object();

        // Agregamos los parametros de la consulta.
        if(consulta.id) {
            datos.id = consulta.id;
        }

        if(consulta.descripcionTipoReporte) {
            datos.descripcionTipoReporte = {
                [Op.substring]: consulta.descripcionTipoReporte
            };
        }

        // Consultamos el total de los registros.
        const totalTiposReporte = await TiposReporte.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const tiposReporte = await TiposReporte.findAll({
            offset: offset,
            limit: limit,
            where: datos
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalTiposReporte,
            registros: tiposReporte
        });

    } catch(excepcion) {
        // Mostramos el error en la consola
        console.log(excepcion);

        // Retornamos un codigo de error.
        return respuesta.status(500).send({
            codigoRespuesta: CODIGOS.API_ERROR,
        });
    }
};

// Registra un tipo de reporte en la base de datos.
exports.registrarTipoReporte = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const descripcionTipoReporte = cuerpo.descripcionTipoReporte;

        // Validamos que exista la informacion necesaria para
        // realizar el registro.
        if(!descripcionTipoReporte) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Buscamos el registro en la base de datos.
        const tipoReporte = await TiposReporte.findOne({
            where: {
                descripcionTipoReporte: descripcionTipoReporte
            }
        });

        // Si ya existe el registro en la db, aborta la operación.
        if(tipoReporte) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_SE_ENCUENTRA_EN_DB
            });
        }

        // Instanciamos el tipo de reporte nuevo.
        const tipoReporteNuevo = {
            descripcionTipoReporte: descripcionTipoReporte,
            fechaRegistroTipoReporte: fecha
        };

        // Lo guardamos en la base de datos.
        await TiposReporte.create(tipoReporteNuevo);

        // Retornamos una respuesta de operacion satisfactoria.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK
        });

    } catch(excepcion) {
        // Mostramos el error en la consola
        console.log(excepcion);

        // Retornamos un codigo de error.
        return respuesta.status(500).send({
            codigoRespuesta: CODIGOS.API_ERROR,
        });
    }
};

// Modifica el registro de un tipo de reporte en la base de datos.
exports.modificarTipoReporte = async(request, respuesta) => {
    // PUT Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Instanciamos la fecha de la modificacion del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const id = cuerpo.id;
        const descripcionTipoReporte = cuerpo.descripcionTipoReporte;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const tipoReporte = await TiposReporte.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!tipoReporte) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(descripcionTipoReporte) {
            tipoReporte.descripcionTipoReporte = descripcionTipoReporte;
        }

        // Guardamos la fecha en que se realizo el cambio.
        tipoReporte.fechaActualizacionTipoReporte = fecha;

        // Guardamos los cambios.
        await tipoReporte.save();

        // Retornamos un mensaje de operacion ok.
        return respuesta.status(200).send({
            codigoRespuesta: CODIGOS.OK
        });

    } catch(excepcion) {
        // Mostramos el error en la consola
        console.log(excepcion);

        // Retornamos un codigo de error.
        return respuesta.status(500).send({
            codigoRespuesta: CODIGOS.API_ERROR,
        });
    }
};

// Elimina el registro de un tipo de reporte dado un id.
exports.deleteTipoReporte = async(request, respuesta) => {
    // DELETE Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Recuperamos los parametros del request.
        const id = consulta.id;

        // Verificamos que los datos para la operacion esten completos.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Busca el registro dado el id.
        const tipoReporte = await TiposReporte.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!tipoReporte) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        tipoReporte.destroy();

        // Retornamos la respuesta de operacion ok
        // y el registro eliminado.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registroEliminado: tipoReporte
        })

    } catch(excepcion) {
        // Mostramos el error en la consola
        console.log(excepcion);

        // Retornamos un codigo de error.
        return respuesta.status(500).send({
            codigoRespuesta: CODIGOS.API_ERROR,
        });
    }
};