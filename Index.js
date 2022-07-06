const express = require('express');
const app = express();
const {config} = require('./Src/Config/index');


app.get('/', (req,res) => res.send('Hola mundo'))

app.listen(config.port, () =>{
    console.log(`Servidor escuchando en el puerto ${config.port}`);
});