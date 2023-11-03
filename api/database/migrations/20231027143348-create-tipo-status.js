'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tiposStatus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      descripcionTipoStatus: {
        type: Sequelize.STRING
      },

      fechaRegistroTipoStatus: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionTipoStatus: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tiposStatus');
  }
};