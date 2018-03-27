sock.addEventListener('open',function(event){

        socket.on('disconnectAllSockets', function () {
            socket.emit('forceDisconnect');
            window.location.replace("/");
        })


        socket.on('isConnected', function (data) {
            $('.cardChat').append(`<div class="chip">
            <img src="img/${data.avatar}.svg" alt="Contact Person">
            ${data.nombre}, se ha conectado
        </div>`)
        })

        socket.on('isDisconnected', function (data) {
            $('.cardChat').append(`<div class="chip">
            <img src="img/${data.avatar}.svg" alt="Contact Person">
            ${data.nombre}, se ha desconectado
        </div>`)
        })



    });