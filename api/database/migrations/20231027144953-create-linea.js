'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lineas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nombreLinea: {
        type: Sequelize.STRING
      },

      descripcionLinea: {
        type: Sequelize.STRING
      },

      fechaRegistroLinea: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionLinea: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lineas');
  }
};