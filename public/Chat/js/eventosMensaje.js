sock.addEventListener('open', function (event) {

    socket.on('newMessage', function (data, value) {
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
        if (data.rol == "Profesor") {
            $('.cardChat').append(htmlMessageProfesor);
        } else {
            $('.cardChat').append(htmlMessage);
        }

        // Dejar scroll abajo
        $('#ChatMsj').scrollTop($('#ChatMsj')[0].scrollHeight - $('#ChatMsj')[0].clientHeight);

    })


    socket.on('newMessageImage', function (data, src) {
        var htmlMessageI = `<div class="col s12 mensajeUser">
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
                                            <span><img width="100%" src="./../uploads/${src}"/></span>
                                        </td>
                                    </tr>
                                </table>
                            </div>`
        var htmlMessageProfesorI = `<div class="col s12 mensajeUser">
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
                                                <span><img width="100%" src="./../uploads/${src}"/></span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>`
        if (data.rol == "Profesor") {
            $('.cardChat').append(htmlMessageProfesorI);
        } else {
            $('.cardChat').append(htmlMessageI);
        }

        // Dejar scroll abajo
        $('#ChatMsj').scrollTop($('#ChatMsj')[0].scrollHeight - $('#ChatMsj')[0].clientHeight);

    })


    // ----- EMIT ------------------------------------------------
    function isEmpty(str) {
        return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
    }

    // Codigo de albeiro 
    $("#mensaje").keypress(function (event) {
        if (event.which == 13) {
            $('.botonEnviarMensaje').click();
        }
    });

    $('.botonEnviarMensaje').click(function () {
        var myInput = document.getElementById("mensaje");
        if (!isEmpty(myInput.value)) {
            socket.emit('newMessage', datatoSend, myInput.value)
            sock.send('message', datatoSend, myInput.value)
        }
        $('#mensaje').val('');
    })
   
    // Imagenes y videos
    $(":file").change(function () {
        Materialize.toast('Seleccionado', 4000)
        $('#formSubirImagen').submit();

    });

    $('#formSubirImagen').submit(function () {
        var options = {
            error: function(){
                alert('Error loading XML document');
            },
            success: function(){
                socket.emit('newMessageImage', datatoSend)
                sock.send('message', datatoSend)
            }
        };

        $(this).ajaxSubmit(options);
        //Very important line, it disable the page refresh.
        return false;
    });

});