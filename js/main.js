$(document).ready(initialize);

function initialize(){
	var map = L.map('map',{
    crs: L.CRS.EPSG3857,
	minZoom: 2,
	maxZoom: 18,
	zoomControl: true              
	}).setView([4.65, -74.1], 11);   	

	var urlOsm = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(urlOsm);  
    var urlLight = 'https://api.mapbox.com/styles/v1/lorenaposada/cjok5nnw70j2b2sqrx17y9cff/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9yZW5hcG9zYWRhIiwiYSI6IjdCcGNDZzAifQ.vel_GiKVU4-YeKnbmh0ELQ';
    var light = new L.TileLayer(urlLight).addTo(map);
    var resultLayer = L.geoJson();

	var options =	{
	center: new L.LatLng(4.55, -74.1),
	zoom: 9,
	layers:[light],
	};
	
    
    //cartes base
    var baseMaps = {
        "light":light,
        "osm":osm
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
	
	//function pour recuperer et ajouter la couche resultat du query
	getData()
	


function getData(){

	$("#formSelect").submit(function(event) {
    event.preventDefault();
		
	$("#result").html('');

    var values = $(this).serialize();
	map.removeLayer(resultLayer);
		
		
	$.getJSON( "php/getData.php", values )
	.done(function( data, textStatus, jqXHR ) {
		if ( console && console.log ) {
			var url = "http://localhost/Webmapping-Project/php/getData.php?"+values;
			console.log(url);
			resData(url);
		}
	})
	.fail(function( jqXHR, textStatus, errorThrown){
		if ( console && console.log ) {
			console.log( "Algo ha fallado: " +  textStatus );
		}
	});    

	
		
})
}

function resData(url){
	var resultData = $.ajax({
	  url:url,
	  dataType: "json",
	  success: console.log("Data successfully loaded."),
	  error: function (xhr) {
	alert(xhr.statusText)
	}
	})
    
    //ajouter geojson avec des labels en popup
	$.when(resultData).done(function() {
		
		resultLayer = L.geoJSON(resultData.responseJSON,{
            onEachFeature: function (feature, layer) {
					layer.bindPopup("Localidad: "+feature.properties.locnombre+"<br>Surface m2: "+feature.properties.aream2+"<br>Prix m2: "+feature.properties.prixm2+"<br>Adresse: "+feature.properties.adr+"<br>url: "+ "<a href='"+feature.properties.url+"'target='_blank'>Streetview</a>" );
                }
        }).addTo(map);
		map.fitBounds(resultLayer.getBounds());
	});
	
}

};

