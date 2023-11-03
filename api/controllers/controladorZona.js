// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const Zonas = db.zona;
const Lineas = db.linea;

// Consulta los registros en la base de datos.
exports.consultarZona = async(request, respuesta) => {
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

        if(consulta.nombreZona) {
            datos.nombreZona = {
                [Op.substring]: consulta.nombreZona
            };
        }

        if(consulta.idLineaVinculada) {
            datos.idLineaVinculada = consulta.idLineaVinculada;
        }

        // Consultamos el total de los registros.
        const totalzonas = await Zonas.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const zonas = await Zonas.findAll({
            offset: offset,
            limit: limit,
            where: datos,
            include: [{
                attributes: ['id', 'nombreLinea'],
                model: Lineas,
            }],
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalzonas,
            registros: zonas
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

// Realiza un registro en la base de datos.
exports.registrarZona = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const nombreZona = cuerpo.nombreZona;
        const descripcionZona = cuerpo.descripcionZona;
        const idLineaVinculada = cuerpo.idLineaVinculada;

        // Validamos que exista la informacion necesaria para
        // realizar el registro del empleado.
        if(!nombreZona || !descripcionZona || !idLineaVinculada) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Buscamos que no exista otra linea con el mismo nombre.
        const zona = await Zonas.findOne({
            where: {
                nombreZona: nombreZona
            }
        });

        // Si existe un registro con el mismo nombre
        // abortamos el registro.
        if(zona) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_SE_ENCUENTRA_EN_DB
            });
        }

        // Verificamos la existencia de los registros vinculados.
        const lineaVinculada = await Lineas.findOne({
            where: {
                id: idLineaVinculada
            }
        });

        // Si el registro vinculado no existe.
        if(!lineaVinculada) {
            // Retorna un mensaje de error.
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Instanciamos el nuevo registro.
        const zonaNueva = {
            nombreZona: nombreZona,
            descripcionZona: descripcionZona,
            idLineaVinculada: idLineaVinculada,
            fechaRegistroZona: fecha,
        };

        // Lo guardamos en la base de datos.
        await Zonas.create(zonaNueva);

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
exports.modificarZona = async(request, respuesta) => {
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
        const nombreZona = cuerpo.nombreZona;
        const descripcionZona = cuerpo.descripcionZona;
        const idLineaVinculada = cuerpo.idLineaVinculada;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const zona = await Zonas.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!zona) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(nombreZona) {
            zona.nombreZona = nombreZona;
        }

        if(descripcionZona) {
            zona.descripcionZona = descripcionZona;
        }

        if(idLineaVinculada) {
            // Buscamos el registro vinculado.
            const lineaVinculada = await Lineas.findOne({
                where: {
                    id: idLineaVinculada
                }
            });

            // Si el registro vinculado no existe.
            if(!lineaVinculada) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            zona.idLineaVinculada = idLineaVinculada;
        }

        // Guardamos la fecha en que se realizo el cambio.
        zona.fechaActualizacionZona = fecha;

        // Guardamos los cambios.
        await zona.save();

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
exports.deleteZona = async(request, respuesta) => {
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
        const zona = await Zoans.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!zona) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        zona.destroy();

        // Retornamos la respuesta de operacion ok
        // y el registro eliminado.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registroEliminado: zona
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