var DataEncuestas = [];
var graficaDonas = [];
var EncuestaRespondidas = [];


function inicializarCanvas(n) {
    var oilCanvas = $('#grafica' + n);
    Chart.defaults.global.defaultFontSize = 24;

    window.oilData = {
        labels: [
            "A. " + DataEncuestas[n].opcion1,
            "B. " + DataEncuestas[n].opcion2,
            "C. " + DataEncuestas[n].opcion3,
            "D. " + DataEncuestas[n].opcion4,
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
        options: {
            chartOptions,
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
    $('#preguntaCanvas').html(DataEncuestas[n - 1].pregunta)
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

$(document).on('click', '.botonCrearEncuesta', function () {
    $('#modalopcion').modal('close');
})

$(document).on('click', '.botonCrearQuiz', function () {
    $('#modalopcion').modal('close');
})

$('.formQuiz').submit(function (e) {
    e.preventDefault()
    $('#modalpreguntas').modal('open');
    $('#modalQuizz').modal('close');
})

var colorsBackgroundPreguntas = ['#7e3ff2', '#0000d6', '#008b00', '#f47100', '#283593', '#1DE9B6']

/*setInsetInterval(function(){
    var item = colorsBackgroundPreguntas[Math.floor(Math.random()*colorsBackgroundPreguntas.length)];
    $('#modalpreguntas').css('background-color',item)
},4000)*/



function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}

function selVideo() {
    $('select').material_select();
    var htmlVideo;
    htmlVideo = `<div class="row">
                    <b><h5 class="center col s11">Video de YouTube</h5></b>
                    <b><a onClick="selCerrar();" class="rigth gray-text" href="#">X</a></b>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="material-icons prefix">ondemand_video</i>
                        <input required name="videoQuizz" id="videoQuizz" placeholder="https://www.youtube.com/watch?v=3e3NhzZddEA" type="text" class="validate">
                        <label for="videoQuizz" class="active">Video</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s5">
                        <i class="material-icons prefix">play_circle_filled</i>
                        <input required id="empiezaQuizz" placeholder="0:00" type="text" class="validate">
                        <label for="empiezaQuizz" class="active">Empieza en:</label>
                    </div>
                    <div class="input-field col s5 ">
                        <i class="material-icons prefix">stop</i>
                        <input required id="terminaQuizz" placeholder="0:30" type="text" class="validate">
                        <label for="terminaQuizz" class="active">Termina en:</label>
                    </div>
                    <a class=" btn-floating btn waves-effect waves-light green"><i class="material-icons">check</i></a>
                </div>`;
    $('.adjArchivo').html(htmlVideo);
}


function selCerrar() {
    var htmlNormal = `<div class="row">
                        <b>
                            <h5 class="center">Añadir</h5>
                        </b>
                      </div>
                        <a onClick="selVideo();" class="col s5 offset-s1 waves-effect waves-light btn-large">
                        <i class="material-icons left">ondemand_video</i>VIDEO</a>`;
    $('.adjArchivo').html(htmlNormal);
}

$('.buttonaddPreguntaQuizz').click(function () {
    $('#modalNewPregunta').modal('open');
})

var checkboxes = $("input[type='checkbox']"),
    submitButt = $(".submitPreguntaButton");

submitButt.attr("disabled", !checkboxes.is(":checked"));

checkboxes.click(function () {
    submitButt.attr("disabled", !checkboxes.is(":checked"));
});

$('.formQuiz').submit(function (e) {
    e.preventDefault();
    var tituloQuiz = $('#tituloQuiz').val()
    var descriptionQuiz = $('#descriptionQuizz').val()
    var videoQuiz = $('#videopregunta').val()
    socket.emit('sendDataQuiz', tituloQuiz, descriptionQuiz, videoQuiz);
})

$('.formCrearPregunta').submit(function (e) {
    e.preventDefault();
    var preguntaQuiz = $('#preguntaQuizz').val()
    var selectTime = $('#selectTimePregunta').val()
    var puntosQuizz = $('#puntosQuizz').val()
    var respuesta1Input = $('#respuesta1Input').val()
    var respuesta2Input = $('#respuesta2Input').val()
    var respuesta3Input = $('#respuesta3Input').val()
    var respuesta4Input = $('#respuesta4Input').val()
    var respuestaCorrecta;
    var videolink;
    var startVideo;
    var endVideo;
    if ($('#respuesta1').is(":checked")) {
        respuestaCorrecta = 'respuesta1';
    } else if ($('#respuesta2').is(":checked")) {
        respuestaCorrecta = 'respuesta2';
    } else if ($('#respuesta3').is(":checked")) {
        respuestaCorrecta = 'respuesta3';
    } else if ($('#respuesta4').is(":checked")) {
        respuestaCorrecta = 'respuesta4';
    }

    if ($('#videoQuizz').val()) {
        var videolink = $('#videoQuizz').val()
        var startVideo = $('#empiezaQuizz').val()
        var endVideo = $('#terminaQuizz').val()
        var dataPreguntaFull = {
            preguntaQuiz: preguntaQuiz,
            selectTime: selectTime,
            puntosQuizz: puntosQuizz,
            respuesta1Input: respuesta1Input,
            respuesta2Input: respuesta2Input,
            respuesta3Input: respuesta3Input,
            respuesta4Input: respuesta4Input,
            respuestaCorrecta: respuestaCorrecta,
            videolink: videolink,
            startVideo: startVideo,
            endVideo: endVideo
        }
    } else {
        var dataPreguntaFull = {
            preguntaQuiz: preguntaQuiz,
            selectTime: selectTime,
            puntosQuizz: puntosQuizz,
            respuesta1Input: respuesta1Input,
            respuesta2Input: respuesta2Input,
            respuesta3Input: respuesta3Input,
            respuesta4Input: respuesta4Input,
            respuestaCorrecta: respuestaCorrecta
        }
    }


    socket.emit('sendDataPreguntasQuiz', dataPreguntaFull);

    $('#modalNewPregunta').modal('close')
    $('#preguntaQuizz').val('')
    $('#puntosQuizz').val('')
    $('#respuesta1Input').val('')
    $('#respuesta2Input').val('')
    $('#respuesta3Input').val('')
    $('#respuesta4Input').val('')
    $('#videoQuizz').val('')
    $('#empiezaQuizz').val('')
    $('#terminaQuizz').val('')
    $('#respuesta1').prop('checked', false);
    $('#respuesta2').prop('checked', false);
    $('#respuesta3').prop('checked', false);
    $('#respuesta4').prop('checked', false);
})

socket.on('nuevaPregunta', function (preguntasArr) {
    var htmlPregunta = '';
    preguntasArr.forEach(function (element) {
        htmlPregunta += `<div class="cardPregunta">
                            <p class="tituloPregunta">${element.preguntaQuiz}</p>
                            <p class="descripcionPregunta">Puntaje: ${element.puntosQuizz}</p>
                        </div>`
    })
    $('.preguntasGeneral').html(htmlPregunta);
})

$(document).on('click', '.startQuizz', function () {
    if ($('.preguntasGeneral').html() == '') {
        alert('No has creado ninguna pregunta')
    } else {
        socket.emit('check3users');
        socket.on('check3userResponse',function(is3userconnected){
            if(is3userconnected){
                socket.emit('starQuiz')
            }else{
                Materialize.Toast.removeAll();
                Materialize.toast('Se necesitan al menos 3 estudiantes logeados para comenzar el quiz', 3000)
            }
        })
    }
})

var tituloQuizJSONlocal;
var preguntasQuizJSONlocal;
var grillaEstudiantes;
var buttonBackup;
var buttonclicksnumber = 0;

socket.on('startQuizResponse', function (tituloQuizJSON, preguntasQuizJSON) {
    grillaEstudiantes = $('.cardGrilla').html();
    buttonBackup = $('.comenzarQuizzSection').html();
    tituloQuizJSONlocal = tituloQuizJSON;
    preguntasQuizJSONlocal = preguntasQuizJSON;
    listQuestions(tituloQuizJSON, preguntasQuizJSON, 0);
})


function listQuestions(tituloQuizJSON, preguntasQuizJSON, iterateNumber) {
    if (datatoSend.rol == "Estudiante") {
        var htmlPreguntaQuiz = `<div class="progressbar"></div>
                            <div class="row">
                                <h5 class="center white-text flow-text">${preguntasQuizJSON[iterateNumber].preguntaQuiz}</h5>
                            </div>
                            <div class="row">
                                <!--	<iframe width="620" height="215" src="http://www.youtube.com/embed/0Bmhjf0rKe8?start=11&end=14" frameborder="0" allow="autoplay; encrypted-media"
                                    allowfullscreen></iframe> -->
                            </div>
                            <div class="middle">
                                <div class="row">
                                    <div class="col s6">
                                        <label>
                                            <input id="radiobutton1Respuesta" type="radio" name="radio" />
                                            <div onclick="elegirRes('A')" class="opcionAQuizz box3">
                                                <span>A. ${preguntasQuizJSON[iterateNumber].respuesta1Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="col s6">
                                        <label>
                                            <input id="radiobutton2Respuesta" type="radio" name="radio" />
                                            <div onclick="elegirRes('B')" class="opcionBQuizz box3">
                                                <span>B. ${preguntasQuizJSON[iterateNumber].respuesta2Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col s6">
                                        <label>
                                            <input id="radiobutton3Respuesta" type="radio" name="radio" />
                                            <div onclick="elegirRes('C')" class="opcionCQuizz box3">
                                                <span>C. ${preguntasQuizJSON[iterateNumber].respuesta3Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="col s6">
                                        <label>
                                            <input id="radiobutton4Respuesta" type="radio" name="radio" />
                                            <div onclick="elegirRes('D')" class="opcionDQuizz box3">
                                                <span>D. ${preguntasQuizJSON[iterateNumber].respuesta4Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>`
        $('.cardGrilla').html(htmlPreguntaQuiz);
        $('.cardGrilla').attr('style', 'background-color: #343436 !important');


        var selectTimeTotal;
        var countTime = 0;
        var flag = 0;
        $('.progressbar').html(`<div class="progress">
                                    <div class="determinate" style="width: 0%"></div>
                                </div>`)
        var handlingTime = workerTimer.setInterval(function () {
            countTime = countTime + 0.1;
            selectTimeTotal = (countTime / preguntasQuizJSON[iterateNumber].selectTime) * 100;
            $('.determinate').css({
                'width': selectTimeTotal + '%'
            })
            if (selectTimeTotal >= 100) {
                console.log("entro al clearinterval")
   
                console.log('vale mia la respuesta es esta' + respuestaElejida);
                socket.emit('respuestaUser', datatoSend, respuestaElejida,buttonclicksnumber)
                workerTimer.clearInterval(handlingTime);
            }

            if ((selectTimeTotal >= 70) && (flag == 0)) {
                flag = 1;
                $('.determinate').css({
                    'background-color': '#c62828'
                });
            }
        }, 100)



    } else if (datatoSend.rol == 'Profesor') {
        $('.comenzarQuizzSection').html(`<center>
                                            <button href="#!" class="modal-action waves-effect waves-green btn-large disabled nextQuestionQuizz">Siguiente</button>
                                        </center>`);
        var htmlPreguntaQuiz = `<div class="progressbar"></div>
                            <div class="row">
                                <h5 class="center white-text flow-text">${preguntasQuizJSON[iterateNumber].preguntaQuiz}</h5>
                            </div>
                            <div class="row">
                                <!--	<iframe width="620" height="215" src="http://www.youtube.com/embed/0Bmhjf0rKe8?start=11&end=14" frameborder="0" allow="autoplay; encrypted-media"
                                    allowfullscreen></iframe> -->
                            </div>
                            <div class="middle">
                                <div class="row">
                                    <div class="col s6">
                                        <label>
                                            <input type="radio" name="radio" disabled="disabled" />
                                            <div class="opcionAQuizz box3">
                                                <span>A. ${preguntasQuizJSON[iterateNumber].respuesta1Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="col s6">
                                        <label>
                                            <input type="radio" name="radio" disabled="disabled" />
                                            <div class="opcionBQuizz box3">
                                                <span>B. ${preguntasQuizJSON[iterateNumber].respuesta2Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col s6">
                                        <label>
                                            <input type="radio" name="radio" disabled="disabled" />
                                            <div  class="opcionCQuizz box3">
                                                <span>C. ${preguntasQuizJSON[iterateNumber].respuesta3Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="col s6">
                                        <label>
                                            <input type="radio" name="radio" disabled="disabled" />
                                            <div class="opcionDQuizz box3">
                                                <span>D. ${preguntasQuizJSON[iterateNumber].respuesta4Input}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>`
        var switchquizzBackup = $('.switchquizz').html();
        $('.switchquizz').html(htmlPreguntaQuiz);
        $('.switchquizz').attr('style', 'background-color: #343436 !important');


        var selectTimeTotal;
        var countTime = 0;
        var flag = 0;
        $('.progressbar').html(`<div class="progress">
                                    <div class="determinate" style="width: 0%"></div>
                                </div>`)
        var handlingTime = workerTimer.setInterval(function () {
            countTime = countTime + 0.1;
            selectTimeTotal = (countTime / preguntasQuizJSON[iterateNumber].selectTime) * 100;
            $('.determinate').css({
                'width': selectTimeTotal + '%'
            })
            if (selectTimeTotal >= 100) {
                workerTimer.clearInterval(handlingTime);
            }

            if ((selectTimeTotal >= 70) && (flag == 0)) {
                flag = 1;
                $('.determinate').css({
                    'background-color': '#c62828'
                });
            }
        }, 100)
    }
}



$(document).on('click', '.nextQuestionQuizz', function () {
    buttonclicksnumber++;
    //listQuestions(tituloQuizJSONlocal,preguntasQuizJSONlocal,buttonclicksnumber)
    socket.emit('nextQuestionQuiz', buttonclicksnumber)
})

socket.on('nextQuestionQuizResponse', function (buttonclicksnumber) {
    listQuestions(tituloQuizJSONlocal, preguntasQuizJSONlocal, buttonclicksnumber)
})

socket.on('finishingQuiz', function (puntajes) {
    socket.emit('showCharts', puntajes);

    $('.nextQuestionQuizz').html('Finalizar Quiz');
    $('.nextQuestionQuizz').addClass('quizfinished');
    $('.nextQuestionQuizz').removeClass('nextQuestionQuizz');
    $('.cardGrilla').attr('style', 'background-color: #eee !important');
    
})

socket.on('showChartsResponse', function (puntajes) {
    var variablefinal;
    if (datatoSend.rol == "Estudiante") {
        var dataFinalCharts =  `<div class="row">
                                    <img width="300" src="https://i.pinimg.com/originals/69/e0/6a/69e06a096ec5e14eefa1b7ff72fddf7f.gif"/>
                                </div>
                                <div class="row">
                                    <canvas id="densityChart2" width="50" height="22"></canvas>
                                </div>`
                                
        $('.cardGrilla').html(dataFinalCharts)
        $('.cardGrilla').attr('style', 'background-color: #f7f7f7 !important');
        variablefinal = 'densityChart2'
    } else if (datatoSend.rol == "Profesor") {
        var dataFinalCharts = `<div class="row">
                                        <center>
                                            <img width="300" src="https://i.pinimg.com/originals/69/e0/6a/69e06a096ec5e14eefa1b7ff72fddf7f.gif"/>
                                        </center>
                                    </div>
                                    <div class="row">
                                        <center>
                                            <canvas id="densityChart3" width="30" height="12"></canvas>
                                        </center>
                                    </div> 
                                </div>`
        $('.switchquizz').html(dataFinalCharts);
        $('.switchquizz').attr('style', 'background-color: #f7f7f7 !important');
        //$('#densityChart2').attr('style', 'height: 240px !important');
        //$('#densityChart2').attr('style', 'width: 70% !important');
        variablefinal = 'densityChart3'

    }

    var densityCanvas = document.getElementById(variablefinal);

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 34;

    var densityData = {

        backgroundColor: ["#ced6e0", "#feca57", "#e77f67"],
        data: [240, 320, 180] // PUNTACION DE LOS 3 PRIMERO EN ESTE ORDEN: 2,1,3
    };

    var barChart = new Chart(densityCanvas, {
        type: 'bar',

        data: {
            labels: [`2. ${puntajes[1].nombreEstudiante}`, `1. ${puntajes[0].nombreEstudiante}`, `3. ${puntajes[2].nombreEstudiante}`],
            datasets: [densityData],
        },
        options: {
            scaleShowValues: true,
            scales: {
                yAxes: [{
                    display: false
                }],
                xAxes: [{
                    display: false,
                    categoryPercentage: 1.0,
                    barPercentage: 1.0
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "#666666";
                    ctx.textBaseline = 'bottom';

                    console.log("SAAAAD")
                    console.log(this.data.labels)
                    var nombresitos = this.data.labels;

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = nombresitos[index];

                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            },
            line: {
                dataLabels: {
                    enabled: true
                }
            }
        }

    });



})

$(document).on('click', '.quizfinished', function () {
    $('.comenzarQuizzSection').html(buttonBackup);
    $('#modalpreguntas').modal('close');
    $('#modalopcion').modal('close');
    socket.emit('finishedquiz')
})

socket.on('finishedquizresponse', function () {
    console.log("sdasdasdasdasdasdasdasdasdentrooooooo")
    console.log($('.cardGrilla').html());
    $('.cardGrilla').html(grillaEstudiantes);
    $('.cardGrilla').attr('style', 'background-color: white !important');
    console.log("TYa quite html, por que el quiz ya finalizo")
})

var respuestaElejida;

function elegirRes(opcion) {
    console.log("hierba mala pago mi pana esta vaina esta bien bacana tu fumas yo fumo fumamos los dos " + opcion);
    if (opcion == 'A') {
        respuestaElejida = 'respuesta1';
    }
    if (opcion == 'B') {
        respuestaElejida = 'respuesta2';
    }
    if (opcion == 'C') {
        respuestaElejida = 'respuesta3';
    }
    if (opcion == 'D') {
        respuestaElejida = 'respuesta4';
    }
}