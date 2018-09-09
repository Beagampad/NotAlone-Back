var con = require('../config');
var fs = require('fs');


var controller = {

    addUsuaria: function (req, res) {
        let oldPath = req.files.foto.path;
        let newPath = './public/img/uploads/' + req.files.foto.originalFilename;

        let rutabbdd = '/img/uploads/'+ req.files.foto.originalFilename;
        fs.rename(oldPath, newPath, function (err) { 
        });
        
        let sql = `INSERT INTO usuaria (nombre,apellidos,fechanacimiento,intereses,foto,email) VALUES ('${req.body.name}','${req.body.surname}','${req.body.date}','${req.body.interest}','${rutabbdd}','${req.body.email}')`;
        
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.send(err);
                
            }
            else {
                let usuario = {
                    id: result.insertId,
                    nombre: req.body.name,
                    apellidos: req.body.surname,
                    fechanacimiento: req.body.date,
                    intereses: req.body.interest,
                    foto: newPath,
                    email: req.body.email
                }
               return res.send(usuario);
            }
        });

    },
    consultUsuaria: function(req,res){

        let sql = 'SELECT * from usuaria';
        con.query(sql, function (err, result) {
        if (err) {
           return res.send(err);
        }
        else {
          return  res.send(result);
        }
    });
},
    consultUserbyID: function(req,res){

        let sql = `SELECT * from usuaria WHERE id = ${req.query.id}`;
        con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
          return  res.send(err);
        }
        else {
            return  res.send(result);
        }
    })
    
    },
    modUsuariabyID: function(req,res){

        console.log(req.query.id)

        let sql = `SELECT * from usuaria WHERE id = ${req.query.id}`;
        con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        else {
            console.log(result);
           return res.render('CRUD/modificacion', {
                detalle: result
            });
        }
    })

    },
    modUsuaria: function(req,res){

        console.log(req.body.email)
        console.log(req.body.intereses)

        let sql = `UPDATE usuaria SET intereses='${req.body.intereses}',email='${req.body.email}' where id = '${req.body.id}'`;
        
        con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
           return res.send(err);
        }
        else {
            let usuaria = {
                
                intereses: req.body.intereses,
                email:req.body.email

            }
            
          return  res.send(usuaria);
        }
    })

    },
    borrarUsuaria: function(req,res){

    let sql = `DELETE FROM usuaria where id = '${req.body.id}'`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(result);
        }
      });
    }

   
}//fin controller







module.exports = controller;