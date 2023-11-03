// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const Status = db.status;
const TiposStatus = db.tipoStatus;
const Piezas = db.pieza;
const EstadosStatus = db.estadoStatus;

// Consulta los registros en la base de datos.
exports.consultarStatus = async(request, respuesta) => {
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

        if(consulta.idEstadoVinculado) {
            datos.idEstadoVinculado = consulta.idEstadoVinculado;
        }

        if(consulta.idTipoStatusVinculado) {
            datos.idTipoStatusVinculado = consulta.idTipoStatusVinculado;
        }

        if(consulta.idPiezaStatusVinculada) {
            datos.idPiezaStatusVinculada = consulta.idPiezaStatusVinculada;
        } else {
            // Si no se paso el id de la pieza.
            if(consulta.dataMatrix) {
                // Si se pasa el datamatrix en cambio.

                // Buscamos el registro que tenga el datamatrix similar.
                const pieza = await Piezas.findOne({
                    where: {
                        dataMatrix: {
                            [Op.substring]: consulta.dataMatrix
                        }
                    }
                });

                // Si existe el registro, entonces se asigna su
                // id a la consulta a la db.
                if(pieza) {
                    datos.idPiezaStatusVinculada = pieza.id;
                }
            }
        }

        // Consultamos el total de los registros.
        const totalStatus = await Status.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const statuses = await Status.findAll({
            offset: offset,
            limit: limit,
            where: datos,
            include: [
                {
                    attributes: ['id', 'descripcionTipoStatus'],
                    model: TiposStatus,
                },
                {
                    attributes: ['id', 'dataMatrix'],
                    model: Piezas,
                },
                {
                    attributes: ['id', 'nombreEstado'],
                    model: EstadosStatus,
                }
            ],
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalStatus,
            registros: statuses
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

// Realiza un registro a la base de datos.
exports.registrarStatus = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const idEstadoVinculado = cuerpo.idEstadoVinculado;
        const idTipoStatusVinculado = cuerpo.idTipoStatusVinculado;
        const idPiezaStatusVinculada = cuerpo.idPiezaStatusVinculada;

        // Validamos que exista la informacion necesaria para
        // realizar el registro del empleado.
        if(
            !idTipoStatusVinculado
            || !idPiezaStatusVinculada
            || !idEstadoVinculado
        ) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Verificamos que los datos no se encuentren ya registrados
        // en la base de datos.
        const pieza = await Piezas.findOne({
            where: {
                id: idPiezaStatusVinculada
            }
        });

        // Si se encuentra un registro.
        if(!pieza) {
            // Se manda un mensaje de registro encontrado.
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Buscamos el tipo de pieza vinculada.
        const tipoStatus = await TiposStatus.findOne({
            where: {
                id: idTipoStatusVinculado
            }
        });

        // Verificamos que exista el tipo de pieza en la base de datos.
        if(!tipoStatus) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

       // Buscamos el estado del status vinculado.
        const estadoStatus = await EstadosStatus.findOne({
            where: {
                id: idEstadoVinculado
            }
        });

        // Verificamos que exista el estado de status en la base de datos.
        if(!estadoStatus) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Instanciamos la pieza nueva.
        const statusNuevo = {
            fechaRegistroStatus: fecha,
            idEstadoVinculado: idEstadoVinculado,
            idPiezaStatusVinculada: idPiezaStatusVinculada,
            idTipoStatusVinculado: idTipoStatusVinculado
        };

        // Lo guardamos en la base de datos.
        await Status.create(statusNuevo);

        // Retornamos una respuesta, pieza guardado con exito.
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
exports.modificarStatus = async(request, respuesta) => {
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
        const idEstadoVinculado = cuerpo.idEstadoVinculado;
        const idTipoStatusVinculado = cuerpo.idTipoStatusVinculado;
        const idPiezaStatusVinculada = cuerpo.idPiezaStatusVinculada;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const status = await Status.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!status) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(idEstadoVinculado) {
            // Buscamos el registro vinculado.
            const estadoVinculado = await EstadosStatus.findOne({
                where: {
                    id: idEstadoVinculado
                }
            });

            // Si el registro vinculado no existe.
            if(!estadoVinculado) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            status.idEstadoVinculado = idEstadoVinculado;
        }

        if(idPiezaStatusVinculada) {
            // Buscamos el registro vinculado.
            const piezaVinculado = await Piezas.findOne({
                where: {
                    id: idPiezaStatusVinculada
                }
            });

            // Si el registro vinculado no existe.
            if(!piezaVinculado) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            status.idPiezaStatusVinculada = idPiezaStatusVinculada;
        }

        if(idTipoStatusVinculado) {
            // Buscamos el registro vinculado.
            const tipoStatusVinculado = await TiposStatus.findOne({
                where: {
                    id: idTipoStatusVinculado
                }
            });

            // Si el registro vinculado no existe.
            if(!tipoStatusVinculado) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            status.idTipoStatusVinculado = idTipoStatusVinculado;
        }

        // Guardamos la fecha en que se realizo el cambio.
        status.fechaActualizacionStatus = fecha;

        // Guardamos los cambios.
        await status.save();

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
exports.deleteStatus = async(request, respuesta) => {
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
        const status = await Status.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!status) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        status.destroy();

        // Retornamos la respuesta de operacion ok
        // y el registro eliminado.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registroEliminado: status
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