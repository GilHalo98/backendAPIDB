'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reporte extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reporte.belongsTo(
        models.pieza,
        { foreignKey: 'idPiezaVinculada', onDelete: 'cascade' }
      )

      reporte.belongsTo(
        models.tipoReporte,
        { foreignKey: 'idTipoReporteVinculado', onDelete: 'cascade' }
      )

      reporte.belongsTo(
        models.zona,
        { foreignKey: 'idZonaVinculada', onDelete: 'cascade' }
      )
    }
  }

  reporte.init({
    descripcionReporte: DataTypes.STRING,

    idPiezaVinculada: DataTypes.INTEGER,
    idZonaVinculada: DataTypes.INTEGER,
    idTipoReporteVinculado: DataTypes.INTEGER,

    fechaRegistroReporte: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroReporte', toSQLDate(fecha));
      }
    },

    fechaActualizacionReporte: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionReporte', toSQLDate(fecha));
      }
    }
  }, {
    sequelize,
    modelName: 'reporte',
    tableName: 'reportes'
  });

  return reporte;
};