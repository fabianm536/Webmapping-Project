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
	
	var secteurCadastral = new L.tileLayer.wms('http://localhost/cgi-bin/webfoncier/qgis_mapserv.fcgi?', {
		layers: 'secteur_cadastral20181223181327392',
		format: 'image/jpeg',
		transparent: true,
		opacity: 0.3
	});
	
	var bloc = new L.tileLayer.wms('http://localhost/cgi-bin/webfoncier/qgis_mapserv.fcgi?', {
		layers: 'bloc20181224162909862',
		format: 'image/jpeg',
		transparent: true,
		opacity: 0.3
	});	

	var options =	{
	center: new L.LatLng(4.55, -74.1),
	zoom: 9,
	layers:[light],
	};
	
	var lyrGroup = L.layerGroup([secteurCadastral]);
	var lyrGroup2 = L.layerGroup([bloc]);
    
    //cartes base
    var baseMaps = {
        "light":light,
        "osm":osm
         };
	
	//overlayMaps
	var overlayMaps = {
    "Secteur cadastral": lyrGroup,
	"Bloc": lyrGroup2
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
    L.control.layers(baseMaps,overlayMaps).addTo(map);
	
	 //ajouter legend
    var legend = L.control({position: 'bottomright'});
	
	legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML +=
            '<img src="leyenda4.png" alt="legend" width="50" height="50">';

        return div;
        };

    legend.addTo(map);
	
	//function pour recuperer et ajouter la couche resultat du query
	getData()
	


function getData(){

	$("#formSelect").submit(function(event) {
	
		//please wait modal
		showModal()

		event.preventDefault();

		$("#result").html('');

		//creer values pour get php a partir de form
		var values = $(this).serialize();

		//efacer carte
		map.removeLayer(resultLayer);


		$.getJSON( "php/getData.php", values )
		.done(function( data, textStatus, jqXHR ) {
			if ( console && console.log ) {
				//url pour recuperer geoJson resulta de php
				var url = "http://localhost/Webmapping-Project/php/getData.php?"+values;
				console.log(url);

				//executer resData pour charger le geojson a la carte
				resData(url);
			}
		})
		.fail(function( jqXHR, textStatus, errorThrown){
			if ( console && console.log ) {
				console.log( "Quelque chose a échoué: " +  textStatus );
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
    
    
	$.when(resultData).done(function() {
		
		//ajouter geojson avec des labels en popup
		resultLayer = L.geoJSON(resultData.responseJSON,{
            onEachFeature: function (feature, layer) {
					layer.bindPopup("Localidad: "+feature.properties.locnombre+"<br>Surface: "+parseFloat(feature.properties.aream2).toFixed( 2 )+" m2<br>Prix: "+parseFloat(feature.properties.prixm2).toFixed( 2) +" €/m2<br>Adresse: "+feature.properties.adr+"<br>url: "+ "<a href='"+feature.properties.url+"'target='_blank'>Streetview</a>" );
                }
        }).addTo(map);
		
		//zoomto couche resultat
		map.fitBounds(resultLayer.getBounds());
		
		//hide and destroy please wait modal
		$('body').loadingModal('hide');
		$('body').loadingModal('destroy');
	});
	
}

};

function showModal() {
	$('body').loadingModal({text: 'Loading...', backgroundColor: '#3498db',})
}

