// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const Lineas = db.linea;

// Consulta los registros en la base de datos.
exports.consultarLinea = async(request, respuesta) => {
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

        if(consulta.nombreLinea) {
            datos.nombreLinea = {
                [Op.substring]: consulta.nombreLinea
            };
        }

        // Consultamos el total de los registros.
        const totalLineas = await Lineas.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const lineas = await Lineas.findAll({
            offset: offset,
            limit: limit,
            where: datos
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalLineas,
            registros: lineas
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

// Registra una linea en la base de datos.
exports.registrarLinea = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const nombreLinea = cuerpo.nombreLinea;
        const descripcionLinea = cuerpo.descripcionLinea;

        // Validamos que exista la informacion necesaria para
        // realizar el registro del empleado.
        if(!nombreLinea || !descripcionLinea) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Buscamos que no exista otra linea con el mismo nombre.
        const linea = await Lineas.findOne({
            where: {
                nombreLinea: nombreLinea
            }
        });

        // Si existe una linea con el mismo nombre
        // abortamos el registro.
        if(linea) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_SE_ENCUENTRA_EN_DB
            });
        }

        // Instanciamos el nuevo registro.
        const lineaNueva = {
            nombreLinea: nombreLinea,
            descripcionLinea: descripcionLinea,
            fechaRegistroLinea: fecha,
        };

        // Lo guardamos en la base de datos.
        await Lineas.create(lineaNueva);

        // Retornamos una respuesta, registro guardado con exito.
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

// Modifica un registro de la base de datos.
exports.modificarLinea = async(request, respuesta) => {
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
        const nombreLinea = cuerpo.nombreLinea;
        const descripcionLinea = cuerpo.descripcionLinea;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const linea = await Lineas.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!linea) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(nombreLinea) {
            linea.nombreLinea = nombreLinea;
        }

        if(descripcionLinea) {
            linea.descripcionLinea = descripcionLinea;
        }

        // Guardamos la fecha en que se realizo el cambio.
        linea.fechaActualizacionLinea = fecha;

        // Guardamos los cambios.
        await linea.save();

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

// Elimina un registro de la base de datos dado un id.
exports.deleteLinea = async(request, respuesta) => {
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
        const linea = await Lineas.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!linea) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        linea.destroy();

        // Retornamos la respuesta de operacion ok
        // y el registro eliminado.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registroEliminado: linea
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