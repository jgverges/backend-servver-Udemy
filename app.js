// Requires
var express = require('express');
var mongoose = require ('mongoose');


// Inicializar variables
var app = express();


// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res) => {
    if (err) throw err;

    console.log ( 'Base de datos: \x1b[35m%s\x1b[35m','online');

});


// Rutas
app.get( '/',(req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

} );


// escuchar  peticiones
app.listen(3000, () => {
    console.log ( 'Express server puerto 3000: \x1b[35m%s\x1b[35m','online');
});