'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class estadoStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      estadoStatus.hasMany(
        models.status,
        { foreignKey: 'idEstadoVinculado', onDelete: 'cascade' }
      )
    }
  }
  estadoStatus.init({
    nombreEstado: DataTypes.STRING,

    fechaRegistroEstado: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroEstado', toSQLDate(fecha));
      }
    },

    fechaActualizacionEstado: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionEstado', toSQLDate(fecha));
      }
    }
  }, {
    sequelize,
    modelName: 'estadoStatus',
    tableName: 'estadosStatus'
  });
  return estadoStatus;
};