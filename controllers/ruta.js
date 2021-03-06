var con = require('../config');
var UtilityController = require('../controllers/utilities');
var googleMapsClient = require('@google/maps').createClient({//Google maps y coordenadas usando Promesas
    key: 'AIzaSyAorDvL2UTCJNA_mqwBM0j8ZHkcFl-PWW8',
    Promise: Promise
  });

var controller = {

    addRuta: function (req, res) {

        let usuaria = req.session.user;

        console.log(req.body.origen)
        
        let sql = `INSERT INTO ruta (idusuaria,origen,destino,fecha,hora,coordenadas,coordenadas2,medio,comentarios) VALUES ("48",'${req.body.origen}','${req.body.destino}','${req.body.fecha}','${req.body.hora}','en espera','en espera','${req.body.medio}','${req.body.comentarios}')`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else {

                let coordenadas = UtilityController.getCoordsOrig(req.body.origen,result.insertId);//llamada a función de coordenadas origen
                let coordenadas2 = UtilityController.getCoordsDest(req.body.destino,result.insertId);//llamada a función de coordenadas destino

                let ruta = {
                    id: result.insertId,
                    idusuaria: "48",
                    origen: req.body.origen,
                    destino: req.body.destino,
                    fecha: req.body.fecha,
                    hora: req.body.hora,
                    coordenadas: coordenadas,
                    coordenadas2: coordenadas2,
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
     }




}//fin controller

module.exports = controller;