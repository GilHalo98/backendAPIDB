'use strict';

// Incluimos la funcion de formateo de fechas.
const { toSQLDate } = require("../utils/utils");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipoPieza extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tipoPieza.hasMany(
        models.pieza,
        { foreignKey: 'idTipoPiezaVinculada', onDelete: 'cascade' }
      )
    }
  }

  tipoPieza.init({
    descripcionTipoPieza: DataTypes.STRING,
    fechaRegistroTipoPieza: DataTypes.DATE,
    fechaActualizacionTipoPieza: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'tipoPieza',
    tableName: 'tiposPiezas'
  });

  return tipoPieza;
};