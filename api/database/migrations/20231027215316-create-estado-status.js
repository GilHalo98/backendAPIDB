'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estadosStatus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nombreEstado: {
        type: Sequelize.STRING
      },

      fechaRegistroEstado: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionEstado: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estadosStatus');
  }
};