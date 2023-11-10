'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zonas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nombreZona: {
        type: Sequelize.STRING
      },

      descripcionZona: {
        type: Sequelize.STRING
      },

      fechaRegistroZona: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionZona: {
        allowNull: true,
        type: Sequelize.DATE
      },

      idLineaVinculada: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: {
                tableName: "lineas",
            },
            key: "id",
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('zonas');
  }
};