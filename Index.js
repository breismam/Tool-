const express = require("express");
const app = express();
const { config } = require("./Src/Config/index");
var bodyparser = require("body-parser"); //body-parser es requerido para descomponer el request

/**
 * Configuración necesaria para configurar con autenticación la base de datos
 * de firebase con el backend en nodejs.
 * Se requiere una clave que se descarga desde el proyecto en la ruta:
 * proyecto/configuracion/cuentasdeservicio/SDK de firebase admin
 */

//Ruta de la clave de firebase admin
var serviceAccount = require("./cursonodejs-f2ad1-firebase-adminsdk-y45yc-9e532e59d5.json");
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cursonodejs-f2ad1-default-rtdb.firebaseio.com",
});

var db = admin.database();

/**
 *
 */

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("./Src/Public"));
app.get("/", (req, res) => res.send("Hola Pagina principal"));
app.get("/Users", (req, res) => res.send("Login"));
app.get("/Devices", (req, res) => res.send("Inventario"));

app.post("/guardar", (req, res) => {
  console.log("el archivo fue guardado");
  console.log(
    `El nombre del usurio es: ${req.body.user} y la contraseña es: ${req.body.pass}`
  );
  var newUser = {
    name: req.body.user,
    pass: req.body.pass,
    email: req.body.email,
  }
  db.ref("usuarios").push(newUser)
});

app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});
