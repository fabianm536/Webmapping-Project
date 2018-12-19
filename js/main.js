$(document).ready(initialize);

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
    

    //minimap
    var osm2 = new L.TileLayer(urlOsm);
    var miniMap = new L.Control.MiniMap(osm2,{position:'bottomleft'}).addTo(map);
    
    //control layers
    L.control.layers(baseMaps).addTo(map);
	
	getData()

};

function getData(){

	$("#formSelect").submit(function(event) {
    event.preventDefault();

    $("#result").html('');

    var values = $(this).serialize();

	
	$.getJSON( "php/getData.php", values )
    .done(function( data, textStatus, jqXHR ) {
        if ( console && console.log ) {
            console.log( "La solicitud se ha completado correctamente." );
        }
    })
    .fail(function( jqXHR, textStatus, errorThrown){
        if ( console && console.log ) {
            console.log( "Algo ha fallado: " +  textStatus );
        }
	});
		
})
}