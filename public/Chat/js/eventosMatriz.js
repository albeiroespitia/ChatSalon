sock.addEventListener('open', function (event) {
    window.posicion = function (fila, col) {
        console.log(this)
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


    socket.on('sendMatrixSize', function (fila, columna) {
        $('.cuerpoTabla').html("");
        var html = "";
        for (var f = 1; f <= fila; f++) {
            html += "<tr>"
            for (var c = 1; c <= columna; c++) {
                if (datatoSend.rol == "Profesor") {
                    html += "<td class='box modal-trigger'> </td>";
                } else if (datatoSend.rol == "Estudiante") {
                    //html += "<td onClick='posicion("+f+","+c+")' class='box modal-trigger'> </td>";
                    html += "<td data-filaTest=" + f + " data-colTest=" + c + " class='box modal-trigger'> </td>";
                }

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
        var boxProfesor = `<span class="col s11">${data.profesor.nombre}</span>
                            <img class="circle" width="30" src="img/${data.profesor.avatar}.svg" style="padding-top: 2px;">
                            <div id="wave"></div>`

        $('.boxProfesor').html(boxProfesor);

        for (var key in data.estudiante) {
            boxStudent = `<span class="col s11">${data.estudiante[key].nombre}</span>
                    <img class="circle" width="30" src="img/${data.estudiante[key].avatar}.svg" style="padding-top: 2px;">
                    <div id="wave"></div>`;
            document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].innerHTML = boxStudent;
            var filaTest = document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].getAttribute("data-filaTest")
            var colTest = document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].getAttribute("data-colTest")
            if (datatoSend.rol != 'Profesor') {
                document.getElementById("tablem").rows[data.estudiante[key].fila - 1].cells[data.estudiante[key].columna - 1].setAttribute('onclick', `posicion(${filaTest},${colTest})`);
            }
        }
        updateTableGroup();


    });
});