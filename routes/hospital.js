var express = require ('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// =============================
// Obtener todos los Hospitales
// ================================
app.get('/', (req, res, next) => {

    Hospital.find({})
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales
                });

            });
});

// ===============================================================
// Actualizar localhost:3000/hospitales 
// ===============================================================
app.put('/:id', mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;
    var body =req.body;

    Hospital.findById( id, (err, hospital) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al -buscar- Hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con '+id+' no existe',
                errors: {message :'no existe Hospital con ese id'}
            });

        }



        hospital.nombre=body.nombre;
        hospital.usuario=req.usuario._id;

        hospital.save((err,hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al -actualizar- hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        
        });

    });


});  


// ===============================================================
// Crear nuevo hospital 
// ===============================================================
app.post('/', mdAutenticacion.verificaToken,(req,res) =>{

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre, 
        usuario: req.usuario._id
    });

    hospital.save( ( err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al CREAR hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital:hospitalGuardado,
        });


    });

});


// ========================================
// Borrar un Hospital por el id
// ====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Hospital.findByIdAndRemove(id, (err,hospitalBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al -borrar- hospital',
                    errors: err
                });
            }

            if (!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con ese id',
                    errors: {message:'message:No existe un hospital con ese id'}
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
            });
    
        });    
    
});



//// para poder impoortar la ruta fuera del archivo
module.exports = app;