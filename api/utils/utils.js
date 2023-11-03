function toSQLDate(fecha) {
    // Cambia de formato la fecha dada al formato aceptado por SQL.
    return fecha.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = {
    toSQLDate
};