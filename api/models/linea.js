'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class linea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      linea.hasMany(
        models.zona,
        { foreignKey: 'idLineaVinculada' }
      )
    }
  }

  linea.init({
    nombreLinea: DataTypes.STRING,
    descripcionLinea: DataTypes.STRING,

    fechaRegistroLinea: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroLinea', toSQLDate(fecha));
      }
    },

    fechaActualizacionLinea: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionLinea', toSQLDate(fecha));
      }
    }

  }, {
    sequelize,
    modelName: 'linea',
    tableName: 'lineas'
  });

  return linea;
};