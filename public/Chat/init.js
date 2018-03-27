$(document).ready(function() {
    $('select').material_select();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();

    $('.modal').modal({
        endingTop: '20%', // Ending top style attribute
          
    });

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
});