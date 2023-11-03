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
                        attributes: ['id'],
                        model: Statuses,
                        include: [
                            {
                                attributes: ['nombreEstado'],
                                model: EstadosStatus
                            },
                            {
                                attributes: ['descripcionTipoStatus'],
                                model: TiposStatus
                            }
                        ]
                    },
                    {
                        attributes: ['descripcionTipoPieza'],
                        model: TiposPieza
                    }
                ]
            }]
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