var map,
	fields = ["scanombre"], 
	autocomplete = [];


function initialize(){

	var map = L.map('map',{
	minZoom: 2,
	maxZoom: 22,
	zoomControl: false              
	}).setView([4.55, -74.1], 12);   	

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

	var zoom_bar = new L.Control.ZoomBar({position: 'topright'}).addTo(map);

	//next: add features to map
	getData();
};



// Couche des secteurs depuis un script PHP



function getData(){
	$.ajax("php/secteurs.php", {
		data: {
			table: "fracsandsites",
			fields: fields
		},
		success: function(data){
			mapData(data);
		}
	})
};

function mapData(data){
	//remove existing map layers
	map.eachLayer(function(layer){
		//if not the tile layer
		if (typeof layer._url === "undefined"){
			map.removeLayer(layer);
		}
	});

	//create geojson container object
	var geojson = {
		"type": "FeatureCollection",
		"features": []
	};

	//split data into features
	var dataArray = data.split(", ;");
	dataArray.pop();
    
    //console.log(dataArray);
	
	//build geojson features
	dataArray.forEach(function(d){
		d = d.split(", "); //split the data up into individual attribute values and the geometry

		//feature object container
		var feature = {
			"type": "Feature",
			"properties": {}, //properties object container
			"geometry": JSON.parse(d[fields.length]) //parse geometry
		};

		for (var i=0; i<fields.length; i++){
			feature.properties[fields[i]] = d[i];
		};

		//add feature names to autocomplete list
		if ($.inArray(feature.properties.featname, autocomplete) == -1){
			autocomplete.push(feature.properties.featname);
		};

		geojson.features.push(feature);
	});
	
    //console.log(geojson);
    
    //activate autocomplete on featname input
    $("input[name=featname]").autocomplete({
        source: autocomplete
    });

	var mapDataLayer = L.geoJson(geojson).addTo(map);
};
