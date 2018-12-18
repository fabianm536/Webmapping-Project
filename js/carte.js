var map,
	fields = ["scanombre"];


function initialize(){

	var map = L.map('map',{
	minZoom: 2,
	maxZoom: 22,
	zoomControl: true              
	}).setView([4.65, -74.1], 12);   	

	var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'); 

	var options =	{
	center: new L.LatLng(4.55, -74.1),
	zoom: 11,
	layers: [osm],
	};

	osm.addTo(map);

	var wmsLayer= L.tileLayer.wms("http://localhost/cgi-bin/webfoncier/qgis_mapserv.fcgi?",{
	layers: 'Communes',
	transparent: true,
	opacity : 0.50,
	format: 'image/png'
	}).addTo(map);
	
	
	var secteurs = $.ajax({
	  url:"http://localhost/Webmapping-Project/php/getData.php?table=secteur_cadastral&fields[]=scanombre",
	  dataType: "json",
	  success: console.log("County data successfully loaded."),
	  error: function (xhr) {
	alert(xhr.statusText)
	}
	})

	// Specify that this code should run once the  data request is complete
	$.when(secteurs).done(function() {
		var secteursData = L.geoJSON(secteurs.responseJSON).addTo(map);
	});

}




