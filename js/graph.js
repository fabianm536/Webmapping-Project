function showGraph(lat,long){

	
	var values = "xadresse="+long+"&yadresse="+lat;

    var url = "http://localhost/Webmapping-Project/php/getPOIdata.php?" + values;
	
 	var d =  $.getJSON( url)
	
	.done(function(data) {
		//delete last graph
	    $('#myCanvas').replaceWith('<canvas id="myCanvas"></canvas>');
		
		//define canvas
		var marksCanvas = document.getElementById('myCanvas');

		//draw chart
		var radarChart = new Chart(marksCanvas, {
	  		type: 'radar',
	  		data: data
	});
})
	  .fail(function() {
		console.log( "error" );
	  })
	  .always(function() {
		console.log( "complete" );
	  });
	
}
