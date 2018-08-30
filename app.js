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

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});


module.exports = app;//exportación del archivo app.js