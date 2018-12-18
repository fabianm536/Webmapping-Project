var map,
	fields = ["scanombre"];


function initialize(){

	var map = L.map('map',{
    crs: L.CRS.EPSG3857,
	minZoom: 2,
	maxZoom: 22,
	zoomControl: true              
	}).setView([4.65, -74.1], 11);   	

	var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');  
    var light = new L.TileLayer('https://api.mapbox.com/styles/v1/lorenaposada/cjok5nnw70j2b2sqrx17y9cff/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9yZW5hcG9zYWRhIiwiYSI6IjdCcGNDZzAifQ.vel_GiKVU4-YeKnbmh0ELQ');

	var options =	{
	center: new L.LatLng(4.55, -74.1),
	zoom: 9,
	layers:[light],
	};


    //ajouter des donnes wms
    var wmsLayer = L.tileLayer.wms("http://serviciosgis.catastrobogota.gov.co/arcgis/services/Imagenes/Ortho2014/MapServer/WMSServer", {
    layers: 'Ortho 2014',
    format: 'image/png',
    transparent: true,
	opacity: 0.50,
    crs: L.CRS.EPSG3857,
    
    });

    var wmsLayer2 = L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
    layers: 'nasa:bluemarble'
    });
    
    //cartes base
    var baseMaps = {
        "light":light,
        "osm":osm,
        "ortho2014":wmsLayer,
        "nasa":wmsLayer2
         };
    
    //control d'escale
    map.addControl(L.control.scale({                           
        position: 'bottomright',
		imperial: true
        }));
    

	var secteurs = $.ajax({
	  url:"http://localhost/webmapping/php/getData.php?table=secteur_cadastral&fields[]=scanombre",
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

    
    //control layers
    L.control.layers(baseMaps).addTo(map);
}






