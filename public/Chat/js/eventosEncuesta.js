
sock.addEventListener('open',function(event){

    socket.on('checkButton', function (data) {
        console.log(data);
        if (data.encuestas[0] != undefined) {
            data.encuestas.forEach(function (value, index) {
                console.log(value.person)
                if (value.person == datatoSend.nombre) {
                    $('.botonCrearEncuesta').addClass('disabled');
                } else {
                    $('.botonCrearEncuesta').removeClass('disabled');
                }
            })
        }


    })

    socket.on('newResponseEncuesta', function (data, respuesta) {
        oilData.datasets.forEach(function (dataset) {
            dataset.data = dataset.data.map(function (value, index) {
                return respuesta[index];
            });
        });

        pieChart.update();

    })

    socket.on('newEncuesta', function (data) {
        if (data != '') {
            $('.botonRespuestaEncuestas').css("cssText", "visibility: visible !important;");
        }
        if (datatoSend.rol == "Estudiante") {
            if (data == '') {
                $('.botonCrearEncuesta').addClass('disabled');
            } else {
                $('.botonCrearEncuesta').removeClass('disabled');
                $('.preguntaModalNuevo').html(data.pregunta);
                $('.opcion1ModalNuevo').html(data.opcion1);
                $('.opcion2ModalNuevo').html(data.opcion2);
                $('.opcion3ModalNuevo').html(data.opcion3);
                $('.opcion4ModalNuevo').html(data.opcion4);
            }
        }

    })


        // --- EMIT
        $('.formsendREncuesta').submit(function (event) {
            event.preventDefault();
            var selectedOption = $("input[name=group1]:checked").next().text();
            var selectedOptionid = $("input[name=group1]:checked").attr('id');
            socket.emit('sendEncuestaResponse', selectedOption, datatoSend.nombre, selectedOptionid);
            sock.send('message', datatoSend)
            $('.botonCrearEncuesta').addClass('disabled');
            $('#modal2').modal('close');

        })



        $('.formEncuesta').submit(function (event) {
            event.preventDefault();
            console.log("habla valemia")


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

        })



   
});