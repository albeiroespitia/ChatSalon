$(document).ready(function() {
    $('select').material_select();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
    
    $('.fila select').val(0);
    $('.columna select').val(0);
    $('.fila select').material_select();
    $('.columna select').material_select();
});