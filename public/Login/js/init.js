//$(document).ready(function() {
$('select').material_select();
$('.tooltipped').tooltip({
    delay: 50
});
$('.modal').modal();
$('.fila select').val(0);
$('.columna select').val(0);
$('.fila select').material_select();
$('.columna select').material_select();

// Socket
var socket = io.connect('/'); // Conectamos un socket para verificar si ya hay algun profesor logeado
var alumnos;
//});

setTimeout(function(){
    $('html, body').animate({
        scrollTop: $(".cardLogin").offset().top - 50
    }, 2000);
},1000)

