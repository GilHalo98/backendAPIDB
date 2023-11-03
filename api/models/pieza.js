'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pieza extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      pieza.hasMany(
        models.reporte,
        {foreignKey: 'idPiezaVinculada'}
      )

      pieza.belongsTo(
        models.tipoPieza,
        { foreignKey: 'idTipoPiezaVinculada' }
      )

      pieza.belongsTo(
        models.zona,
        { foreignKey: 'idZonaActualVinculada' }
      )

      pieza.hasMany(
        models.status,
        { foreignKey: 'idPiezaStatusVinculada' }
      )
    }
  }

  pieza.init({
    dataMatrix: DataTypes.STRING,

    idTipoPiezaVinculada: DataTypes.INTEGER,
    idZonaActualVinculada: DataTypes.INTEGER,

    fechaRegistroPieza: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroPieza', toSQLDate(fecha));
      }
    },

    fechaActualizacionPieza: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionPieza', toSQLDate(fecha));
      }
    }
  }, {
    sequelize,
    modelName: 'pieza',
    tableName: 'piezas'
  });

  return pieza;
};