window.posicionRemote = function (event, fila, col) {
    socket.emit('remoto', fila, col)
}


socket.on('remoteOn', function () {
    // if broadcast is available, simply join it. i.e. "join-broadcaster" event should be emitted.
    // if broadcast is absent, simply create it. i.e. "start-broadcasting" event should be fired.
    broadcastId = `idBroadcast-fil${datatoSend.fila-1}-col${datatoSend.columna-1}`
    if (broadcastId.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter broadcast-id');
        document.getElementById('broadcast-id').focus();
        return;
    }


    connection.session = {
        screen: true,
        oneway: true
    };

    var socket2 = connection.getSocket();

    socket2.emit('check-broadcast-presence', broadcastId, function (isBroadcastExists) {
        if (!isBroadcastExists) {
            // the first person (i.e. real-broadcaster) MUST set his user-id
            connection.userid = broadcastId;
        }

        console.log('check-broadcast-presence', broadcastId, isBroadcastExists);

        socket2.emit('join-broadcast', {
            broadcastId: broadcastId,
            userid: connection.userid,
            typeOfStreams: connection.session
        });
    });
})


////////////////////////////////////////////////////////////////////////////////////////////////////

socket.on('newRemote2', function (data) {
    // ask node.js server to look for a broadcast
    // if broadcast is available, simply join it. i.e. "join-broadcaster" event should be emitted.
    // if broadcast is absent, simply create it. i.e. "start-broadcasting" event should be fired.   
    var broadcastId = data;
    if (broadcastId.replace(/^\s+|\s+$/g, '').length <= 0) {
        alert('Please enter broadcast-id');
        document.getElementById('broadcast-id').focus();
        return;
    }


    connection.session = {
        screen: true,
        oneway: true
    };

    var socket = connection.getSocket();

    socket.emit('check-broadcast-presence', broadcastId, function (isBroadcastExists) {
        if (!isBroadcastExists) {
            // the first person (i.e. real-broadcaster) MUST set his user-id
            connection.userid = broadcastId;
        }

        console.log('check-broadcast-presence', broadcastId, isBroadcastExists);

        socket.emit('join-broadcast', {
            broadcastId: broadcastId,
            userid: connection.userid,
            typeOfStreams: connection.session
        });
    });

    $('#modalBroadcast').modal('open');

})

socket.on('newRemoteError',function(){
    Materialize.Toast.removeAll();
    Materialize.toast('El cliente ha denegado su peticion o ocurrio un error de seguridad',4000)
})