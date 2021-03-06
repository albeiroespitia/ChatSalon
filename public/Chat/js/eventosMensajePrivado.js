

    socket.on('newMessagePrivate', function (data, value,fila,columna) {
        console.log("esta llegando")
        var htmlMessage = `<div class="col s12 mensajeUserPv2">
                            <table>
                                <tr>
                                    <td rowspan="2" style="width: 65px;">
                                        <img class="circle" width="50" src="Chat/img/${data.avatar}">
                                    </td>
                                    <td style="padding:0px">
                                        <b>${data.nombre}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0px">
                                        <span>${value}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>`;
        htmlPrivado[fila][columna] += htmlMessage;
        $('.cardChatPv2').html(htmlPrivado[fila][columna])

        if(data.nombre != datatoSend.nombre){
            if(!modalOpen){
                refreshInterval = setInterval(function(){
                    document.getElementById("tablem").rows[fila].cells[columna].classList.toggle('transitionBorder');
                },1000)
            }
            
        }
        // Dejar scroll abajo
        $('#BandejaPv2').scrollTop($('#BandejaPv2')[0].scrollHeight - $('#BandejaPv2')[0].clientHeight);

    })

    
    socket.on('newMessageVideoPrivate', function (data, src,fila,columna) {
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

        htmlPrivado[fila][columna] += htmlMessageI;
        $('.cardChatPv2').html(htmlPrivado[fila][columna])

        if(data.nombre != datatoSend.nombre){
            if(!modalOpen){
                refreshInterval = setInterval(function(){
                    document.getElementById("tablem").rows[fila].cells[columna].classList.toggle('transitionBorder');
                },1000)
            }
            
        }

        // Dejar scroll abajo
        $('#BandejaPv2').scrollTop($('#BandejaPv2')[0].scrollHeight - $('#BandejaPv2')[0].clientHeight);

    })

    socket.on('newMessageImagePrivate', function (data, src,fila,columna) {
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
                                            <span><img class="materialboxed" width="75%" src="Chat/../uploads/${src}"/></span>
                                        </td>
                                    </tr>
                                </table>
                            </div>`
        htmlPrivado[fila][columna] += htmlMessageI;
        $('.cardChatPv2').html(htmlPrivado[fila][columna])
        $('.materialboxed').materialbox();
        

        if(data.nombre != datatoSend.nombre){
            if(!modalOpen){
                refreshInterval = setInterval(function(){
                    document.getElementById("tablem").rows[fila].cells[columna].classList.toggle('transitionBorder');
                },1000)
            }
            
        }
        
        // Dejar scroll abajo
        $('#BandejaPv2').scrollTop($('#BandejaPv2')[0].scrollHeight - $('#BandejaPv2')[0].clientHeight);

    })


    // ----- EMIT ------------------------------------------------
    function isEmpty(str) {
        return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
    }

    // Codigo de albeiro 
    $("#mensajePv2").keypress(function (event) {
        if (event.which == 13) {
            var myInput = document.getElementById("mensajePv2");
            if (!isEmpty(myInput.value)) {
                socket.emit('newMessagePrivate', datatoSend, myInput.value,$('#modalPv2').data('fila'),$('#modalPv2').data('columna'))
            }
            $('#mensajePv2').val('');
            }
    });

    
    // Imagenes y videos
    $("#file-inputpv2").change(function () {
        $('#formSubirImagenPv2').submit();
    });

    $('#formSubirImagenPv2').submit(function () {
        var options = {
            success: function (data, textStatus, xhr) {
                console.log(data.resp)
                if (data.resp != 'invalidFile') {
                    if (data.resp == 'image') {
                        socket.emit('newMessageImagePrivate', datatoSend,$('#modalPv2').data('fila'),$('#modalPv2').data('columna'))
                        Materialize.toast('Imagen enviado', 4000)
                    }
                    if (data.resp == 'video') {
                        socket.emit('newMessageVideoPrivate', datatoSend,$('#modalPv2').data('fila'),$('#modalPv2').data('columna'))
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

