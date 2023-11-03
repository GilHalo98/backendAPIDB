class CodigoApp {
    // Código de error con la API.
    API_ERROR = -1;

    // Código que indica operación exitosa.
    OK = 0;

    // Códigos de dato no encontrado. (1, 7)
    REGISTRO_NO_EXISTE = 1;

    // Códigos de datos para registros/Busqueda invalidos/incompletos/ya registrados. (8, 15)
    DATOS_REGISTRO_INCOMPLETOS = 8;
    REGISTRO_VINCULADO_NO_EXISTE = 9;
    DATOS_BUSQUEDA_INCOMPLETOS = 10;
    REGISTRO_SE_ENCUENTRA_EN_DB = 11;

    // Códigos de tokens. (16, 13)
    TOKEN_NO_INGRESADO = 16;
};

module.exports = {
    CodigoApp
};