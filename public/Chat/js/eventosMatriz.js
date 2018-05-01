    window.posicion = function (event, fila, col, color) {
        if (event.ctrlKey || event.metaKey) {
            posicionDouble(event, fila, col, color)
        }else if(event.altKey){
            if(datatoSend.rol == "Profesor"){
                posicionRemote(event, fila, col)
            }
        }else{
            if (datatoSend.rol == "Estudiante") {
                if ((datatoSend.fila == fila) && (datatoSend.columna == col)) {
                    Materialize.toast('No puedes enviarte un mensaje a ti mismo', 4000)
                } else {
                    modalOpen = true;
                    clearInterval(refreshInterval);
                    document.getElementById("tablem").rows[fila - 1].cells[col - 1].classList.remove('transitionBorder');
                    $('#modalPv2').data('fila', fila - 1)
                    $('#modalPv2').data('columna', col - 1)
                    $('#modalPv2').modal('open');
                    $('.cardChatPv2').html(htmlPrivado[fila - 1][col - 1])
                    $('#BandejaPv2').scrollTop($('#BandejaPv2')[0].scrollHeight - $('#BandejaPv2')[0].clientHeight);
                }
            }
        }


    }


    socket.on('sendMatrixSize', function (fila, columna) {
        $('.cuerpoTabla').html("");
        var html = "";
        for (var f = 1; f <= fila; f++) {
            html += "<tr>"
            for (var c = 1; c <= columna; c++) {
                /*if (datatoSend.rol == "Profesor") {
                    html += "<td class='box modal-trigger'> </td>";
                } else if (datatoSend.rol == "Estudiante") {*/
                    //html += "<td onClick='posicion("+f+","+c+")' class='box modal-trigger'> </td>";
                    html += "<td data-filaTest=" + f + " data-colTest=" + c + " class='fixed-action-btn box modal-trigger horizontal click-to-toggle'> </td>";
                //}

            }
            html += "</tr>";
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

        $(document).on('mouseenter', '.boxGroup', function () {
            var nombre = $(this).children("span").html();
            $(this).children("span").html('<marquee scrollamount="4">' + nombre + '</marquee>');
        })
        $(document).on("mouseleave", ".boxGroup", function () {
            var nombre = $(this).children("span").children().html();
            $(this).children("span").html(nombre);
        });
    })



    socket.on('generalMatrix', function (data) {
        console.log("recibido2")
        $('.box').html("");
        var boxStudent;
        var boxProfesor
        if(datatoSend.rol == "Profesor"){
            boxProfesor = `<form id="formSubirImagenPf2" enctype="multipart/form-data" action="/imageUpload" method="post">
            <div class="image-uploadF col s12">
                <span class="col s11">${data.profesor.nombre}</span>
                <label for="file-inputpf2">
                    <img class="circle" width="30" src="Chat/img/${data.profesor.avatar}" style="padding-top: 2px;">
                </label>
                <input accept="image/*" name="filetouploadpf2" id="file-inputpf2" type="file" />
                    <div id="wave"></div>
            </div>
            </form>`;
        }else{
            boxProfesor = `<span class="col s11">${data.profesor.nombre}</span>
            <img class="circle" width="30" src="Chat/img/${data.profesor.avatar}" style="padding-top: 2px;">
            <div id="wave"></div>`
        }
        $('.boxProfesor').html(boxProfesor);

        for (var key in data.estudiante) {
            if((data.estudiante[key].fila == datatoSend.fila) && (data.estudiante[key].columna == datatoSend.columna)){
                boxStudent = `<form id="formSubirImagenPf2" enctype="multipart/form-data" action="/imageUpload" method="post">
                <div class="image-uploadF col s12">
                    <span class="col s11">${data.estudiante[key].nombre}</span>
                    <label for="file-inputpf2">
                        <img class="circle" width="30" src="Chat/img/${data.estudiante[key].avatar}" style="padding-top: 2px;">
                    </label>
                    <input accept="image/*" name="filetouploadpf2" id="file-inputpf2" type="file" />
                        <div id="wave"></div>
                </div>
                </form>
                <ul>
                    <li class="privateMessageicon"><a class="btn-floating red "><i class="material-icons">message</i></a></li>
                    <li class="groupMessageicon"><a class="btn-floating yellow darken-1 "><i class="material-icons">group_work</i></a></li>
                    <li class="remoteControlicon"><a class="btn-floating green"><i class="material-icons">desktop_windows</i></a></li>
                    <li class="videoCallicon"><a class="btn-floating blue"><i class="material-icons">video_call</i></a></li>
                </ul>`;
                
            }else{
                boxStudent = `<span class="col s11">${data.estudiante[key].nombre}</span>
                <ul>
                    <li class="privateMessageicon"><a class="btn-floating red"><i class="material-icons">message</i></a></li>
                    <li class="groupMessageicon"><a class="btn-floating yellow darken-1"><i class="material-icons">group_work</i></a></li>
                    <li class="remoteControlicon"><a class="btn-floating green"><i class="material-icons">desktop_windows</i></a></li>
                    <li class="videoCallicon"><a class="btn-floating green"><i class="material-icons">video_call</i></a></li>
                </ul>
                <img class="circle" width="30" src="Chat/img/${data.estudiante[key].avatar}" style="padding-top: 2px;">
                <div id="wave"></div>`;
            }
            
            document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].innerHTML = boxStudent;
            var filaTest = document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].getAttribute("data-filaTest")
            var colTest = document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].getAttribute("data-colTest")
            console.log(filaTest)
            console.log(colTest)
            //if (datatoSend.rol != 'Profesor') {
            //document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].setAttribute('onclick', `posicion(event,${filaTest},${colTest},'1')`);
                console.log("else")
                document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].children[1].children[0].children[0].setAttribute('onclick', `posicion(event,${filaTest},${colTest},'1')`);
                document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].children[1].children[1].children[0].setAttribute('onclick', `posicionDouble(event,${filaTest},${colTest},'1')`);
                document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].children[1].children[2].children[0].setAttribute('onclick', `posicionRemote(event,${filaTest},${colTest})`);
                document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].children[1].children[3].children[0].setAttribute('onclick', `posicionVideo(event,${filaTest},${colTest})`);
                //}
            if(datatoSend.rol == "Profesor"){
                $('.privateMessageicon').css('display','none')
            }else if(datatoSend.rol == "Estudiante"){
                $('.remoteControlicon').css('display','none')
            }
        }
        updateTableGroup();
    });

    
$(document).click(function(e) {
    var target = e.target; //target div recorded
    if (!$(target).is('.box') ) {
        $('.fixed-action-btn').closeFAB();
    }
})

$(document).on('click','.box',function(){
    $('.fixed-action-btn').closeFAB();
    $(this).openFAB();
})

