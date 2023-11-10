'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      fechaRegistroStatus: {
        allowNull: true,
        type: Sequelize.DATE
      },

      fechaActualizacionStatus: {
        allowNull: true,
        type: Sequelize.DATE
      },

      idEstadoVinculado: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: {
                tableName: "estadosStatus",
            },
            key: "id",
        },
      },

      idTipoStatusVinculado: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: {
                tableName: "tiposStatus",
            },
            key: "id",
        },
      },

      idPiezaStatusVinculada: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: {
                tableName: "piezas",
            },
            key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('statuses');
  }
};