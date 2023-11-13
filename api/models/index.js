'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/database.js');
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
/*
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

*/

// Importar los modelos de manera estatica si se quiere compilar el programa.
const estadoStatus = require("./estadostatus.js")(sequelize, Sequelize.DataTypes);
const linea = require("./linea.js")(sequelize, Sequelize.DataTypes);
const pieza = require("./pieza.js")(sequelize, Sequelize.DataTypes);
const reporte = require('./reporte.js')(sequelize, Sequelize.DataTypes);
const status = require('./status.js')(sequelize, Sequelize.DataTypes);
const tipoPieza = require('./tipopieza.js')(sequelize, Sequelize.DataTypes);
const tipoReporte = require('./tiporeporte.js')(sequelize, Sequelize.DataTypes);
const tipoStatus = require('./tipostatus.js')(sequelize, Sequelize.DataTypes);
const zona = require('./zona.js')(sequelize, Sequelize.DataTypes);

const modelos = [
    estadoStatus,
    linea,
    pieza,
    reporte,
    status,
    tipoPieza,
    tipoReporte,
    tipoStatus,
    zona
]

modelos.forEach(model => {
    db[model.name] = model;
});


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;