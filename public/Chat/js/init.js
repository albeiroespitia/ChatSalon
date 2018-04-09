    $('select').material_select();
    $('.tooltipped').tooltip({
    	delay: 50
    });
    $('.modal').modal();

    $('.modal').modal({
    	endingTop: '20%', // Ending top style attribute

    });

    if (performance.navigation.type == 1) {
		window.location.replace("/");
    } else {
    	console.info("This page is not reloaded");
    }


    var htmlPrivado = [
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    ];
    var htmlGroupPrivado = [
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    	['', '', '', '', '', '', ''],
    ];
    var refreshInterval;
    var modalOpen = false;

    $('#modalPv2').modal({
    	complete: function () {
    		modalOpen = false;
    	}
    })

    $('#modalGrupoTrabajo').modal({
    	complete: function () {
    		$('.botonSiguiente').css({
    			display: 'none'
    		})

    	},
    	ready: function (modal, trigger) {
    		$('.botonSiguiente').css({
    			display: 'block'
    		})
    		$('.tapNextStep').tapTarget('open');
    		setTimeout(function () {
    			$('.tapNextStep').tapTarget('close');
    		}, 4000)
    	}
    })

    // SOCKET
    if (sessionStorage.getItem("datos") == null) {
    	window.location.replace("/");
    }

    var datatoSend = JSON.parse(sessionStorage.getItem("datos"));
    var socket = io.connect('/');
    console.log(window.location.hostname)
    var sock = new WebSocket("ws://" + window.location.hostname + ":3001/");


    function updateTableGroup() {
    	$('.tableWorkGroup').html($('.cardGrilla').html())
    	$('.tableWorkGroup').find('td').removeClass('box');
    	$('.tableWorkGroup').find('td').addClass('boxGroup');
    	$('.tableWorkGroup').children('table').attr({
    		id: 'tableGr'
    	});
    	$('.tableWorkGroup').find('td').each(function () {
    		var filaTestG = $(this).attr("data-filaTest")
    		var colTestG = $(this).attr("data-colTest")
    		$(this).removeAttr("onclick")
    		$(this).attr('onclick', `posicionGroup(${filaTestG},${colTestG})`);
    		$(this).removeAttr('ondblclick');
    	});
    }

    // Ingreso
    if (datatoSend.rol == "Profesor") {
    	socket.emit('loginProfesor', datatoSend);
    } else if (datatoSend.rol == "Estudiante") {
    	socket.emit('loginEstudiante', datatoSend)
    }
    // --------- Btn encuesta ---------
    if (datatoSend.rol == "Estudiante") {
    	$('.botonCrearEncuesta').attr({
    		'href': '#modal2'
    	})
	}
	
	Materialize.toast('Para editar la imagen de su perfil dar click en su imagen', 8000)


    /*	
	// ENCUESTA CANVAS 

        */