'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipoStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tipoStatus.hasMany(
        models.status,
        { foreignKey: 'idTipoStatusVinculado' }
      )
    }
  }

  tipoStatus.init({
    descripcionTipoStatus: DataTypes.STRING,

    fechaRegistroTipoStatus: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroTipoStatus', toSQLDate(fecha));
      }
    },

    fechaActualizacionTipoStatus: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionTipoStatus', toSQLDate(fecha));
      }
    }

  }, {
    sequelize,
    modelName: 'tipoStatus',
    tableName: 'tiposStatus'
  });

  return tipoStatus;
};