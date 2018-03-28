var DataEncuestas = [];
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

    $(document).on('click','.btnEnc', function(){
        var n = parseInt($(this).html().split('')[0]) - 1;
        
        $('.botonCrearEncuesta').removeClass('disabled');
        $('.preguntaModalNuevo').html(DataEncuestas[n].pregunta);
        $('.opcion1ModalNuevo').html(DataEncuestas[n].opcion1);
        $('.opcion2ModalNuevo').html(DataEncuestas[n].opcion2);
        $('.opcion3ModalNuevo').html(DataEncuestas[n].opcion3);
        $('.opcion4ModalNuevo').html(DataEncuestas[n].opcion4);
        $('#modalSelEncuesta').modal('close');
        $('#modal2').modal('open');
        
    });

    socket.on('newEncuesta', function (data) {
        $('.btnSelEncuesta').html('');
        $.each(data, function(index, value) {
            $('.btnSelEncuesta').append(' <a class="btn-floating btn-large waves-effect waves-light red btnEnc">'+(index+1)+'</a>')
        }); 
        DataEncuestas = data;
        
        if (data != '') {
            $('.botonRespuestaEncuestas').css("cssText", "visibility: visible !important;");
        }
        if (datatoSend.rol == "Estudiante") {
            if (data == '') {
                $('.botonCrearEncuesta').addClass('disabled');
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