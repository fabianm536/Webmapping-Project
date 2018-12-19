var map,
	fields = ["scanombre"];


function initialize(){

	var map = L.map('map',{
    crs: L.CRS.EPSG3857,
	minZoom: 2,
	maxZoom: 22,
	zoomControl: true              
	}).setView([4.65, -74.1], 11);   	

	var urlOsm = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(urlOsm);  
    var urlLight = 'https://api.mapbox.com/styles/v1/lorenaposada/cjok5nnw70j2b2sqrx17y9cff/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9yZW5hcG9zYWRhIiwiYSI6IjdCcGNDZzAifQ.vel_GiKVU4-YeKnbmh0ELQ';
    var light = new L.TileLayer(urlLight).addTo(map);
    

	var options =	{
	center: new L.LatLng(4.55, -74.1),
	zoom: 9,
	layers:[light],
	};

    var wmsLayer2 = L.tileLayer.wms('http://serviciosgis.catastrobogota.gov.co/arcgis/services/Imagenes/Ortho2014/MapServer/WMSServer', {
    layers: 'Ortho 2014'
    });
    
    //cartes base
    var baseMaps = {
        "light":light,
        "osm":osm,
        "ortho2014":wmsLayer2
         };
    
    //control d'escale
    map.addControl(L.control.scale({                           
        position: 'bottomright',
		imperial: true
        }));
    
    //ajouter result de requet postgis
	var secteurs = $.ajax({
	  url:"http://localhost/webmapping/php/getData.php?",
	  dataType: "json",
	  success: console.log("County data successfully loaded."),
	  error: function (xhr) {
	alert(xhr.statusText)
	}
	})
	$.when(secteurs).done(function() {
		var secteursData = L.geoJSON(secteurs.responseJSON).addTo(map);
	});

    //minimap
    var osm2 = new L.TileLayer(urlOsm);
    var miniMap = new L.Control.MiniMap(osm2,{position:'bottomleft'}).addTo(map);
    
    //control layers
    L.control.layers(baseMaps).addTo(map);
}






