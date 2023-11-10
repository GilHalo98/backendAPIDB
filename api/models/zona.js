'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zona extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      zona.belongsTo(
        models.linea,
        { foreignKey: 'idLineaVinculada', onDelete: 'cascade' }
      )

      zona.hasOne(
        models.pieza,
        { foreignKey: 'idZonaActualVinculada', onDelete: 'cascade' }
      )

      zona.hasMany(
        models.reporte,
        { foreignKey:'idZonaVinculada', onDelete: 'cascade' }
      )
    }
  }

  zona.init({
    nombreZona: DataTypes.STRING,
    descripcionZona: DataTypes.STRING,
    idLineaVinculada: DataTypes.INTEGER,

    fechaRegistroZona: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroZona', toSQLDate(fecha));
      }
    },

    fechaActualizacionZona: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionZona', toSQLDate(fecha));
      }
    }

  }, {
    sequelize,
    modelName: 'zona',
    tableName: 'zonas'
  });

  return zona;
};