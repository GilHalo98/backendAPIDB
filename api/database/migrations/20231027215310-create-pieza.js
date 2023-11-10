'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('piezas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      dataMatrix: {
        type: Sequelize.STRING
      },

      fechaRegistroPieza: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionPieza: {
        allowNull: true,
        type: Sequelize.DATE
      },

      idTipoPiezaVinculada: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: {
                tableName: "tiposPiezas",
            },
            key: "id",
        },
      },

      idZonaActualVinculada: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: true,
        onDelete: 'cascade',
        references: {
            model: {
                tableName: "zonas",
            },
            key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('piezas');
  }
};