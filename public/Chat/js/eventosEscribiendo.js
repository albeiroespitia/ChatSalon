    socket.on('ProfesorisNotTypingAll', function (data) {
        $('.boxProfesor #wave').html('');
    })

    socket.on('ProfesorTypingAll', function (data) {
        $('.boxProfesor #wave').html(`<span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>`)
    })

    socket.on('EstudianteisNotTypingAll', function (data) {
        var size = document.getElementById("tablem").rows[data.fila - 1].cells[data.columna - 1].childNodes.length;
        var x = document.getElementById("tablem").rows[data.fila - 1].cells[data.columna - 1].childNodes[size - 1];
        x.innerHTML = '';
        var dataColor = x.dataset.colorTemp;
        x.style.border = `2px solid ${dataColor}`;
    })

    socket.on('EstudianteTypingAll', function (data) {
        var size = document.getElementById("tablem").rows[data.fila - 1].cells[data.columna - 1].childNodes.length;
        var x = document.getElementById("tablem").rows[data.fila - 1].cells[data.columna - 1].childNodes[size - 1];
        x.innerHTML = `<span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>`;
        x.style.border = `none`;
    })

    // ------------------  Emit ----------------------------
    var timerTyping;
    $('#mensaje').keypress(function() {
        clearTimeout(timerTyping);
        if(datatoSend.rol == "Profesor"){
            if($('.boxProfesor #wave').is(':empty')){
                socket.emit('ProfesorTyping',datatoSend);
            }
        }else if(datatoSend.rol == "Estudiante"){
            var size = document.getElementById("tablem").rows[datatoSend.fila-1].cells[datatoSend.columna-1].childNodes.length;
            var x = document.getElementById("tablem").rows[datatoSend.fila-1].cells[datatoSend.columna-1].childNodes[size-1];
            if(!x.hasChildNodes()){
               socket.emit('EstudianteTyping',datatoSend);

            }
        }
        
        timerTyping = setTimeout(function(){
            if(datatoSend.rol == "Profesor"){
                socket.emit('ProfesorisNotTyping',datatoSend);

            }else if(datatoSend.rol == "Estudiante"){
             socket.emit('EstudianteisNotTyping',datatoSend);

            }
        },2000)
    });



