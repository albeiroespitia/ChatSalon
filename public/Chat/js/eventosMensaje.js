
    socket.on('newMessage', function (data, value) {
        var htmlMessage = `<div class="col s12 mensajeUser">
                                <table>
                                    <tr>
                                        <td style="text-align: right;">
                                            <b>${data.nombre}</b>
                                        </td>
                                        <td rowspan="2" style="width: 2px;">
                                            <img class="circle" width="50" src="Chat/img/${data.avatar}">
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
                                                <img class="circle" width="50" src="Chat/img/${data.avatar}">
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
    socket.on('newMessageVideo', function (data, src) {
        var htmlMessageI = `<div class="col s12 mensajeUser">
                    <table>
                        <tr>
                            <td style="text-align: right;">
                                <b>${data.nombre}</b>
                            </td>
                            <td rowspan="2" style="width: 2px;">
                                <img class="circle" width="50" src="Chat/img/${data.avatar}">
                            </td>
                        </tr>
                        <tr> 
                            <td style="text-align: right;">
                                <span>
                                <video width="270" height="200" controls="" style="margin-left: 10px;width: 260px;">    
                                    <source src="Chat/../uploads/${src}" type="video/mp4">
                                </video>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>`
        var htmlMessageProfesorI = `<div class="col s12 mensajeUser">
                        <table>
                            <tr>
                                <td rowspan="2" style="width: 65px;">
                                    <img class="circle" width="50" src="Chat/img/${data.avatar}">
                                </td>
                                <td>
                                    <b>${data.nombre}</b>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                    <video width="270" height="200" controls="" style="margin-left: 10px;width: 260px;">
                                            <source src="Chat/../uploads/${src}" type="video/mp4">
                                        </video>
                                    </span>
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

    socket.on('newMessageImage', function (data, src) {
        var htmlMessageI = `<div class="col s12 mensajeUser">
                                <table>
                                    <tr>
                                        <td style="text-align: right;">
                                            <b>${data.nombre}</b>
                                        </td>
                                        <td rowspan="2" style="width: 2px;">
                                            <img class="circle" width="50" src="Chat/img/${data.avatar}">
                                        </td>
                                    </tr>
                                    <tr> 
                                        <td style="text-align: right;">
                                            <span><img class="materialboxed" width="100%" src="Chat/../uploads/${src}"/></span>
                                        </td>
                                    </tr>
                                </table>
                            </div>`
        var htmlMessageProfesorI = `<div class="col s12 mensajeUser">
                                    <table>
                                        <tr>
                                            <td rowspan="2" style="width: 65px;">
                                                <img class="circle" width="50" src="Chat/img/${data.avatar}">
                                            </td>
                                            <td>
                                                <b>${data.nombre}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span><img class="materialboxed" width="100%" src="Chat/../uploads/${src}"/></span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>`
        if (data.rol == "Profesor") {
            $('.cardChat').append(htmlMessageProfesorI);
        } else {
            $('.cardChat').append(htmlMessageI);
        }
        
        $('.materialboxed').materialbox();
        // Dejar scroll abajo
        $('#ChatMsj').scrollTop($('#ChatMsj')[0].scrollHeight - $('#ChatMsj')[0].clientHeight);

    })

    socket.on('newMessageAudio', function (src) {
        var htmlMessageI = `<div class="col s12 mensajeUser">
                                <table>
                                    <tr>
                                        <td style="text-align: right;">
                                            <b>2</b>
                                        </td>
                                        <td rowspan="2" style="width: 2px;">
                                            <img class="circle" width="50" src="2">
                                        </td>
                                    </tr>
                                    <tr> 
                                        <td style="text-align: right;">
                                        <span><audio src="${src}" controls autoplay>
                                        <p>Tu navegador no soporta audios</p>
                                        </audio></span>
                                        </td>
                                    </tr>
                                </table>
                            </div>`
        var htmlMessageProfesorI = `<div class="col s12 mensajeUser">
                                    <table>
                                        <tr>
                                            <td rowspan="2" style="width: 65px;">
                                                <img class="circle" width="50" src="Chat/img/2">
                                            </td>
                                            <td>
                                                <b>2</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            <span><audio src="${src}" controls autoplay>
                                            <p>Tu navegador no soporta audios</p>
                                            </audio></span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>`
        //if (data.rol == "Profesor") {
            $('.cardChat').append(htmlMessageProfesorI);
        //} else {
        //    $('.cardChat').append(htmlMessageI);
        //}
        
        $('.materialboxed').materialbox();
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
        chrome.webstore.install('https://chrome.google.com/webstore/detail/ajhifddimkapgcifgcodmmfdlknahffk', 
            function(d){
                console.log('installed')
            },
            function(e){
                console.log('not installed: '+ e)
        });
        var myInput = document.getElementById("mensaje");
        if (!isEmpty(myInput.value)) {
            if(/<[a-z][\s\S]*>/i.test(myInput.value)){
                alert('Estas intentando introducir codigo html, por favor no lo hagas!')
            }else{
                socket.emit('newMessage', datatoSend, myInput.value)
            }
        }
        $('#mensaje').val('');
    })

    // Imagenes y videos
    $("#file-input").change(function () {
        $('#formSubirImagen').submit();
    });

    $('#formSubirImagen').submit(function () {
        var options = {
            success: function (data, textStatus, xhr) {
                if (data.resp != 'invalidFile') {
                    if (data.resp == 'image') {
                        socket.emit('newMessageImage', datatoSend)
                        Materialize.toast('Imagen enviado', 4000)
                    }
                    if (data.resp == 'video') {
                        socket.emit('newMessageVideo', datatoSend)
                        Materialize.toast('Video enviado', 4000)
                    }
                    
                } else {
                    Materialize.toast('Extension de archivo invalida', 4000)
                }
            }
        };
        $(this).ajaxSubmit(options);
        //Very important line, it disable the page refresh.
        return false;
    });

