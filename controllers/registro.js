var con = require('../config');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var UtilityController = require('../controllers/utilities');
var jwt = require('jsonwebtoken');



var controller = {
    registerUser: function (req, res) {//Registro de usuaria
        
        //console.log(req);
   console.log(req);
   //console.log(req.files);

        let oldPath = req.files.foto.path;//Ruta de las imágenes subidas
        //let oldPath = req.body.foto;

        //var res = oldPath.split(" \ ")[0];
        //console.log(res);
        let newPath = './public/img/uploads/' + req.files.foto.originalFilename;
        //let newPath = './public/img/uploads/' + req.body.nombre;

        let rutabbdd = '/img/uploads/'+ req.files.foto.originalFilename;
        //let rutabbdd = '/img/uploads/'+ req.body.foto;
        fs.rename(oldPath, newPath, function (err) { //Cambio de nombre a la imagen
        });

        let password1 = req.body.password1;
        bcrypt.genSalt(10, function (err, salt) {//Encriptación de Password
            bcrypt.hash(password1, salt, null, function (err, hash) {
                password1 = hash;

        let sql = `INSERT INTO usuaria (nombre,apellidos,fechanacimiento,tfn,intereses,foto,email,password1, numinvitaciones) VALUES ('${req.body.nombre}','${req.body.apellidos}','${req.body.fechanacimiento}','${req.body.tfn}','${req.body.intereses}','${rutabbdd}','${req.body.email}','${password1}','${5}')`;

            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                else {
                        console.log("registro con éxito");
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

        });
    })
  },
  loginUser: function (req, res) {//Login de usuaria
    console.log(req.body.email)
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
                            // TOKEN JWT
                            var token = jwt.sign({ id: req.session.user.id }, 'secretpass', {
                                expiresIn: 86400 // expires in 24 hours
                              });
                            
                            return res
                            
                            .status(200)
                            .send({ result: result, auth: true, token: token} );

                        } else {
                            console.log('la contraseña no es correcta')
                            return res.send('La contraseña no es correcta');
                            
                        };
                    };
                });
            };
        };
    });
},  sendmail: function (req, res){
    console.log(req.body.nombreusuaria);

    let invitation = nodemailer.createTransport({
        host: 'smtp.gmail.com',
          port: 465,
          secure: true,// use SSL
          auth: {
            user: 'beattiegmz84@gmail.com',
            pass: 'rob220917'
        }
      });
      
      var mailOptions = {
        from: req.body.emaillog,
        to: req.body.email,
        subject: 'Genial! Una usuaria se ha unido a tu ruta',
        text: 'La usuaria de NotAlone '+req.body.nombre+' quiere compartir el camino contigo. Ya puedes ponerte en contacto con ella para concretar un lugar y hora, su nº de teléfono es '+req.body.tfn , 
      };
      
      invitation.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
},
    numinvitation:function (req, res){// Consulta nº de invitaciones

        console.log(req.query.id);

        let sql = `SELECT * from usuaria WHERE id = ${req.query.id}`;

        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {
                console.log(result);
                return  res.send(result);
            }
      });
    },

    sendinvitation:function (req, res){//Envío de invitaciones por correo

        console.log(req.body.idusuaria);
        console.log(req.body.email);

        let idusuaria = req.body.idusuaria;
        let numinvitaciones = (req.body.invitaciones)-1;
        console.log(req.body.invitaciones);
        let current_hour = UtilityController.currentDate();
        let token = UtilityController.ramdomtoken();

        console.log(token);
        //Inserta en BBDD las invitaciones enviadas con un token
        let sql = `INSERT INTO invitacion (idusuaria,invitado1,fecha,token) VALUES ('${idusuaria}','${req.body.email}','${current_hour}','${token}')`;

        let encryp_token = token*5;//Encriptación de token
        encryp_token = encryp_token +1200;

        let url = "http://localhost:4200/registro/"+ encryp_token;//URL enviada en el correo para hacer el registro

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
                        pass: 'rob220917'
                    }
                  });
                  
                  var mailOptions = {
                    from: "NotAlone",
                    to: req.body.email,
                    subject: 'Invitación de registro en NotAlone',
                    text: url
                  };
                  
                  invitation.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });

                  // Resto una invitación

                let sql2 = `UPDATE usuaria SET numinvitaciones= '${numinvitaciones}' where id = '${req.body.idusuaria}'`;

                con.query(sql2, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.send(err);
                    }
                    else {
                            console.log("invitaciones");
                            let usuario = {
                                numinvitaciones: numinvitaciones,
                            }
                            return res.send(usuario);
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
            res.status(200).send({ auth: false, token: null });
            return res.send('No existe un login de usuario')
        }
    }
}



module.exports = controller;