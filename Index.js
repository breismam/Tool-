const express = require("express");
const app = express();
const { config } = require("./Src/Config/index");
var bodyparser = require('body-parser'); //body-parser es requerido para descomponer el request

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("./Src/Public"));
app.get("/", (req, res) => res.send("Hola Pagina principal"));
app.get("/Users", (req, res) => res.send("Login"));
app.get("/Devices", (req, res) => res.send("Inventario"));

app.post("/guardar", (req, res) => {
    console.log("el archivo fue guardado");
    console.log(`El nombre del usurio es: ${req.body.user} y la contraseña es: ${req.body.pass}`);
});

app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});  
