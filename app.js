var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;
var app = express();

//Configuración de archivos
app.use(express.static(__dirname + '/public'));//en la carpeta public guardo los archivos estáticos
app.set('views', __dirname + '/public/views');//en esta carpeta guardaré las vistas(archivos ejs)
app.engine('ejs', require('ejs').renderFile);//los html la dependencia ejs es quien la renderiza
app.set('view engine', 'ejs');//indicamos el motor de nuestros html

//Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(port, () =>{
    console.log('Servidor corriendo correctamente');
  });
//Módulo de sesión
var session = require('express-session');
app.use(session({
  secret:'cadena aleatoria',
    resave:true,
    saveUninitialized:true
}));


module.exports = app;//exportación del archivo app.js