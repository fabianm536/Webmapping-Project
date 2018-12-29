function showGraph(lat,long){
	
	var ctx = document.getElementById("myChart");
/*	
	var values = "xadresse="+long+"&yadresse="+lat;	

	var url = "http://localhost/Webmapping-Project/php/getPOIdata.php?"+values;


	var marksData = $.ajax({
	  url:url,
	  type: "GET",
	  dataType: "json",
	  complete: function (data) {
		  
			var myRadarChart = new Chart(ctx, {
			type: 'radar',
			data: data.responseJSON
			});
		  
		  	console.log(url);
		}
		});
*/


var marksData = {"labels": ["Établissement d'enseignement ", "Cinema ", "Turistique ", "Bureau d’affairs ", "Centre commerciel ", "Temple ", "Secours ", "Supermarche ", "Centre sportif ", "Hotel ", "Ambassade ", "Universite ", "Hopital "],"datasets": [{ "label": "Distance aux points d'interet (m)", "backgroundColor": "rgba(153, 51, 255,0.5)", "data": [340.44, 181.91, 196.04, 118.57, 46.78, 250.43, 204.73, 183.26, 538.94, 149.32, 678.71, 101.33, 549.53]}]};

	var myRadarChart = new Chart(ctx, {
		type: 'radar',
		data: marksData
		});

}
