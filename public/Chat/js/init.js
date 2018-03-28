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
		$('.botonCrearEncuesta').attr({'href':'#modal2'})
	}


	// ENCUESTA CANVAS 
    var oilCanvas = document.getElementById("oilChart");
        Chart.defaults.global.defaultFontSize = 24;

		window.oilData = {
		    labels: [
		        "A.",
		        "B.",
		        "C.",
		        "D.",
		      
		    ],
		    datasets: [
		        {
		            data: [0, 0, 0, 0],
		            backgroundColor: [
		                "#f1c40f",
		                "#e74c3c",
		                "#2980b9",
		                "#2ecc71"
		            ],
		            borderWidth: 2
		        }]
		};

		var chartOptions = {
		  segmentShowStroke: true,
				segmentStrokeColor: "#fff",
				segmentStrokeWidth: 2,
				percentageInnerCutout: 50,
				animationSteps: 100,
				animationEasing: "easeOutBounce",
				animateRotate: true,
				animateScale: false,
				responsive: true,
				maintainAspectRatio: true,
				showScale: true,
				animateScale: true
			
		};

		window.pieChart = new Chart(oilCanvas, {
		  type: 'doughnut',
		  data: oilData,
		  options: chartOptions
		});

        





