    $('select').material_select();
    $('.tooltipped').tooltip({delay: 50});
	$('.modal').modal();

    $('.modal').modal({
        endingTop: '20%', // Ending top style attribute
          
	});
	
	var htmlPrivado = [
		['','','','','','',''],
		['','','','','','',''],
		['','','','','','',''],
		['','','','','','',''],
		['','','','','','',''],
		['','','','','','',''],
		['','','','','','',''],
	];
	var refreshInterval;
	var modalOpen = false;

	$('#modalPv2').modal({
		complete: function() { modalOpen = false; }
	})
	
	// SOCKET
	if(sessionStorage.getItem("datos") == null){
        window.location.replace("/");
    }
    
    var datatoSend = JSON.parse(sessionStorage.getItem("datos"));
    var socket = io.connect('/');
	console.log(window.location.hostname)
	var sock = new WebSocket("ws://"+window.location.hostname+":3001/");



	// Ingreso
	if(datatoSend.rol == "Profesor"){
		socket.emit('loginProfesor',datatoSend);
	}else if(datatoSend.rol == "Estudiante"){
		socket.emit('loginEstudiante',datatoSend)
	}
	 // --------- Btn encuesta ---------
	if(datatoSend.rol == "Estudiante"){
		$('.botonCrearEncuesta').attr({'href':'#modalSelEncuesta'})
	}

	/*	
	// ENCUESTA CANVAS 

        */





