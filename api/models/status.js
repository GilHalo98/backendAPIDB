'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      status.belongsTo(
        models.estadoStatus,
        { foreignKey: 'idEstadoVinculado' }
      )

      status.belongsTo(
        models.tipoStatus,
        { foreignKey: 'idTipoStatusVinculado' }
      )

      status.belongsTo(
        models.pieza,
        { foreignKey: 'idPiezaStatusVinculada' }
      )
    }
  }

  status.init({
    idEstadoVinculado: DataTypes.INTEGER,
    idTipoStatusVinculado: DataTypes.INTEGER,
    idPiezaStatusVinculada: DataTypes.INTEGER,

    fechaRegistroStatus: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaRegistroStatus', toSQLDate(fecha));
      }
    },

    fechaActualizacionStatus: {
      type: DataTypes.DATE,
      set(fecha) {
        // Formateamos el formato de la fecha del registro
        // a corde al soportado por la DB.
        this.setDataValue('fechaActualizacionStatus', toSQLDate(fecha));
      }
    }
  }, {
    sequelize,
    modelName: 'status',
    tableName: 'statuses'
  });

  return status;
};