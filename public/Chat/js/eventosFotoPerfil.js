
    socket.on('newImageProfile',function(data,src,fila,columna){
        document.getElementById("tablem").rows[fila].cells[columna].children[0].children[0].children[1].children[0].setAttribute("src",`Chat/../uploads/${src}`)        
    })

    // Imagenes y videos
    $(document).on('change',"#file-inputpf2",function(){
        $('#formSubirImagenPf2').submit();
    });

    $(document).on('submit',"#formSubirImagenPf2",function(){
        var filaTestT = document.getElementById("tablem").rows[datatoSend.fila - 1].cells[datatoSend.columna - 1].getAttribute("data-filaTest")
        var colTestT = document.getElementById("tablem").rows[datatoSend.fila - 1].cells[datatoSend.columna - 1].getAttribute("data-colTest")
        var options = {
            success: function (data, textStatus, xhr) {
                if (data.resp != 'invalidFile') {
                    if (data.resp == 'image') {
                        socket.emit('newImageProfile', datatoSend,filaTestT,colTestT)
                        Materialize.toast('Imagen de perfil cambiada', 4000)
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

