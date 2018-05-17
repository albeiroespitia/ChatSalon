var DataEncuestas = [];
var graficaDonas = [];
var EncuestaRespondidas = [];


function inicializarCanvas(n) {
    var oilCanvas = $('#grafica' + n);
    Chart.defaults.global.defaultFontSize = 24;

    window.oilData = {
        labels: [
            "A. "+DataEncuestas[n].opcion1,
            "B. "+DataEncuestas[n].opcion2,
            "C. "+DataEncuestas[n].opcion3,
            "D. "+DataEncuestas[n].opcion4,
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
        animateScale: true,
    

    };

    graficaDonas[n] = new Chart(oilCanvas, {
        type: 'doughnut',
        data: oilData,
        options: {chartOptions,
            legend: {
                display: true,
                align: 'right',
                layout: 'vertical',
                verticalAlign: 'top',
                x: 40,
                y: 0
            }
        }
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
    var htmlPag = '<li class="waves-effect"><a  class="btn-PagCanvas" onclick="mostrarCanvasHtml(' + (i + 1) + ');">' + (i + 1) + '</a></li>'
    $('#contenedorPagination').append(htmlPag)
    // Crear canvas
    var htmlCanvas = '<canvas id="grafica' + i + '" width="703" height="703" style="display: none; width: 703px; height: 703px;" class="chartjs-render-monitor"></canvas>';
    $('#contenedorCanvas').append(htmlCanvas);
}

// Manejar las paginaciones de canvas
$(document).on('click', '.btn-PagCanvas', function () {
    $('#contenedorPagination > li.active').removeClass('active');
    $(this).parent().addClass('active')
});

function mostrarCanvasHtml(n) { // N es la posicion del canvas a mostrar
    $('#contenedorCanvas canvas').css("display", "none"); // Ocultar todos los canvas
    $(`#grafica${n-1}`).css("display", "block");
    $('#preguntaCanvas').html(DataEncuestas[n-1].pregunta)
}

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
        $('.formEncuesta')[0].reset()
        $('#modal1').modal('close');

        $('input[name="preguntaInput"]').val('')
        $('input[name="opcion1Input"]').val('')
        $('input[name="opcion2Input"]').val('')
        $('input[name="opcion3Input"]').val('')
        $('input[name="opcion4Input"]').val('')

        socket.emit('sendEncuesta', dataEncuesta);
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
        DataEncuestas = data;
        var n = EncuestaRespondidas.length;

        $.each(data, function (index, value) { // btnEnc
            var htmlPg = '';
            if (index == n) {
                htmlPg = '<li class="waves-effect active"><a class="btnEnc">' + (index + 1) + '</a></li>'
            } else {
                htmlPg = '<li class="waves-effect"><a class="btnEnc">' + (index + 1) + '</a></li>'
            }
            $('.btnSelEncuesta').append(htmlPg)
            agregarCanvasHTML(index);
            inicializarCanvas(index);
        });

        if (data != '') {
            $('.botonRespuestaEncuestas').css("cssText", "visibility: visible !important;");
        }

        if (datatoSend.rol == "Estudiante") {
            console.log('DATAAAAAAA')
            console.log(data);
            if (data == '') {
                $('.botonCrearEncuesta').addClass('disabled');
            } else {
                MostrarEncuestaEnModal(n);
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
        console.log("Check")
        console.log(datatoSend)
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
        // 
        Materialize.toast('Envia la encuesta actual para seguir a la siguiente', 4000)
    });

    // --- EMIT
    $('.formsendREncuesta').submit(function (event) {
        event.preventDefault();

        // Enviamos la encuesta al servidor
        var idEncuesta = $("#idEncuesta").val();
        var selectedOption = $("input[name=group1]:checked").next().text();
        var selectedOptionid = $("input[name=group1]:checked").attr('id');
        socket.emit('sendEncuestaResponse', idEncuesta, selectedOption, datatoSend.nombre, selectedOptionid);
        EncuestaRespondidas.push({
            id: idEncuesta
        });
        $('.formsendREncuesta')[0].reset(); // Limpiar form
        // Nos situamos en la siguiente encuesta
        var a = $('.btnSelEncuesta > li.active');

        if (!a.is(':last-child')) {
            a.next().addClass('active');
            a.removeClass('active')
            a.addClass('disabled')
            var n = parseInt(a.next().children().html());
            MostrarEncuestaEnModal(n - 1);
        }

        if ('no' == hayEncuestaPendientes()) {
            $('#modal2').modal('close');
            $('.botonCrearEncuesta').addClass('disabled'); // Si no existen mas encuestas
        }
    })


function MostrarEncuestaEnModal(n) {
    if (datatoSend.rol == 'Estudiante') {
        $('.botonCrearEncuesta').removeClass('disabled');
        $('#idEncuesta').val(n);
        $('.preguntaModalNuevo').html(DataEncuestas[n].pregunta);
        $('.opcion1ModalNuevo').html(DataEncuestas[n].opcion1);
        $('.opcion2ModalNuevo').html(DataEncuestas[n].opcion2);
        $('.opcion3ModalNuevo').html(DataEncuestas[n].opcion3);
        $('.opcion4ModalNuevo').html(DataEncuestas[n].opcion4);
    }
}

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

$(document).on('click','.botonCrearEncuesta',function(){
    $('#modalopcion').modal('close');
})

$(document).on('click','.botonCrearQuiz',function(){
    $('#modalopcion').modal('close');
})


$("#example-basic").steps({
    headerTag: "h4",
    bodyTag: "section",
    transitionEffect: "slideLeft",
    autoFocus: true
});
