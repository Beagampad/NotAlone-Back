var con = require('../config');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var UtilityController = require('../controllers/utilities');


var controller = {
    registerUser: function (req, res) {//Registro de usuaria

        //console.log(req.files);

        let oldPath = req.files.foto.path;//Ruta de las imágenes subidas
        let newPath = './public/img/uploads/' + req.files.foto.originalFilename;

        let rutabbdd = '/img/uploads/'+ req.files.foto.originalFilename;
        fs.rename(oldPath, newPath, function (err) { //Cambio de nombre a la imagen
        });

        let password1 = req.body.password1;
        bcrypt.genSalt(10, function (err, salt) {//Encriptación de Password
            bcrypt.hash(password1, salt, null, function (err, hash) {
                password1 = hash;

        let sql = `INSERT INTO usuaria (nombre,apellidos,fechanacimiento,intereses,foto,email,nombreusuaria,password1) VALUES ('${req.body.name}','${req.body.surname}','${req.body.date}','${req.body.interest}','${rutabbdd}','${req.body.email}','${req.body.nombreusuaria}','${password1}')`;
        //console.log(req);
        /*var url_string = req.headers.referer;//Recoge la url actual
        console.log(url_string);
        var res = url_string.split("=");//captura de token de la url
        var tk = res[1];//Guarda el token de la url*/

        var existetoken = UtilityController.checktoken(tk);

        console.log(existetoken);

        //if(existetoken){//Comprueba que existe el token con el método de utilities

            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                else {
                        console.log("existe el token");
                        let usuario = {
                            id: result.insertId,
                            nombre: req.body.name,
                            apellidos: req.body.surname,
                            fechanacimiento: req.body.date,
                            intereses: req.body.interest,
                            foto: newPath,
                            email: req.body.email,
                            nombreusuaria: req.body.nombreusuaria,
                            password1 : req.body.password1
                        }
                        return res.send(usuario);
                }
          });

       /* }else{
            console.log("no existe el token")
        }*/
        });
    })
  },
  loginUser: function (req, res) {//Login de usuaria
    let sql = `SELECT * from usuaria where email ='${req.body.email}'`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        else {
            if (result == "") {
                console.log("Email vacío")
                return res.send('Email introducido no válido');
            } else {
                var hashedPassword = result[0].password1;
                
                //console.log(req.session.user)
                bcrypt.compare(req.body.password, hashedPassword, function (err, iguales) {
                    if (err) {
                        
                        console.log("hay un error al comparar")
                        return res.send(err)
                        
                    } else {
                        if (iguales) {
                            
                            req.session.user = {//Guarda en sesión los datos del usuario
                                'id': result[0].id,
                                'user': result[0].nombre,
                                'email': result[0].email
                              }
                            console.log("son iguales")
                            return res.send(result);
                            
                        } else {
                            console.log('la contraseña no es correcta')
                            return res.send('La contraseña no es correcta');
                            
                        };
                    };
                });
            };
        };
    });
},
    sendinvitation:function (req, res){//Envío de invitaciones por correo

        let usuaria = req.session.user;
        var current_hour = UtilityController.currentDate();
        var token = UtilityController.ramdomtoken();

        console.log(token);
        //Inserta en BBDD las invitaciones enviadas con un token
        let sql = `INSERT INTO invitacion (idusuaria,invitado1,fecha,token) VALUES ('${usuaria.id}','${req.body.passinvitada}','${current_hour}','${token}')`;

        let encryp_token = token*5;//Encriptación de token
        encryp_token = encryp_token +1200;

        let url = "http://localhost:3000/?tk="+ encryp_token;//URL enviada en el correo para hacer el registro

        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {
                let invitation = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                      port: 465,
                      secure: true,// use SSL
                      auth: {
                        user: 'beattiegmz84@gmail.com',
                        pass: 'underground84'
                    }
                  });
                  
                  var mailOptions = {
                    from: usuaria.email,
                    to: req.body.passinvitada,
                    subject: 'Sending Email using Node.js',
                    text: url
                  };
                  
                  invitation.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                }
               
        //console.log(req);

        })
    },
    logoutUser: function(req, res){
        if(req.session.user){
            req.session.destroy();
        }else{
            console.log("No existe un login de usuario");
            return res.send('No existe un login de usuario')
        }
    }
    
}



module.exports = controller;