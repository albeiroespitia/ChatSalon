
        socket.on('disconnectAllSockets', function () {
            socket.emit('forceDisconnect');
            window.location.replace("/");
        })


        socket.on('isConnected', function (data) {
            $('.cardChat').append(`<div class="chip">
            <img src="Chat/img/${data.avatar}" alt="Contact Person">
            ${data.nombre}, se ha conectado
        </div>`)
        })

        socket.on('isDisconnected', function (data) {
            htmlPrivado[data.fila-1][data.columna-1] = '';  
            $('.cardChat').append(`<div class="chip">
            <img src="Chat/img/${data.avatar}" alt="Contact Person">
            ${data.nombre}, se ha desconectado
        </div>`)
        })
