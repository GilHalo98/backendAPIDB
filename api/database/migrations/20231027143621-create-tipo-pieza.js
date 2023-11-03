'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tiposPiezas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      descripcionTipoPieza: {
        type: Sequelize.STRING
      },

      fechaRegistroTipoPieza: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionTipoPieza: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tiposPiezas');
  }
};