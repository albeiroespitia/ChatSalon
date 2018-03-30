
sock.addEventListener('open', function (event) {

    socket.on('newMessageGrupalRe', function (data, value,color,positions) {
        console.log("esta llegando")
        console.log(positions)
        var htmlMessage = `<div class="col s12 mensajeUserPg2">
                            <table>
                                <tr>
                                    <td rowspan="2" style="width: 65px;">
                                        <img class="circle" width="50" src="img/${data.avatar}.svg">
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
        positions.forEach(function(element){
            htmlGroupPrivado[element.fila][element.columna] += htmlMessage;
        })
        //htmlGroupPrivado[data.fila-1][data.columna-1] += htmlMessage;
        $('.cardChatPg2').html(htmlGroupPrivado[positions[0].fila][positions[0].columna])
        

        /*if(data.nombre != datatoSend.nombre){
            if(!modalOpen){
                refreshInterval = setInterval(function(){
                    document.getElementById("tablem").rows[fila].cells[columna].classList.toggle('transitionBorder');
                },1000)
            }
            
        }*/
        // Dejar scroll abajo
        $('#BandejaPg2').scrollTop($('#BandejaPg2')[0].scrollHeight - $('#BandejaPgW 2')[0].clientHeight);

    })

    
    /*socket.on('newMessageVideoPrivate', function (data, src,fila,columna) {
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
                                <span>
                                <video width="270" height="200" controls="" style="margin-left: 10px;width: 260px;">    
                                    <source src="./../uploads/${src}" type="video/mp4">
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
                                            <img class="circle" width="50" src="img/${data.avatar}.svg">
                                        </td>
                                    </tr>
                                    <tr> 
                                        <td style="text-align: right;">
                                            <span><img class="materialboxed" width="75%" src="./../uploads/${src}"/></span>
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

    })*/


    // ----- EMIT ------------------------------------------------
    function isEmpty(str) {
        return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
    }

    // Codigo de albeiro 
    $("#mensajePg2").keypress(function (event) {
        if (event.which == 13) {
            var myInput = document.getElementById("mensajePg2");
            if (!isEmpty(myInput.value)) {
                socket.emit('newMessageGrupal', datatoSend, myInput.value,$('#modalPg2').data('colorModal'))
                sock.send('message', datatoSend, myInput.value)
            }
            $('#mensajePg2').val('');
            }
    });

    
    /*// Imagenes y videos
    $("#file-inputpg2").change(function () {
        $('#formSubirImagenPg2').submit();
    });

    $('#formSubirImagenPg2').submit(function () {
        var options = {
            success: function (data, textStatus, xhr) {
                console.log(data.resp)
                if (data.resp != 'invalidFile') {
                    if (data.resp == 'image') {
                        socket.emit('newMessageImagePrivate', datatoSend,$('#modalPv2').data('fila'),$('#modalPv2').data('columna'))
                        sock.send('message', datatoSend)
                        Materialize.toast('Imagen enviado', 4000)
                    }
                    if (data.resp == 'video') {
                        socket.emit('newMessageVideoPrivate', datatoSend,$('#modalPv2').data('fila'),$('#modalPv2').data('columna'))
                        sock.send('message', datatoSend)
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
    });*/

});