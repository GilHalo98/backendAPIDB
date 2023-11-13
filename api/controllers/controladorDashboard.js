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

// Consulta de seguimiento de piezas por zona en una linea dada.
exports.seguimientoPiezas = async(request, respuesta) => {
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
        if(consulta.idLineaVinculada) {
            datos.idLineaVinculada = consulta.idLineaVinculada;
        }

        // Consultamos el total de los registros.
        const totalZonas = await Zonas.count({
            where: datos,
        });

        // Consultamos todos los registros.
        const zonas = await Zonas.findAll({
            offset: offset,
            limit: limit,
            where: datos,
            include: [{
                attributes: ['dataMatrix'],
                model: Piezas,
                include: [
                    {
                        attributes: ['descripcionTipoPieza'],
                        model: TiposPieza
                    },
                    {
                        model: Reportes,
                        attributes: ['descripcionReporte', 'fechaRegistroReporte'],
                        include: [{
                            model: TiposReporte,
                            attributes: ['descripcionTipoReporte'],
                        }]
                    }
                ]
            }],
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            totalRegistros: totalZonas,
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

// Consulta la linea y zona donde se encuentra la pieza dada.
exports.buscarPieza = async(request, respuesta) => {
    // GET Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Recuperamos los datos de la consulta.
        const dataMatrix = consulta.dataMatrix;

        // Verificamos que los datos de la busqueda esten completos.
        if(!dataMatrix) {
            return respuesta.status(200).json({
                codigoRespuesta: CODIGOS.DATOS_BUSQUEDA_INCOMPLETOS,
            });
        }

        // Buscamos en la base de datos el registro de la pieza.
        const pieza = await Piezas.findOne({
            attributes: ['id', 'dataMatrix'],
            where: {
                dataMatrix: {
                    [Op.substring]: dataMatrix
                },
                idZonaActualVinculada: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: Zonas,
                    attributes: ['nombreZona'],
                    include: [{
                        model: Lineas,
                        attributes: ['nombreLinea'],
                    }]
                },
                {
                    model: TiposPieza,
                    attributes: ['descripcionTipoPieza'],
                },
                {
                    model: Reportes,
                    attributes: ['descripcionReporte'],
                    include: [{
                        model: TiposReporte,
                        attributes: ['descripcionTipoReporte'],
                    }]
                }
            ],
        });

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            registro: pieza,
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

// Consulta las piezas ok y rechazadas.
exports.piezasOkRechazadas = async(request, respuesta) => {
    // GET Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Datos del reporte a retornar.
        const reporte = Object();

        // Consultamos los tipos de status.
        const tiposStatuse = await TiposStatus.findAll({
            attributes: ['id', 'descripcionTipoStatus']
        });

        // Consultamos los estados de los status.
        const estadosStatus = await EstadosStatus.findAll({
            attributes: ['id', 'nombreEstado']
        });

        // Agregamos la seccion de tipo de status al reporte.
        reporte.tipoStatus = Object();

        // Por cada tipo de status posible.
        for (let i = 0; i < tiposStatuse.length; i++) {
            // Recuperamos el tipo de status.            
            const tipoStatus = tiposStatuse[i];

            // Agregamos la descripcion del tipo de status.
            reporte.tipoStatus[tipoStatus.descripcionTipoStatus] = Object();

            // Por cada estado de status posible.
            for (let j = 0; j < estadosStatus.length; j++) {

                // Recuperamos el estado del status.
                const estadoStatus = estadosStatus[j];

                // Realizamos el conteo de los registros.
                const conteo = await Statuses.count({
                    where: {
                        idTipoStatusVinculado: tipoStatus.id,
                        idEstadoVinculado: estadoStatus.id
                    }
                });

                // Agregamos el conteo de piezas con esos status.
                reporte.tipoStatus[
                    tipoStatus.descripcionTipoStatus
                ][
                    estadoStatus.nombreEstado
                ] = conteo;
            }
        }

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            reporte: reporte
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

// Consulta de las piezas procesadas por linea.
exports.piezasProcesadasPorLinea = async(request, respuesta) => {
    // GET Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Datos del reporte a retornar.
        const reporte = Object();

        // Consultamos las lineas.
        const lineas = await Lineas.findAll({
            attributes: ['id', 'nombreLinea']
        });

        // Consultamos los tipos de reporte.
        const tiposReporte = await TiposReporte.findAll({
            attributes: ['id', 'descripcionTipoReporte']
        });

        // Por cada linea.
        for (let i = 0; i < lineas.length; i++) {
            // Recuperamos el registro de la linea.
            const linea = lineas[i];

            // Instanciamos un apartado para el tipo de reporte.
            reporte[linea.nombreLinea] = Object();

            // Consultamos las zonas de la linea.
            const zonas = await Zonas.findAll({
                attributes: ['id'],
                where: {
                    idLineaVinculada: linea.id
                }
            });

            // Mapeamos unicamente los id's de la zonas.
            const idZonas = zonas.map((zona) => {
                return zona.id;
            });

            // Por cada tipo de reporte.
            for (let j = 0; j < tiposReporte.length; j++) {
                // Recuperamos el registro.
                const tipoReporte = tiposReporte[j];

                // Realizamos el conteo de los registros.
                const conteo = await Reportes.count({
                    where: {
                        idZonaVinculada: {
                            [Op.or]: idZonas
                        },
                        idTipoReporteVinculado: tipoReporte.id
                    }
                });

                // Agreamos el conteo del tipo de reporte por zona.
                reporte[
                    linea.nombreLinea
                ][
                    tipoReporte.descripcionTipoReporte
                ] = conteo;
            }
        }

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            reporte: reporte
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

// Cuenta las piezas por tipo.
exports.conteoPiezasPorTipo = async(request, respuesta) =>{
    // GET Request.
    const headers = request.headers;
    const cuerpo = request.body;
    const parametros = request.params;
    const consulta = request.query;

    try {
        // Datos del reporte a retornar.
        const reporte = Object();

        // Consultamos los tipos de piezas.
        const tiposPieza = await TiposPieza.findAll({
            attributes: ['id', 'descripcionTipoPieza']
        });

        // Por cada tipo de pieza.
        for (let i = 0; i < tiposPieza.length; i++) {
            // Recuperamos el registro.
            const tipoPieza = tiposPieza[i];

            // Contamos las piezas por tipo.
            const conteo = await Piezas.count({
                where: {
                    idTipoPiezaVinculada: tipoPieza.id
                }
            });

            // Agregamos el conteo al reporte.
            reporte[tipoPieza.descripcionTipoPieza] = conteo;
        }

        // Retornamos los registros encontrados.
        return respuesta.status(200).json({
            codigoRespuesta: CODIGOS.OK,
            reporte: reporte
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