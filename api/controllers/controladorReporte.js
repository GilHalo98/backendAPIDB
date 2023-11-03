// Modelos de la DB
const db = require("../models/index");

// Codigos de la API.
const respuestas = require("../utils/codigosAPI");

// Instanciamos los codigos.
const CODIGOS = new respuestas.CodigoApp();

// Operadores de sequelize para consultas
const { Op } = require("sequelize");

// Modelos que usara el controlador.
const Reportes = db.reporte;
const Piezas = db.pieza;
const Zonas = db.zona;
const TiposReporte = db.tipoReporte;

// Consulta los registros en la base de datos.
exports.consultarReportes = async(request, respuesta) => {
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

        if(consulta.idPiezaVinculada) {
            datos.idPiezaVinculada = consulta.idPiezaVinculada;
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
                    datos.idPiezaVinculada = pieza.id;
                }
            }
        }

        if(consulta.idZonaVinculada) {
            datos.idZonaVinculada = consulta.idZonaVinculada;
        }

        if(consulta.idTipoReporteVinculado) {
            datos.idTipoReporteVinculado = consulta.idTipoReporteVinculado;
        }

        // Consultamos el total de los registros.
        const totalReportes = await Reportes.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const reportes = await Reportes.findAll({
            offset: offset,
            limit: limit,
            where: datos,
            include: [
                {
                    attributes: ['id', 'descripcionTipoReporte'],
                    model: TiposReporte
                },
                {
                    attributes: ['id', 'dataMatrix'],
                    model: Piezas
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
            totalRegistros: totalReportes,
            registros: reportes
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
exports.registrarReporte = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos la informacion del registro.
        const descripcionReporte = cuerpo.descripcionReporte;
        const idPiezaVinculada = cuerpo.idPiezaVinculada;
        const idZonaVinculada = cuerpo.idZonaVinculada;
        const idTipoReporteVinculado = cuerpo.idTipoReporteVinculado;

        // Validamos que exista la informacion necesaria para
        // realizar el registro del empleado.
        if(
            !descripcionReporte
            || !idPiezaVinculada
            || !idZonaVinculada
            || !idTipoReporteVinculado
        ) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_REGISTRO_INCOMPLETOS,
            });
        }

        // Buscamos los registros vinculados.
        const piezaVinculada = await Piezas.findOne({
            where: {
                id: idPiezaVinculada
            }
        });

        // Verificamos que existan los registros vinculados.
        if(!piezaVinculada) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Buscamos los registros vinculados.
        const zonaVinculada = await Zonas.findOne({
            where: {
                id: idZonaVinculada
            }
        });

        // Verificamos que existan los registros vinculados.
        if(!zonaVinculada) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Buscamos los registros vinculados.
        const tipoReporteVinculado = await TiposReporte.findOne({
            where: {
                id: idTipoReporteVinculado
            }
        });

        // Verificamos que existan los registros vinculados.
        if(!tipoReporteVinculado) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Instanciamos la pieza nueva.
        const reporteNuevo = {
            descripcionReporte: descripcionReporte,
            fechaRegistroReporte: fecha,
            idPiezaVinculada: idPiezaVinculada,
            idZonaVinculada: idZonaVinculada,
            idTipoReporteVinculado: idTipoReporteVinculado
        };

        // Lo guardamos en la base de datos.
        await Reportes.create(reporteNuevo);

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
exports.modificarReporte = async(request, respuesta) => {
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
        const descripcionReporte = cuerpo.descripcionReporte;
        const idPiezaVinculada = cuerpo.idPiezaVinculada;
        const idZonaVinculada = cuerpo.idZonaVinculada;
        const idTipoReporteVinculado = cuerpo.idTipoReporteVinculado;

        // Verificamos que exista un id del registro a modificar.
        if(!id) {
            // Si no, retornamos un mensaje de error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS
            });
        }

        // Buscamos el registro.
        const reporte = await Reportes.findOne({
            where: {
                id: id
            }
        });

        // Verificamos que exista el registro.
        if(!reporte) {
            // Si no se encontro el registro, se envia un
            // codio de registro inexistente.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Guardamos los cambios de los datos del objeto.
        if(descripcionReporte) {
            reporte.descripcionReporte = descripcionReporte;
        }

        if(idPiezaVinculada) {
            // Buscamos el registro vinculado.
            const piezaVinculado = await Piezas.findOne({
                where: {
                    id: idPiezaVinculada
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
            reporte.idPiezaVinculada = idPiezaVinculada;
        }

        if(idZonaVinculada) {
            // Buscamos el registro vinculado.
            const zonaVinculada = await Zonas.findOne({
                where: {
                    id: idZonaVinculada
                }
            });

            // Si el registro vinculado no existe.
            if(!zonaVinculada) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            reporte.idZonaVinculada = idZonaVinculada;
        }

        if(idTipoReporteVinculado) {
            // Buscamos el registro vinculado.
            const tipoReporteVinculado = await TiposReporte.findOne({
                where: {
                    id: idTipoReporteVinculado
                }
            });

            // Si el registro vinculado no existe.
            if(!tipoReporteVinculado) {
                // Retorna un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Cambiamos el registro vinculado.
            reporte.idTipoReporteVinculado = idTipoReporteVinculado;
        }

        // Guardamos la fecha en que se realizo el cambio.
        reporte.fechaActualizacionReporte = fecha;

        // Guardamos los cambios.
        await reporte.save();

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
exports.deleteReporte = async(request, respuesta) => {
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
        const reporte = await Reportes.findOne({
            where: {
                id: id
            }
        });

        // Si no existe el registro con el id.
        if(!reporte) {
            // Retorna un error.
            return respuesta.status(200).send({
                codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE,
            });
        }

        // Eliminamos el registro.
        reporte.destroy();

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