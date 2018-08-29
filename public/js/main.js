$(document).ready(function () {

    $.validate({//validador formulario
        lang: 'es',
        modules : 'security'
    });
    
    /*var btnRegistro = $('#boton-registro');
    var btnCrear = $('#boton-crear');
    var nombre_usuaria = $('#nombre');
    var apell_usuaria = $('#apellidos');
    var fecha_usuaria = $('#fecha');
    var interes_usuaria = $('#intereses');
    var foto_usuaria = $('#foto');
    var email_usuaria = $('#mail');*/
    var loginButton = $('#loginButton');
    var loginForm = $('#loginForm');
    var invitationForm = $('#frominvitation');
    
//----------------- REGISTRO Y LOGIN --------------

    //Login
    loginButton.on('click', function () {
        let data = loginForm.serialize();
        $.post('/notalone/login', data, function (res) {
            console.log(res)
        });
    });

    //LogOut
    $('#logout').on('click',function(){
        $.get('/notalone/logout', function () {
            console.log("logout")
        })
    })

    //Registro de usuaria
    $('#formularioContacto').on('submit', function (e) {
        e.preventDefault();
        let formulario = new FormData($('#formularioContacto')[0]);
        //console.log(formulario);
        $.ajax({
            type: 'POST',
            url: '/notalone/register',
            data: formulario,
            contentType:false,
            cache:false,
            processData: false
            
        });
    });

    //Envío de invitaciones
    $('#btninvitation').on('click', function () {
        let data = invitationForm.serialize();
        $.post('/notalone/invitacion', data, function (res) {
            console.log(res)
        });
    });

//----------------- CRUD ------------------------------

    //Agregar nueva usuaria (CRUD)
    $('#formularioCrear').on('submit', function (e) {
        e.preventDefault();
        let formulario = new FormData($('#formularioCrear')[0]);
        //console.log(formulario);
        $.ajax({
            type: 'POST',
            url: '/notalone/add',
            data: formulario,
            contentType:false,
            cache:false,
            processData: false
            
        });
    });

    //mostrar resultado de las insersiones
    var lista = $('#lista-user');
    
    $.get('http://localhost:3000/notalone/', function (usuarias) {
        console.log(usuarias)
                        
        usuarias.forEach(usuaria => {
            let miUsuaria ='<tr><td>"'+usuaria.id+'"</td><td>"'+usuaria.nombre+'"</td><td>"'+usuaria.apellidos+'"</td><td>"'+usuaria.email+'"</td><td id='+usuaria.id+'><button class="btn btn-danger ml-3 eliminar"> Eliminar </button><button  class="btn btn-info ml-3 nueva_usuaria"> Ver </button><button  class="btn ml-3 btn-success modificar"> Modificar </button></td></tr>'
            lista.append(miUsuaria);
        });
    });//fin mostrar

    //botón ver detalles de usuaria
    $(".container").on('click','.nueva_usuaria', function () {
       
        window.location.href="CRUD/detalles?id="+$(this).parent().attr('id');
    });

    //botón modificar datos usuaria
    $(".container").on('click','.modificar', function () {
       
        window.location.href="CRUD/modificacion?id="+$(this).parent().attr('id');
    });

    //botón eliminar usuaria
    $(".container").on('click','.eliminar', function () {

        let id_usuaria = $(this).parent().attr('id');
        let fila = $(this).parent().parent();
        
       
        $.post('http://localhost:3000/notalone/delete', { id: id_usuaria}, function () {

            fila.remove();
        
        })
    });
    //Update Usuaria
    $(".container").on('click','.boton-modificar', function () {

        let id_usuaria = $(this).attr('id');
        let interest = $('#intereses').val();
        let email = $('#email').val();
        //console.log(formulario);
        
        $.post('http://localhost:3000/notalone/update', { id: id_usuaria, interest:interest,email:email}, function () {

        })
    });

    //Buscador
    // Write on keyup event of keyword input element
	$("#kwd_search").keyup(function(){
		// When value of the input is not blank
		if( $(this).val() != "")
		{
			// Show only matching TR, hide rest of them
			$("#my-table tbody>tr").hide();
			$("#my-table td:contains-ci('" + $(this).val() + "')").parent("tr").show();
		}
		else
		{
			// When there is no input or clean again, show everything back
			$("#my-table tbody>tr").show();
		}
    });
    
// jQuery expression for case-insensitive filter
$.extend($.expr[":"], 
{
    "contains-ci": function(elem, i, match, array) 
	{
		return (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}

});//fin buscador

// --------------------- RUTAS ---------------------------   

//Botón publicar ruta
$('#btnruta').on('click',function(){
    let data = $('#formruta').serialize();
    $.post('/notalone/createruta', data, function (res) {
        console.log(res)
    })
})

$('#search').on('click',function(){
    $.post('/notalone/coord',{ciudad:$('#ciudad').val()},function (res) {
        console.log(res)
    })

})





});//fin document


