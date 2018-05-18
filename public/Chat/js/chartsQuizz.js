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


socket.on('dataCharts', function (respuestasQuizJSON) {
    var countr1 = 0;
    var countr2 = 0;
    var countr3 = 0;
    var countr4 = 0;
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
    }


    if (datatoSend.rol == "Estudiante") {
        var htmlDataCharts = `<div class="row">
                                <h6 class="grey-text lighten-3 left">Tu puntaje es: 0</h6>
                            </div>
                            <div class="row">
                                    <canvas id="densityChart" width="50" height="28"></canvas>
                            </div>	
                            <div class="row">
                            <!-- RESPUESTA INCORRECTA 
                                <i class="large red-text material-icons">close</i>
                                <h4 class="red-text">LA RESPUESTA ES LA C</h4>
                            -->
                                <i class="large green-text material-icons">check</i>
                                <h4 class="green-text">LA RESPUESTA ES LA C</h4>
                            </div>`
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
        var htmlDataCharts = `<div class="row">
                            </div>
                            <div class="row">
                                    <canvas id="densityChart" width="50" height="28"></canvas>
                            </div>	
                            <div class="row">
                            <!-- RESPUESTA INCORRECTA 
                                <i class="large red-text material-icons">close</i>
                                <h4 class="red-text">LA RESPUESTA ES LA C</h4>
                            -->
                                <i class="large green-text material-icons">check</i>
                                <h4 class="green-text">LA RESPUESTA ES LA C</h4>
                            </div>`
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
})