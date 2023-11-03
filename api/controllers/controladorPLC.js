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
const Zonas = db.zona;
const Piezas = db.pieza;
const TiposPieza = db.tipoPieza;
const TiposStatus = db.tipoStatus;
const TiposReporte = db.tipoReporte;
const Statuses = db.status;
const EstadosStatus = db.estadoStatus;
const Reportes = db.reporte;

exports.registrarLineaZona = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos los datos del request.
        const lineas = cuerpo.lineas;

        // Por cada linea a registrar.
        for(let i = 0; i < lineas.length; i++) {
            // Recuperamos los datos de la linea.
            const datosLinea = lineas[i];

            // Buscamos el registro de la linea en la db.
            const linea = await Lineas.findOne({
                where: {
                    nombreLinea: datosLinea.nombreLinea
                }
            });

            // Verificamos si existe el registro.
            if(!linea) {
                // Si no existe el registro, creamos uno nuevo.
                const lineaNueva = {
                    nombreLinea: datosLinea.nombreLinea,
                    descripcionLinea: datosLinea.descripcionLinea,
                    fechaRegistroLinea: fecha
                };

                // Guardamos el registro en la db.
                await Lineas.create(lineaNueva);
            }

            // Por cada zona en la linea.
            for(let j = 0; j < datosLinea.zonas.length; j++) {
                // Recuperamos los datos de la zona
                const datosZona = datosLinea.zonas[j];

                // Buscamos el registro de la zona en la db.
                const zona = await Zonas.findOne({
                    where: {
                        nombreZona: datosZona.nombreZona
                    }
                });

                // Verificamos si existe el registro.
                if(!zona) {
                    // Buscamos el id de la zona vinculada.
                    const lineaVinculada = await Lineas.findOne({
                        attributes: ['id'],
                        where: {
                            nombreLinea: datosLinea.nombreLinea
                        }
                    });

                    // Si no se encuentra el registro, se manda
                    // un mensaje de error.
                    if(!lineaVinculada) {
                        return respuesta.status(200).json({
                            codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                        });
                    }

                    // Creamos un nuevo registro de la zona.
                    const zonaNueva = {
                        nombreZona: datosZona.nombreZona,
                        descripcionZona: datosZona.descripcionZona,
                        fechaRegistroZona: fecha,
                        idLineaVinculada: lineaVinculada.id
                    };

                    // Guardamos el registro.
                    await Zonas.create(zonaNueva);
                }
            }
        }

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

// Inicia el tracking de la pieza.
exports.iniciarTracking = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos los datos del cuerpo del request.
        const dataMatrix = cuerpo.dataMatrix;
        const tipoPieza = cuerpo.tipoPieza;
        const zonaActual = cuerpo.zonaActual;
        const status = cuerpo.status;

        // Buscamos el registro en la base de datos.
        const pieza = await Piezas.findOne({
            where: {
                dataMatrix: dataMatrix
            }
        });

        // Si existe el registro, abortamos al operacion.
        if(pieza) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_SE_ENCUENTRA_EN_DB
            });
        }

        // Buscamos si el tipo de pieza vinculado existe.
        const tipoPiezaVinculada = await TiposPieza.findOne({
            where: {
                descripcionTipoPieza: tipoPieza
            }
        });

        // Si no existe el registro.
        if(!tipoPiezaVinculada) {
            // Envia un mensaje de error.
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Buscamos si la zona vinculada existe.
        const zonaVinculada = await Zonas.findOne({
            where: {
                nombreZona: zonaActual
            }
        });

        // Si no existe el registro.
        if(!zonaVinculada) {
            // Envia un mensaje de error.
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Creamos un nuevo registro de la pieza.
        const piezaNueva = {
            dataMatrix: dataMatrix,
            fechaRegistroPieza: fecha,
            idTipoPiezaVinculada: tipoPiezaVinculada.id,
            idZonaActualVinculada: zonaVinculada.id
        };

        // Guardamos el registro en la db.
        await Piezas.create(piezaNueva);

        // Buscamos la pieza recien guardada.
        const piezaVinculada = await Piezas.findOne({
            where: {
                dataMatrix: dataMatrix
            }
        });

        // Si no se encuentra, aborta.
        if(!piezaVinculada) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Por cada status de la pieza.
        for(let j = 0; j < status.length; j++) {
            // Recuperamos los datos del status.
            const datosStatus = status[j];

            // Buscamos si el tipo de status vinculado existe.
            const tipoStatusVinculado = await TiposStatus.findOne({
                where: {
                    descripcionTipoStatus: datosStatus[0]
                }
            });

            // Si no se encuentra, aborta.
            if(!tipoStatusVinculado) {
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Buscamos el estado del status vinculado.
            const estadoStatus = await EstadosStatus.findOne({
                where: {
                    nombreEstado: datosStatus[1]
                }
            })

            // Si no se encuentra, aborta.
            if(!estadoStatus) {
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Creamos un registro nuevo.
            const statusNuevo = {
                fechaRegistroStatus: fecha,
                idEstadoVinculado: estadoStatus.id,
                idTipoStatusVinculado: tipoStatusVinculado.id,
                idPiezaStatusVinculada: piezaVinculada.id,
            };

            // Guardamos el registro del status en la db.
            await Statuses.create(statusNuevo);
        }

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

// Actualiza el tracking de las piezas.
exports.actualizarTracking = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos los datos del cuerpo.
        const piezasTracking = cuerpo.piezas;

        // Por cada pieza en el traking.
        for (let i = 0; i < piezasTracking.length; i++) {
            const datosPieza = piezasTracking[i];
            
            // Verificamos si existe un registro con los datos
            // de la pieza en la db.
            const pieza = await Piezas.findOne({
                where: {
                    dataMatrix: datosPieza.dataMatrix
                }
            });

            // Si no se encuentra el registro, aborta
            if(!pieza) {
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE
                });
            }

            // Si ya se encuentra en el registro, se actualizaran
            // los datos de este.

            // Buscamos si la zona vinculada existe.
            const zonaVinculada = await Zonas.findOne({
                attributes: ['id'],
                where: {
                    nombreZona: datosPieza.zonaActual
                }
            });

            // Si no existe el registro.
            if(!zonaVinculada) {
                // Envia un mensaje de error.
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                });
            }

            // Actualizamos los datos.
            pieza.idZonaActualVinculada = zonaVinculada.id;
            pieza.fechaActualizacionPieza = fecha;

            // Guardamos los cambios del registro.
            await pieza.save();

            // Por cada status de la pieza.
            for(let j = 0; j < datosPieza.status.length; j++) {
                // Recuperamos los datos del status.
                const datosStatus = datosPieza.status[j];

                // Buscamos si el tipo de status vinculado existe.
                const tipoStatusVinculado = await TiposStatus.findOne({
                    where: {
                        descripcionTipoStatus: datosStatus[0]
                    }
                });

                // Si no se encuentra, aborta.
                if(!tipoStatusVinculado) {
                    return respuesta.status(200).json({
                        codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                    });
                }

                // Buscamos el status.
                const status = await Statuses.findOne({
                    where: {
                        idTipoStatusVinculado: tipoStatusVinculado.id,
                        idPiezaStatusVinculada: pieza.id
                    }
                });

                // Si no se encuentra, aborta.
                if(!status) {
                    return respuesta.status(200).json({
                        codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                    });
                }

                // Buscamos el estado del status vinculado.
                const estadoStatus = await EstadosStatus.findOne({
                    where: {
                        nombreEstado: datosStatus[1]
                    }
                })

                // Si no se encuentra, aborta.
                if(!estadoStatus) {
                    return respuesta.status(200).json({
                        codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
                    });
                }

                // Cambiamos los datos del registro.
                status.idEstadoVinculado = estadoStatus.id;
                status.fechaActualizacionStatus = fecha;

                // Actualizamos los datos.
                await status.save();
            }
        }

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

// Termina el tracking de las piezas dadas.
exports.terminarTracking = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos los datos del cuerpo.
        const dataMatrixPiezas = cuerpo.dataMatrixPiezas;

        // Por cada datamatrix en la lista.
        for (let i = 0; i < dataMatrixPiezas.length; i++) {
            // Recuperamos el datamatrix.
            const dataMatrix = dataMatrixPiezas[i];

            // Buscamos el registro en la db.
            const pieza = await Piezas.findOne({
                where: {
                    dataMatrix: dataMatrix
                }
            });

            // Verificamos que el registro exista.
            if(!pieza) {
                return respuesta.status(200).json({
                    codigoRespuesta: CODIGOS.REGISTRO_NO_EXISTE
                });
            }

            // Realizamos cambios a los datos del registro.
            pieza.fechaActualizacionPieza = fecha;
            pieza.idZonaActualVinculada = null;

            // Guardamos los cambios.
            await pieza.save();
        }

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

// Genera un reporte y lo guarda en la base de datos.
exports.generarReporte = async(request, respuesta) => {
    // POST Request
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;

    try {
        // Instanciamos la fecha del registro.
        const fecha = new Date();

        // Recuperamos los datos del registro.
        const descripcionReporte = cuerpo.descripcionReporte;
        const dataMatrix = cuerpo.dataMatrix;
        const nombreZona = cuerpo.nombreZona;
        const descripcionTipoReporte = cuerpo.descripcionTipoReporte;

        // Buscamos el registro en la base de datos.
        const pieza = await Piezas.findOne({
            where: {
                dataMatrix: dataMatrix
            }
        });

        // Si no existe el registro, abortamos.
        if(!pieza) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Buscamos el registro en la base de datos.
        const zona = await Zonas.findOne({
            where: {
                nombreZona: nombreZona
            }
        });

        // Si no existe el registro, abortamos.
        if(!zona) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Buscamos el registro en la base de datos.
        const tipoReporte = await TiposReporte.findOne({
            where: {
                descripcionTipoReporte: descripcionTipoReporte
            }
        });

        // Si no existe el registro, abortamos.
        if(!tipoReporte) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.REGISTRO_VINCULADO_NO_EXISTE
            });
        }

        // Creamos un nuevo registro.
        const reporteNuevo = {
            descripcionReporte: descripcionReporte,
            fechaRegistroReporte: fecha,
            idPiezaVinculada: pieza.id,
            idZonaVinculada: zona.id,
            idTipoReporteVinculado: tipoReporte.id
        };

        // Guardamos el registro en la base de datos.
        await Reportes.create(reporteNuevo);

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