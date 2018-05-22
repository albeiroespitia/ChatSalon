/*var densityData = {

    backgroundColor: ["#48dbfb", "#EAB543", "#eb3b5a", "#5f27cd", "#1B9CFC"],
    data: [12, 5, 23, 1] // <----- La cantidad de respuestas (DINAMICO)
};

var barChart = new Chart(densityCanvas, {
    type: 'bar',
    data: {
        labels: ["A", "B", "C", "D"],
        datasets: [densityData],
    },
    options: {
        legend: {
            display: false
        }
    }

});*/

socket.on('dataCharts', function (respuestasQuizJSON,respuestaCorrectaPapu) {
    
    console.log("tomalo papu")
    console.log(respuestasQuizJSON);
    var countr1 = 0;
    var countr2 = 0;
    var countr3 = 0;
    var countr4 = 0;
    var isCorrect;
    for (var i = 0; respuestasQuizJSON.respuestas.length > i; i += 1) {
        if (respuestasQuizJSON.respuestas[i].respuestaElejida == 'respuesta1') {
            countr1++;
            console.log("encontre 1")
        } else if (respuestasQuizJSON.respuestas[i].respuestaElejida == 'respuesta2') {
            countr2++;
            console.log("encontre 2")
        } else if (respuestasQuizJSON.respuestas[i].respuestaElejida == 'respuesta3') {
            countr3++;
            console.log("encontre 3")
        } else if (respuestasQuizJSON.respuestas[i].respuestaElejida == 'respuesta4') {
            countr4++;
            console.log("encontre 4")
        }

        if(respuestasQuizJSON.respuestas[i].nombreEstudiante == datatoSend.nombre){
            if(respuestasQuizJSON.respuestas[i].respuestaElejida == respuestaCorrectaPapu){
                isCorrect = true;
            }else{
                isCorrect = false;
            }
        }
    }

    var iconCorrect;
    var iconColor;
    if (datatoSend.rol == "Estudiante") {
        if(isCorrect){
            iconCorrect = 'check_circle_outline';
            iconColor = '#00c853'
        }else{
            iconCorrect = 'cancel'
            iconColor = '#d50000'
        }
        var htmlDataCharts = `<ul id="tabs-swipe-demo" class="tabs">
                                <li class="tab col l6"><a class="active" href="#test-swipe-1">Respuestas</a></li>
                                <li class="tab col l6"><a href="#test-swipe-2">Tablas de puntuacion</a></li>
                            </ul>
                            <div id="test-swipe-1" class="col s12 blue">
                                <div class="row" style="margin-top:20px;">
                                    <center>
                                        <canvas id="densityChart" width="50" height="28"></canvas>
                                    </center>        
                                </div>	
                                <div class="row">
                                    <i class="material-icons" style="
                                        font-size: 100px;
                                        color: ${iconColor}  !important;
                                    ">
                                    ${iconCorrect}
                                    </i>
                                </div>
                            </div>
                            <div id="test-swipe-2" class="col s12 red">
                                <div class="row">
                                    <div class="col s8 offset-s2">
                                        <table class="centered ranking responsive-table white-text">
                                            <h4 class="white-text">MEJORES PUNTUACIONES</h4>
                                            <tbody>
                                                <tr>
                                                    <td>Jose</td>
                                                    <td>1200</td>
                                                </tr>
                                                <tr>
                                                    <td>Guillermo</td>
                                                    <td>1000</td>
                                                </tr>
                                                <tr>
                                                    <td>Pedro</td>
                                                    <td>900</td>
                                                </tr>
                                                <tr>
                                                    <td> Alan</td>
                                                    <td>800</td>
                                                </tr>
                                                <tr>
                                                    <td> Jonathan</td>
                                                    <td>300</td>
                                                </tr>
                                                <tr>
                                                    <td> Johan</td>
                                                    <td>0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col s2"></div>
                                </div>
                            </div>`
        $('.tabs').tabs();
        $('ul.tabs').tabs({
            swipeable: true
        })
        $('.cardGrilla').html(htmlDataCharts);
        var densityCanvas = document.getElementById("densityChart");

        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 24;


        var densityData = {

            backgroundColor: ["#48dbfb", "#EAB543", "#eb3b5a", "#5f27cd", "#1B9CFC"],
            data: [countr1, countr2, countr3, countr4] // <----- La cantidad de respuestas (DINAMICO)
        };

        var barChart = new Chart(densityCanvas, {
            type: 'bar',
            data: {
                labels: ["A", "B", "C", "D"],
                datasets: [densityData],
            },
            options: {
                legend: {
                    display: false
                }
            }

        });
    } else if (datatoSend.rol == "Profesor") {
        var htmlDataCharts = `  <ul id="tabs-swipe-demo" class="tabs">
                                    <li class="tab col l6"><a class="active" href="#test-swipe-1">Respuestas</a></li>
                                    <li class="tab col l6"><a href="#test-swipe-2">Tablas de puntuacion</a></li>
                                </ul>
                                <div id="test-swipe-1" class="col s12 blue">
                                    <div class="row">
                                    </div>
                                    <div class="row">
                                        <center>
                                            <canvas id="densityChart" width="50" height="28"></canvas>
                                        </center>        
                                    </div>	
                                    <div class="row">
                                    <!-- RESPUESTA INCORRECTA 
                                        <i class="large red-text material-icons">close</i>
                                        <h4 class="red-text">LA RESPUESTA ES LA C</h4>
                                    
                                        <i class="large green-text material-icons">check</i>
                                        <h4 class="green-text">LA RESPUESTA ES LA C</h4>
                                    -->
                                    </div>
                                </div>
                                <div id="test-swipe-2" class="col s12 red">
                                    <div class="row">
                                    <div class="col s8 offset-s2">
                                        <table class="centered ranking responsive-table white-text">

                                            <h4 class="white-text">MEJORES PUNTUACIONES</h4>
                                            <tbody>
                                                
                                                <tr>
                                                    <td>Jose</td>
                                                    <td>1200</td>
                                                </tr>
                                                <tr>
                                                    <td>Guillermo</td>
                                                    <td>1000</td>
                                                </tr>
                                                <tr>
                                                    <td>Pedro</td>
                                                    <td>900</td>
                                                </tr>
                                                <tr>
                                                    <td> Alan</td>
                                                    <td>800</td>
                                                </tr>
                                                <tr>
                                                    <td> Jonathan</td>
                                                    <td>300</td>
                                                </tr>
                                                <tr>
                                                    <td> Johan</td>
                                                    <td>0</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col s2"></div>

                                </div>
                                </div>`
        
        $('ul.tabs').tabs({
            swipeable: true
        })        
        $('.switchquizz').html(htmlDataCharts);
        var densityCanvas = document.getElementById("densityChart");

        Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 24;


        var densityData = {

            backgroundColor: ["#48dbfb", "#EAB543", "#eb3b5a", "#5f27cd", "#1B9CFC"],
            data: [countr1, countr2, countr3, countr4] // <----- La cantidad de respuestas (DINAMICO)
        };

        var barChart = new Chart(densityCanvas, {
            type: 'bar',
            data: {
                labels: ["A", "B", "C", "D"],
                datasets: [densityData],
            },
            options: {
                legend: {
                    display: false
                }
            }

        });

        $('.nextQuestionQuizz').removeClass('disabled')
    }

    $('ul.tabs').tabs({
        swipeable: true
    })
})