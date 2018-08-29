var con = require('../config');
var UtilityController = require('../controllers/utilities');
var googleMapsClient = require('@google/maps').createClient({//Google maps y coordenadas usando Promesas
    key: 'AIzaSyAorDvL2UTCJNA_mqwBM0j8ZHkcFl-PWW8',
    Promise: Promise
  });

var controller = {

    addRuta: function (req, res) {

        let usuaria = req.session.user;

        console.log(usuaria.id)
        
        let sql = `INSERT INTO ruta (idusuaria,origen,destino,hora,coordenadas,medio,comentarios) VALUES ('${usuaria.id}','${req.body.origen}','${req.body.destino}','${req.body.hora}','${"en espera"}','${req.body.medio}','${req.body.comentarios}')`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {

                let coordenadas = UtilityController.getCoords(req.body.origen,result.insertId);//llamada a función de coordenadas

                let ruta = {
                    id: result.insertId,
                    idusuaria: usuaria.id,
                    origen: req.body.origen,
                    destino: req.body.destino,
                    hora: req.body.hora,
                    coordenadas: coordenadas,
                    medio: req.body.medio,
                    comentarios: req.body.comentarios
                }
               return res.send(ruta);
            }
        });

    },
    consultRuta: function(req,res){

        let sql = 'SELECT * from ruta';
        con.query(sql, function (err, result) {
        if (err) {
           return res.send(err);
        }
        else {
          return  res.send(result);
        }
    });
},
consultRutabyID: function(req,res){

    let sql = `SELECT * from ruta WHERE idruta = ${req.query.id}`;
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
     getCoords : function(ciudad){
         let coord = {}
        googleMapsClient.geocode({address: ciudad})
        .asPromise()
        .then((response) => {
          coord = response.json.results[0].geometry.location;
          console.log(coord)

           return coord

        })
        .catch((err) => {
          return err;
        });
        //console.log(coord)
        //return coord
     }




}//fin controller

module.exports = controller;