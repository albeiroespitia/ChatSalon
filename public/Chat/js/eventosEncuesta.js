var DataEncuestas = [];
var graficaDonas = [];
var EncuestaRespondidas = [];


function inicializarCanvas(n) {
    var oilCanvas = $('#grafica' + n);
    Chart.defaults.global.defaultFontSize = 24;

    window.oilData = {
        labels: [
            "A.",
            "B.",
            "C.",
            "D.",
        ],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
                "#f1c40f",
                "#e74c3c",
                "#2980b9",
                "#2ecc71"
            ],
            borderWidth: 2
        }]

    };

    var chartOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 50,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        responsive: true,
        maintainAspectRatio: true,
        showScale: true,
        animateScale: true

    };

    graficaDonas[n] = new Chart(oilCanvas, {
        type: 'doughnut',
        data: oilData,
        options: chartOptions
    });

}

function ActualizarCanvas(opciones, n) {

    graficaDonas[n].data.datasets.forEach(function (dataset) {
        dataset.data = dataset.data.map(function (value, index) {
            return opciones[index];
        });
    });
    graficaDonas[n].update();
}

function agregarCanvasHTML(i) {

    $('#contenedorPagination').append(' <a onclick="mostrarCanvasHtml(' + (i + 1) + ');" class="btn-floating btn waves-effect waves-light red btnEnc">' + (i + 1) + '</a>')
    // Crear canvas
    var htmlCanvas = '<canvas id="grafica' + i + '" width="703" height="703" style="display: none; width: 703px; height: 703px;" class="chartjs-render-monitor"></canvas>';
    $('#contenedorCanvas').append(htmlCanvas);
}


function mostrarCanvasHtml(n) { // N es la posicion del canvas a mostrar
    $('#contenedorCanvas canvas').css("display", "none"); // Ocultar todos los canvas
    $(`#grafica${n-1}`).css("display", "block");
}

sock.addEventListener('open', function (event) {
    // <------- EMIT ---->

    // Crear encuesta con el rol de profesor
    $('.formEncuesta').submit(function (event) {
        event.preventDefault();
        var pregunta = $('input[name="preguntaInput"]').val()
        var opcion1 = $('input[name="opcion1Input"]').val()
        var opcion2 = $('input[name="opcion2Input"]').val()
        var opcion3 = $('input[name="opcion3Input"]').val()
        var opcion4 = $('input[name="opcion4Input"]').val()

        var dataEncuesta = {
            pregunta: pregunta,
            opcion1: opcion1,
            opcion2: opcion2,
            opcion3: opcion3,
            opcion4: opcion4
        }

        $('#modal1').modal('close');

        $('input[name="preguntaInput"]').val('')
        $('input[name="opcion1Input"]').val('')
        $('input[name="opcion2Input"]').val('')
        $('input[name="opcion3Input"]').val('')
        $('input[name="opcion4Input"]').val('')

        socket.emit('sendEncuesta', dataEncuesta);
        sock.send('message', datatoSend)
        // Crear pagination 
        var numCanvas = $('#contenedorCanvas canvas').length;
        agregarCanvasHTML(numCanvas);
        inicializarCanvas(numCanvas);


    })

    // Escuchar que hay una nueva encuesta
    socket.on('newEncuesta', function (data, respuesta) {
        $('.btnSelEncuesta').html('');
        $('#contenedorPagination').html('');
        $('#contenedorCanvas').html('');
        $.each(data, function (index, value) {
            $('.btnSelEncuesta').append(' <a class="btn-floating btn-large waves-effect waves-light red btnEnc">' + (index + 1) + '</a>')
            agregarCanvasHTML(index);
            inicializarCanvas(index);
        });
        DataEncuestas = data;

        if (data != '') {
            $('.botonRespuestaEncuestas').css("cssText", "visibility: visible !important;");
        }
        if (datatoSend.rol == "Estudiante") {
            if (data == '') {
                $('.botonCrearEncuesta').addClass('disabled');
            } else {
                $('.botonCrearEncuesta').removeClass('disabled');
            }
        }
        // ----------------------------------------
        $.each(respuesta, function (index, value) { // Actualiza todos los canvas del DOM
            ActualizarCanvas(value, index);
        });

    })

    // 
    socket.on('checkButton', function (data) {

        if (data.encuestas[0] != undefined) {
            data.encuestas.forEach(function (value, index) {

                if (value.person == datatoSend.nombre) {
                    $('.botonCrearEncuesta').addClass('disabled');
                } else {
                    $('.botonCrearEncuesta').removeClass('disabled');
                }
            })
        }


    })

    socket.on('newResponseEncuesta', function (data, respuesta) {
        $.each(respuesta, function (index, value) { // Actualiza todos los canvas del DOM
            ActualizarCanvas(value, index);
        });

    })

    $(document).on('click', '.btnEnc', function () {
        if (datatoSend.rol == 'Estudiante') {
            var n = parseInt($(this).html().split('')[0]) - 1;
            $('.botonCrearEncuesta').removeClass('disabled');
            $('#idEncuesta').val(n);
            $('.preguntaModalNuevo').html(DataEncuestas[n].pregunta);
            $('.opcion1ModalNuevo').html(DataEncuestas[n].opcion1);
            $('.opcion2ModalNuevo').html(DataEncuestas[n].opcion2);
            $('.opcion3ModalNuevo').html(DataEncuestas[n].opcion3);
            $('.opcion4ModalNuevo').html(DataEncuestas[n].opcion4);
            $('#modalSelEncuesta').modal('close');
            $('#modal2').modal('open');
        }
    });
    // --- EMIT
    $('.formsendREncuesta').submit(function (event) {
        event.preventDefault();
        var idEncuesta = $("#idEncuesta").val();
        var selectedOption = $("input[name=group1]:checked").next().text();
        var selectedOptionid = $("input[name=group1]:checked").attr('id');
        socket.emit('sendEncuestaResponse', idEncuesta, selectedOption, datatoSend.nombre, selectedOptionid);
        sock.send('message', datatoSend)
        EncuestaRespondidas.push({
            id: idEncuesta
        });

        if ('no' == hayEncuestaPendientes()) {
            $('.botonCrearEncuesta').addClass('disabled'); // Si no existen mas encuestas
        }
        $('#modal2').modal('close');
    })
})


function hayEncuestaPendientes() {
    var sw = 'no';
    var TotalEncuestas = parseInt(DataEncuestas.length);
    var Respondidas = parseInt(EncuestaRespondidas.length);
    var pendientes = TotalEncuestas - Respondidas;
    if (pendientes > 0) {
        sw = 'si';
    }
    return sw;
}