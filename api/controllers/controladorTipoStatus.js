// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const TiposStatus = db.tipoStatus;

// Consulta los registros en la base de datos.
exports.consultarTipoStatus = async(request, respuesta) => {
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

        if(consulta.descripcionTipoStatus) {
            datos.descripcionTipoStatus = {
                [Op.substring]: consulta.descripcionTipoStatus
            };
        }

        // Consultamos el total de los registros.
        const totalTiposStatus = await TiposStatus.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const tiposStatus = await TiposStatus.findAll({
            offset: offset,
            limit: limit,
            where: datos
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalTiposStatus,
            registros: tiposStatus
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
exports.registrarTipoStatus = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const descripcionTipoStatus = cuerpo.descripcionTipoStatus;

        // Validamos que exista la informacion necesaria para
        // realizar el registro.
        if(!descripcionTipoStatus) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Buscamos el tipo de status en la db.
        const tipoStatus = await TiposStatus.findOne({
            where: {
                descripcionTipoStatus: descripcionTipoStatus
            }
        });

        // Si ya existe un registro de estos, abortamos.
        if(tipoStatus) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_SE_ENCUENTRA_EN_DB
            })
        }

        // Instanciamos el tipo de reporte nuevo.
        const tipoStatusNuevo = {
            descripcionTipoStatus: descripcionTipoStatus,
            fechaRegistroTipoStatus: fecha
        };

        // Lo guardamos en la base de datos.
        await TiposStatus.create(tipoStatusNuevo);

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
exports.modificarTipoStatus = async(request, respuesta) => {
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
        const descripcionTipoStatus = cuerpo.descripcionTipoStatus;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const tipoStatus = await TiposStatus.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!tipoStatus) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(descripcionTipoStatus) {
            tipoStatus.descripcionTipoStatus = descripcionTipoStatus;
        }

        // Guardamos la fecha en que se realizo el cambio.
        tipoStatus.fechaActualizacionTipoStatus = fecha;

        // Guardamos los cambios.
        await tipoStatus.save();

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
exports.deleteTipoStatus = async(request, respuesta) => {
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
        const tipoStatus = await TiposStatus.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!tipoStatus) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        tipoStatus.destroy();

        // Retornamos la respuesta de operacion ok
        // y el registro eliminado.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registroEliminado: tipoStatus
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