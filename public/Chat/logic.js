$(document).ready(function() {

    if(sessionStorage.getItem("datos") == null){
        window.location.replace("/");
    }
    


    var datatoSend = JSON.parse(sessionStorage.getItem("datos"));
    var socket = io.connect('/');
    console.log(window.location.hostname)
    var sock = new WebSocket("ws://"+window.location.hostname+":3001/");

    sock.onopen = function(event){

    socket.on('disconnectAllSockets',function(){
        socket.emit('forceDisconnect'); 
        window.location.replace("/");
    })

    socket.on('ProfesorisNotTypingAll',function(data){
        $('.boxProfesor #wave').html('');
    })

    socket.on('ProfesorTypingAll',function(data){
        $('.boxProfesor #wave').html(`<span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>`)
    })

    socket.on('EstudianteisNotTypingAll',function(data){
        var size = document.getElementById("tablem").rows[data.fila-1].cells[data.columna-1].childNodes.length;
        var x = document.getElementById("tablem").rows[data.fila-1].cells[data.columna-1].childNodes[size-1];
        x.innerHTML = '';
    })

    socket.on('EstudianteTypingAll',function(data){
        var size = document.getElementById("tablem").rows[data.fila-1].cells[data.columna-1].childNodes.length;
        var x = document.getElementById("tablem").rows[data.fila-1].cells[data.columna-1].childNodes[size-1];
        x.innerHTML = `<span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>`;
    })

    if(datatoSend.rol == "Profesor"){
        socket.emit('loginProfesor',datatoSend);
    }else if(datatoSend.rol == "Estudiante"){
        socket.emit('loginEstudiante',datatoSend)
    }

    socket.on('sendMatrixSize',function(fila,columna){
        $('.cuerpoTabla').html("");
        var html = "";
        for(var f=1; f<=fila; f++ ){
            html+="<tr>"
            for(var c=1; c<=columna; c++){
                html+="<td class='box'> </td>";
            }
            html+="</tr>";
        } 
        $('.cuerpoTabla').html(html);
        $('.box').hover(function () {
                var nombre = $(this).children("span").html();
                $(this).children("span").html('<marquee scrollamount="4">' + nombre + '</marquee>');
            },
            function () {
                var nombre = $(this).children("span").children().html();
                $(this).children("span").html(nombre);

            })
        })

    socket.on('generalMatrix',function(data){
        console.log(data)
        $('.box').html("");
        var boxStudent;
        var boxProfesor = `<span class="col s11">${data.profesor.nombre}</span>
                            <img class="circle" width="30" src="img/${data.profesor.avatar}.svg" style="padding-top: 2px;">
                            <div id="wave"></div>`

        $('.boxProfesor').html(boxProfesor);

        for (var key in data.estudiante) {
            boxStudent = `<span class="col s11">${data.estudiante[key].nombre}</span>
                    <img class="circle" width="30" src="img/${data.estudiante[key].avatar}.svg" style="padding-top: 2px;">
                    <div id="wave"></div>`;
            document.getElementById("tablem").rows[data.estudiante[key].fila-1].cells[data.estudiante[key].columna-1].innerHTML = boxStudent;
        }
        
    });


    var dataPerson = JSON.parse(sessionStorage.getItem("datos"));

    socket.on('isConnected',function(data){
        $('.cardChat').append(`<div class="chip">
            <img src="img/${data.avatar}.svg" alt="Contact Person">
            ${data.nombre}, se ha conectado
        </div>`)
    })

    socket.on('isDisconnected',function(data){
        $('.cardChat').append(`<div class="chip">
            <img src="img/${data.avatar}.svg" alt="Contact Person">
            ${data.nombre}, se ha desconectado
        </div>`)
    })
    
    

    var timerTyping;
    $('#mensaje').keypress(function() {
        clearTimeout(timerTyping);
        if(dataPerson.rol == "Profesor"){
            if($('.boxProfesor #wave').is(':empty')){
                socket.emit('ProfesorTyping',dataPerson);
                sock.send('message',dataPerson)

                
            }
        }else if(dataPerson.rol == "Estudiante"){
            var size = document.getElementById("tablem").rows[dataPerson.fila-1].cells[dataPerson.columna-1].childNodes.length;
            var x = document.getElementById("tablem").rows[dataPerson.fila-1].cells[dataPerson.columna-1].childNodes[size-1];
            if(!x.hasChildNodes()){
               socket.emit('EstudianteTyping',dataPerson);
               sock.send('message',dataPerson)

            }
        }
        
        timerTyping = setTimeout(function(){
            if(dataPerson.rol == "Profesor"){
                socket.emit('ProfesorisNotTyping',dataPerson);
                sock.send('message',dataPerson)

            }else if(dataPerson.rol == "Estudiante"){
             socket.emit('EstudianteisNotTyping',dataPerson);
             sock.send('message',dataPerson)

            }
        },2000)
    });

    


    // Logica enviar mensaje y recibir
    


    function isEmpty(str){
        return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
    }


    // Codigo de albeiro 
    $( "#mensaje" ).keypress(function( event ) {
        if ( event.which == 13 ) {
            $('.botonEnviarMensaje').click();
        }
      });

    $('.botonEnviarMensaje').click(function(){
        var myInput = document.getElementById("mensaje");
        if(!isEmpty(myInput.value)){
            socket.emit('newMessage',dataPerson,myInput.value)
            sock.send('message',dataPerson,myInput.value)
        }
        $('#mensaje').val('');
    })

    
    socket.on('newMessage',function(data,value){
        var htmlMessage = `<div class="col s12 mensajeUser">
                                <table>
                                    <tr>
                                        <td style="text-align: right;">
                                            <b>${data.nombre}</b>
                                        </td>
                                        <td rowspan="2" style="width: 2px;">
                                            <img class="circle" width="50" src="img/${data.avatar}.svg">
                                        </td>
                                    </tr>
                                    <tr> 
                                        <td style="text-align: right;">
                                            <span>${value}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>`
        var htmlMessageProfesor = `<div class="col s12 mensajeUser">
                                    <table>
                                        <tr>
                                            <td rowspan="2" style="width: 65px;">
                                                <img class="circle" width="50" src="img/${data.avatar}.svg">
                                            </td>
                                            <td>
                                                <b>${data.nombre}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${value} </span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>`
        if(data.rol == "Profesor"){
            $('.cardChat').append(htmlMessageProfesor);
        }else{
            $('.cardChat').append(htmlMessage);
        }

        // Dejar scroll abajo
        $('#ChatMsj').scrollTop($('#ChatMsj')[0].scrollHeight - $('#ChatMsj')[0].clientHeight);
        
    })

    if(dataPerson.rol == "Estudiante"){
        $('.botonCrearEncuesta').attr({'href':'#modal2'})
    }

    socket.on('newEncuesta',function(data){
        if(data != ''){
            $('.botonRespuestaEncuestas').css("cssText", "visibility: visible !important;");
        }
        if(dataPerson.rol == "Estudiante"){
            if(data == ''){
                $('.botonCrearEncuesta').addClass('disabled');
            }else{
                $('.botonCrearEncuesta').removeClass('disabled');
                $('.preguntaModalNuevo').html(data.pregunta);
                $('.opcion1ModalNuevo').html(data.opcion1);
                $('.opcion2ModalNuevo').html(data.opcion2);
                $('.opcion3ModalNuevo').html(data.opcion3);
                $('.opcion4ModalNuevo').html(data.opcion4);
            }
        }
        
    })

    $('.formsendREncuesta').submit(function(event){
        event.preventDefault();
        var selectedOption = $("input[name=group1]:checked").next().text();
        var selectedOptionid = $("input[name=group1]:checked").attr('id');
        socket.emit('sendEncuestaResponse',selectedOption,dataPerson.nombre,selectedOptionid);
        sock.send('message',dataPerson)
        $('.botonCrearEncuesta').addClass('disabled');
        $('#modal2').modal('close');

    })

    socket.on('newResponseEncuesta',function(data,respuesta){
        oilData.datasets.forEach(function(dataset) {
            dataset.data = dataset.data.map(function(value,index) {
                return respuesta[index];
            });
        });

        pieChart.update();
        
    })

    $('.formEncuesta').submit(function(event){
        event.preventDefault();
        
        var pregunta = $('input[name="preguntaInput"]').val()
        var opcion1 = $('input[name="opcion1Input"]').val()
        var opcion2 = $('input[name="opcion2Input"]').val()
        var opcion3 = $('input[name="opcion3Input"]').val()
        var opcion4 = $('input[name="opcion4Input"]').val()

        var dataEncuesta = {
            pregunta : pregunta,
            opcion1 : opcion1,
            opcion2 : opcion2,
            opcion3 : opcion3,
            opcion4 : opcion4
        }

        $('#modal1').modal('close');

        $('input[name="preguntaInput"]').val('')
        $('input[name="opcion1Input"]').val('')
        $('input[name="opcion2Input"]').val('')
        $('input[name="opcion3Input"]').val('')
        $('input[name="opcion4Input"]').val('')

        socket.emit('sendEncuesta',dataEncuesta);
        sock.send('message',dataPerson)

    })


    socket.on('checkButton',function(data){
        console.log(data);
        if(data.encuestas[0] != undefined){
            data.encuestas.forEach(function(value,index){
                console.log(value.person)
                if(value.person == dataPerson.nombre){
                    $('.botonCrearEncuesta').addClass('disabled');
                }else{
                    $('.botonCrearEncuesta').removeClass('disabled');
                }
            })
        }
        
        
    })


}
    

});