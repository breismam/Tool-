const express = require("express");
const firebase = require("firebase-admin");
// Required for side-effects
require("firebase/firestore");
const cors = require("cors");
const app = express();
const { config } = require("./Src/Config/index");
var bodyparser = require("body-parser"); //body-parser es requerido para descomponer el request
// Required for side-effects
/**
 * Configuración necesaria para configurar con autenticación la base de datos
 * de firebase con el backend en nodejs.
 * Se requiere una clave que se descarga desde el proyecto en la ruta:
 * proyecto/configuracion/cuentasdeservicio/SDK de firebase admin
 */
// Import the functions you need from the SDKs you need
//const { getAnalytics } = require('firebase/analytics');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQLfLdV6bUGFwPI7lFM0QyRiC3AgRO4Es",
  authDomain: "cursonodejs-f2ad1.firebaseapp.com",
  databaseURL: "https://cursonodejs-f2ad1-default-rtdb.firebaseio.com",
  projectId: "cursonodejs-f2ad1",
  storageBucket: "cursonodejs-f2ad1.appspot.com",
  messagingSenderId: "893557532176",
  appId: "1:893557532176:web:d64cfb721cc653d64f0c95",
  measurementId: "G-EHN5VJQ920",
};
// Initialize Firebase
//const analytics = getAnalytics(app);
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Listas de acceso
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("./Src/Public"));
app.get("/", (req, res) => res.send("Hola Pagina principal"));
app.get("/Users", (req, res) => res.send("Login"));
app.get("/Devices", (req, res) => res.send("Inventario"));
// servidor Up
app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});

/**
 * Autenticación
 */
//---------------------------------- Creación de cuenta de autenticación-------------------------------
app.post("/signup", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const userResponse = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    emailVerified: false,
    disabled: false,
  });
  res.json(userResponse);
});
//--------------------------------- Comprobación de correcta autenticación-------------------------------
app.post("/signin", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
});

/**
 * CRUD con firestore
 */

//--------------------------------- Escritura en la base de datos -------------------------------
//escritura en realtime
/*
app.post("/guardar", (req, res) => {
  console.log("el archivo fue guardado");
  console.log(
    `El nombre del usuario es: ${req.body.user} y la contraseña es: ${req.body.pass}`
  );
  var newUser = {
    name: req.body.user,
    pass: req.body.pass,
    email: req.body.email,
  };
  db.ref("usuarios").push(newUser);
  res.json({ message: "Ok" });
});*/

// escritura en firestore

app.post("/guardar", (req, res) => {
  db.collection("users")
    .add({
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
});

//--------------------------------- Lectura en la base de datos -------------------------------

app.get("/listar", (req, res) => {
  db.collection("users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    });
  res.json({ message: "leyendo" });
});

//--------------------------------- Editar en la base de datos -------------------------------

//------------------------------ Eliminar todo en la base de datos ---------------------------
app.post("/borrar", (req, res) => {
  var ref = db.ref("/usuarios/");
  ref.remove(); // Clear all news
  res.json({ message: "Todos los datos fueron eliminados" });
});
