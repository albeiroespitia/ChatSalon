var alumnos;
var socket;

$(document).ready(function () {

    socket = io.connect('/'); // Conectamos un socket para verificar si ya hay algun profesor logeado
    

    /* Revisamos cuantas posiciones escojio el profesor para las sillas */
    socket.on('checkLabel', function (data) { 
        ActualizarMatriz(data.estudiante);
    })


    /* Revisa si hay algun profesor logeado y si lo hay responde con las filas y las columnas que escogio*/
    async function handleCheckTeacher () { 
        const response = await fetch('/check', {
            method: "POST"
        });
        const responseJson = await response.json();
        asignarRol(responseJson);
    }
    handleCheckTeacher(); 

    socket.on('profesorLogeado',function(responseJson){
        asignarRol(responseJson)
    })

    socket.on('disconnectProf',function(responseJson){
        asignarRol(responseJson)

        var filHTML;
        var colHTML;
        filHTML = '<select>';
        for (var i = 0; i <= 7; i++) {
            filHTML += `<option value='${i}'>${i}</option>`
        }
        filHTML += '</select>'

        colHTML = '<select>';
        for (var j = 0; j <= 7; j++) {
            colHTML += `<option value='${j}'>${j}</option>`
        }
        colHTML += '</select>'

        $('.fila').html(filHTML)
        $('.columna').html(colHTML)
        $('.fila').show();
        $('.columna').show();
        $('.fila select').material_select();
        $('.columna select').material_select();
    })

    $('#loginForm').submit(function (event) {
        event.preventDefault();
        datosFormularioLogin();
    })

});


/* Revisa los datos ingresados y los guarda en el sessionStorage del navegador*/
function datosFormularioLogin(){ 
    if (($('.fila select').val() == 0) || ($('.columna select').val() == 0)) {
        Materialize.toast('Aun no has seleccionado un asiento', 3000, 'rounded') 
    } else {
        var data = {
            rol: $(".selectRol option:selected").text(),
            nombre: $(".nombreForm").val(),
            fila: $(".fila option:selected").text(),
            columna: $(".columna option:selected").text(),
            avatar: $(".avatar option:selected").val()
        }
        sessionStorage.setItem("datos", JSON.stringify(data));
        socket.disconnect();
        window.location.replace("/chat");
    }
}



function asignarRol(responseJson){
    alumnos = responseJson;
    if (responseJson.profesorServer == "true") {
        var filHTML;
        var colHTML;
        $('.selectRol').html(`<select class="rolSelect">
        <option value='Estudiante'>Estudiante</option>
        </select>`)

        filHTML = '<select>';
        for (var i = 0; i <= responseJson.fil; i++) {
            filHTML += `<option value='${i}'>${i}</option>`
        }
        filHTML += '</select>'

        colHTML = '<select>';
        for (var j = 0; j <= responseJson.col; j++) {
            colHTML += `<option value='${j}'>${j}</option>`
        }
        colHTML += '</select>'

        $('.fila').html(filHTML)
        $('.columna').html(colHTML)
        // Actualizar sillas ocupadas
        socket.emit('sillasOcupadas');
        // Dejar solo el boton de Iniciar 
        $('#btn-conf').html('<button class="waves-effect waves-light btn modal-trigger red accent-1 btnPosicion" href="#modalPosicion"><i class="material-icons right">find_replace</i>Elegir posicion </button><button type="submit" class="waves-effect waves-light btn orange darken-1"><i class="material-icons right">send</i>Iniciar</a></button>');
        // Ocutar botones fila y col
        $('.fila').hide();
        $('.columna').hide();

    } else {
        $('.selectRol').html(`<select class="rolSelect">
        <option value='Profesor'>Profesor</option>
        </select>`)
        $('.fila select').material_select();
        $('.columna select').material_select();
        // Dejar solo el boton de Iniciar 
        $('#btn-conf').html('<button type="submit" class="waves-effect waves-light btn  orange darken-1"><i class="material-icons right">send</i>Iniciar</a></button>')

    }
    $('select').material_select();
}



/*  Actualiza la matriz que le aparece al estudiante a la hora de elejir un asiento*/
function ActualizarMatriz(estudiantes) { 
    var tablaHTML = "";
    for (var i = 1; i <= alumnos.fil; i++) {
        tablaHTML += "<tr>";
        for (var j = 1; j <= alumnos.col; j++) {
            if ( !sillaOcupada(i, j, estudiantes) ) {
                tablaHTML += '<td onclick="anotarPosicion(' + i + ',' + j + ')" class="box"><center> <i class="green-text material-icons">weekend</i> </center></td>';
            } else {
                tablaHTML += '<td class="box"><center> <i class="red-text material-icons">weekend</i> </center></td>';
            }
        }
        tablaHTML += "</tr>";
    }
    $('#tablem').html(tablaHTML);
}

/*  Actualiza las sillas ocupadas */
function sillaOcupada(fila, columna, estudiantes) { 
    var sw = false; 
    if (estudiantes.length > 0) {
        estudiantes.forEach(function (student) {
            if ((student.fila == fila) && (student.columna == columna)) {
                sw = true;
            }
        })
    }
    return sw;
}