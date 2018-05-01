window.posicionVideo = function (event, fila, col) {
    var idVideoCall = `IDVIDEOFROM${datatoSend.fila-1}-${datatoSend.columna-1}TO${fila-1}-${col-1}`
    socket.emit('videoCall', fila, col,idVideoCall)
    Materialize.toast('Se le ha enviado una peticion al usuario',3000)
}

socket.on('videoOn', function (fila,col,idVideoCall) {
    socket.emit('videoOnFlag',fila,col,idVideoCall)
})

socket.on('videoSuccesClient', function (idVideoCall) {
    document.getElementById('VideoContainer').innerHTML = `<iframe src="https://tokbox.com/embed/embed/ot-embed.js?embedId=220658b3-2393-4f61-a094-173fdf038896&room=${idVideoCall}&iframe=true" width=100% height=520 allow="microphone; camera" ></iframe>`
    $('#modalBroadcastVideo').modal('open');
})

socket.on('videoErrorClient', function (idVideoCall) {
    Materialize.toast('El usuario no ha aceptado la videollamada',3000)
})


////////////////////////////////////////////////////////////////////////////////////////////////////

socket.on('videoOnClient', function (idVideoCall,idSocket){
    $('#md1').modal('open');
    $('#md1_YesBtn').click(function(){
        $('#md1').modal('close');
        document.getElementById('VideoContainer').innerHTML = `<iframe src="https://tokbox.com/embed/embed/ot-embed.js?embedId=220658b3-2393-4f61-a094-173fdf038896&room=${idVideoCall}&iframe=true" width=100% height=520 allow="microphone; camera" ></iframe>`
        $('#modalBroadcastVideo').modal('open');
        socket.emit('successVideo',idSocket,idVideoCall)
    })

    $('#md1_NoBtn').click(function(){
        $('#md1').modal('close');
        socket.emit('errorVideo',idSocket)
    })
})