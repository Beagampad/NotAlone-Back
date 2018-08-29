var con = require('../config');
var moment = require('moment');
var rn = require('random-number');
var googleMapsClient = require('@google/maps').createClient({//Google maps y coordenadas
    key: 'AIzaSyAorDvL2UTCJNA_mqwBM0j8ZHkcFl-PWW8',
    Promise: Promise
  });


var controller = {

    currentDate:function() {//Saca la fecha actual
        var current_hour = moment().format('yyyy-mm-dd');
        return current_hour;
    },
    ramdomtoken: function(){//Genera un token de forma aleatoria

        var gen = rn.generator({
            min:  -1000
            , max:  1000
            , integer: true
        })
        return gen(); // example outputs → -350

    },
    checktoken: function(tk){//Comprobación de token de invitación en BBDD

        console.log(tk);

        var decryp_token = tk;
        decryp_token = decryp_token - 1200;
        decryp_token = (decryp_token)/5;

        console.log(decryp_token);

        let sql = `SELECT * from invitacion WHERE token = '${decryp_token}'`;

        console.log(sql);
        let Tk = false;
        //console.log(Tk.existe);

        con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return err;
            }
            else {
               Tk=true;
               console.log(Tk);
               return Tk ;
            };
            
        });

    },

    initMap : function() {

        // Creamos un objeto mapa y especificamos el elemento DOM donde se va a mostrar.
       
        mapa.map = new google.maps.Map(document.getElementById('mapa'), {
          center: {lat: 43.2686751, lng: -2.9340005},
          scrollwheel: false,
          zoom: 14,
          zoomControl: true,
          rotateControl : false,
          mapTypeControl: true,
          streetViewControl: false,
        });
       
        // Creamos el marcador
        mapa.marker = new google.maps.Marker({
        position: {lat: 43.2686751, lng: -2.9340005},
        draggable: true
        });
       
        // Le asignamos el mapa a los marcadores.
         mapa.marker.setMap(mapa.map);
       
        },
        // función que se ejecuta al pulsar el botón buscar dirección
        getCoords : function(ciudad,idusuaria){
            console.log(idusuaria)
            let coord = {}
            console.log(ciudad)
            let address1 = ciudad;

            // Geocode an address.
            googleMapsClient.geocode({
                address: address1
            }, function(err, response) {
                if (!err) {
                    coord = response.json.results[0].geometry.location;
                    console.log(coord);
                     let sql = `UPDATE ruta SET coordenadas='${coord.lat}, ${coord.lng}'where idruta = '${idusuaria}'`;

                    console.log(sql)
                    con.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                    return err;
                    }
                    else {
                        let ruta = {
                            coordenadas: coord
                        }
                    return ruta;
                    }
                    })
   
                }
            });
            console.log(coord);
            return coord;

         }
         

       

        


}//fin controller





module.exports = controller;