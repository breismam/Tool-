/**
 * Archivo de configuración de las variables almacenadas en .env
 */
require("dotenv").config();
module.exports.config={
    port: process.env.PORT,
};

