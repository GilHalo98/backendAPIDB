'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tiposReportes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      descripcionTipoReporte: {
        type: Sequelize.STRING
      },

      fechaRegistroTipoReporte: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionTipoReporte: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tiposReportes');
  }
};