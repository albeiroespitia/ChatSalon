//import 'funciones.js'
socket.on('profesorLogeado', function (responseJson) {
    asignarRol(responseJson)
})

socket.on('disconnectProf', function (responseJson) {
    asignarRol(responseJson)
    reiniciarSelect();
})

/* Revisamos cuantas posiciones escogio el profesor para las sillas */
socket.on('checkLabel', function (data) {
    ActualizarMatriz(data.estudiante);
})

$('#loginForm').submit(function (event) {
    event.preventDefault();
    datosFormularioLogin();
})