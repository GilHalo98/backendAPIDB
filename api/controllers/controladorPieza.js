// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const Piezas = db.pieza;
const TiposPieza = db.tipoPieza;
const Zonas = db.zona;

// Consulta los registros en la base de datos.
exports.consultarPiezas = async(request, respuesta) => {
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

        if(consulta.dataMatrix) {
            datos.dataMatrix = {
                [Op.substring]: consulta.dataMatrix
            };
        }

        if(consulta.idTipoPiezaVinculada) {
            datos.idTipoPiezaVinculada = consulta.idTipoPiezaVinculada;
        }

        if(consulta.idZonaActualVinculada) {
            datos.idZonaActualVinculada = consulta.idZonaActualVinculada;
        }

        // Consultamos el total de los registros.
        const totalPiezas = await Piezas.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const piezas = await Piezas.findAll({
            offset: offset,
            limit: limit,
            where: datos,
            include: [
                {
                    attributes: ['id', 'descripcionTipoPieza'],
                    model: TiposPieza,
                },
                {
                    attributes: ['id', 'nombreZona'],
                    model: Zonas
                }
            ],
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalPiezas,
            registros: piezas
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
exports.registrarPieza = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const dataMatrix = cuerpo.dataMatrix;
        const idTipoPiezaVinculada = cuerpo.idTipoPiezaVinculada;

        // Validamos que exista la informacion necesaria para
        // realizar el registro del empleado.
        if(!dataMatrix || !idTipoPiezaVinculada) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Verificamos que los datos no se encuentren ya registrados
        // en la base de datos.
        const piezaVerificacion = await Piezas.findOne({
            where: {
                dataMatrix: dataMatrix
            }
        });

        // Si se encuentra un registro.
        if(piezaVerificacion) {
            // Se manda un mensaje de registro encontrado.
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_SE_ENCUENTRA_EN_DB
            });
        }

        // Buscamos el tipo de pieza vinculada.
        const tipoPieza = await TiposPieza.findOne({
            where: {
                id: idTipoPiezaVinculada
            }
        });

        // Verificamos que exista el tipo de pieza en la base de datos.
        if(!tipoPieza) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Instanciamos la pieza nueva.
        const piezaNueva = {
            dataMatrix: dataMatrix,
            fechaRegistroPieza: fecha,
            idTipoPiezaVinculada: idTipoPiezaVinculada
        };

        // Lo guardamos en la base de datos.
        await Piezas.create(piezaNueva);

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
exports.modificarPieza = async(request, respuesta) => {
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
        const dataMatrix = cuerpo.dataMatrix;
        const idTipoPiezaVinculada = cuerpo.idTipoPiezaVinculada;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const pieza = await Piezas.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!pieza) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(dataMatrix) {
            pieza.dataMatrix = dataMatrix;
        }

        if(idTipoPiezaVinculada) {
            // Buscamos el registro vinculado.
            const tipoPiezaVinculada = await TiposPieza.findOne({
                where: {
                    id: idTipoPiezaVinculada
                }
            });

            // Si el registro vinculado no existe.
            if(!tipoPiezaVinculada) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            pieza.idTipoPiezaVinculada = idTipoPiezaVinculada;
        }

        // Guardamos la fecha en que se realizo el cambio.
        pieza.fechaActualizacionPieza = fecha;

        // Guardamos los cambios.
        await pieza.save();

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
exports.deletePieza = async(request, respuesta) => {
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
        const pieza = await Piezas.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!pieza) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        pieza.destroy();

        // Retornamos la respuesta de operacion ok
        // y el registro eliminado.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registroEliminado: pieza
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