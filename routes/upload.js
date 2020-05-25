var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos=['hospitales','medicos','usuarios'];
    if ( tiposValidos.indexOf( tipo)<0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message:'Tipo de colección no es válida'}
        });
    }


    if( !req.files){
            return res.status(400).json({
                ok: false,
                mensaje: 'No seleccionó nada',
                errors: { message:'Debe seleccionar una imagen'}
            });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length-1];

    // solo estas extensiones aceptamos
    var extensionesValidas = ['png','jpg','gif','jpeg'];

    if ( extensionesValidas.indexOf(extensionArchivo) <0 ){
        return res.status(500).json({
            ok: false,
            mensaje: 'Extensión no valida',
            errors: { message:'Las extensiones válidas son: '+extensionesValidas.join(', ') }
        });

    }
    // Nombre de archivo personalizado
    // formato: id-random.ext --> 123123123-458.png
    var nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extensionArchivo} `;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo} `;

    archivo.mv(path, err => {

        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });   
        }


        subirPorTipo( tipo, id, nombreArchivo, res);

/*         res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            extensionArchivo: extensionArchivo
        });
 */
    });




});





function subirPorTipo( tipo, id, nombreArchivo, res){

    if ( tipo === 'usuarios'){

        Usuario.findById( id, (err,usuario) =>{

            var pathViejo = './uploads/usuarios/'+usuario.img;

            // Si existe, elimina img anterior    
            if(fs.existsSync(pathViejo)){
                fs.unlink( pathViejo );
            }

            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado) =>{

               return  res.status(200).json({
                    ok: true,
                    mensaje: 'Imagende usuario actualizada',
                    usuario: usuarioActualizado
                });
        
            });


        });

    }

    if ( tipo === 'medicos'){

    }

    if ( tipo === 'hospitales'){

    }



}



module.exports = app;