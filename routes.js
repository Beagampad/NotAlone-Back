var app = require('./app');
var UserController = require('./controllers/usuaria');//Controlador Usuaria
var UsersController = require('./controllers/registro');//Controlador registro
var RutasController = require('./controllers/ruta');//Controlador ruta
var UtilityController = require('./controllers/utilities')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './public/img/uploads'})


// middleware que comprueba que hay sesión
var auth = function (req, res, next) {
    if (req.session.user){
        console.log("Hay sesión");
        return next();
    }
    else{
        console.log("No hay sesión");
        return res.sendStatus(404);
    }
};

//ruta para comprobar la sesión
app.get('/home', auth, function (req, res) {
    res.render('home', {
        email: req.session.user.email
    });
});

//Rutas
app.get('/', function(req,res){
    res.render('index');
});

app.get('/cover', function(req,res){
    res.render('cover');
});

app.get('/CRUD', function(req,res){
    res.render('CRUD/index');
});

app.get('/CRUD/nuevo', function(req,res){
    res.render('CRUD/nuevo');
});

app.get('/test', function(req,res){
    res.status(200).send({
        message: 'conexion exitosa'
    })
});


// ----------------- REGISTRO Y LOGIN --------------------------

//Login
app.post('/notalone/login', UsersController.loginUser);

//LogOut Usuaria
app.get('/notalone/logout', UsersController.logoutUser);

//Registro de usuaria por formulario
app.post('/notalone/register', multipartMiddleware, UsersController.registerUser);

//Envío de invitaciones
app.post('/notalone/invitacion', UsersController.sendinvitation);

//------------------------ CRUD -----------------------------------

//Añadir usuaria por panel administracion
app.post('/notalone/add', multipartMiddleware, UserController.addUsuaria);

//Consultar Usuarias
app.get('/notalone', UserController.consultUsuaria);

//Consultar Usuaria por ID
app.get('/CRUD/detalles', UserController.consultUserbyID);

// Modificar Usuaria por ID
app.get('/CRUD/modificacion', UserController.modUsuariabyID);

//Modificacion datos de usuaria
app.post('/notalone/update', UserController.modUsuaria);

//Borrar Usuaria
app.post('/notalone/delete', UserController.borrarUsuaria);

// --------------------- RUTAS -------------------------------

//Crear Ruta
app.post('/notalone/createruta', RutasController.addRuta);

//Consultar Rutas
app.get('/notalone/rutas', RutasController.consultRuta);

//ConsultarRuta por ID
app.get('/notalone/rutadetalle', RutasController.consultRutabyID);

//Coord Ruta Origen
app.post('/notalone/coord', UtilityController.getCoordsOrig);

//Coord Ruta Destino
app.post('/notalone/coord2', UtilityController.getCoordsOrig);

//Unirme a Ruta
app.post('/notalone/joinme', UsersController.sendmail);







