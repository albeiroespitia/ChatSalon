window.posicionVideo = function (event, fila, col) {
    socket.emit('videoCall', fila, col)
}


socket.on('videoOn', function (fila,col) {
    socket.emit('videoOnFlag',fila,col)
    document.getElementById('VideoContainer').innerHTML = '<iframe src="https://tokbox.com/embed/embed/ot-embed.js?embedId=220658b3-2393-4f61-a094-173fdf038896&room=DEFAULT_ROOM&iframe=true" width=100% height=640 allow="microphone; camera" ></iframe>'
    $('#modalBroadcastVideo').modal('open');
})

////////////////////////////////////////////////////////////////////////////////////////////////////

socket.on('videoOnClient', function (fila,col) {
    document.getElementById('VideoContainer').innerHTML = '<iframe src="https://tokbox.com/embed/embed/ot-embed.js?embedId=220658b3-2393-4f61-a094-173fdf038896&room=DEFAULT_ROOM&iframe=true" width=100% height=640 allow="microphone; camera" ></iframe>'
    $('#modalBroadcastVideo').modal('open');
})