sock.addEventListener('open',function(event){
    console.log("sockopenaa")
    

    window.posicion = function (fila, col){
        $('#modalPv2').data('fila',fila-1)
        $('#modalPv2').data('columna',col-1)
        $('#modalPv2').modal('open');
        $('#cardChatPv2').html(htmlPrivado[fila-1][col-1])
    }


    socket.on('sendMatrixSize', function (fila, columna) {
        $('.cuerpoTabla').html("");
        var html = "";
        for (var f = 1; f <= fila; f++) {
            html += "<tr>"
            for (var c = 1; c <= columna; c++) {
                html += "<td onClick='posicion("+f+","+c+")' class='box modal-trigger'> </td>";
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
        }

    });
});