$(document).ready(initialize);

var tabLog = [];

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
    
    //ajouter geojson communes
    var commBog = L.geoJson(combog,{
        style: definestyle
    }).addTo(map);

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
	"Bloc": lyrGroup2,
    "Communes": commBog
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
	
	//function pour recuperer et ajouter la couche resultat du query
	getData()
	
    //navigation
    L.control.navbar().addTo(map);
    
    //Geocoder
    L.Control.geocoder().addTo(map);
    
    //cloropleth geojson
    function getColor(d) {
        if (d < 100) return '#008855'
        else if (d < 200) return '#13be00'
        else if (d < 300) return '#aee500'
        else if (d < 400) return '#fff831'
        else if (d < 500) return '#ff7b16'
        else return '#c80000';
      }
            
    //Associer la plage de coulour à un champ
    function definestyle(feature){
        return {
            fillColor: 
            getColor(feature.properties.prix),
            weight: 2,
            opacity: 1,
			color: 'white',
            fillOpacity: 0.7
				};
			}

    //Style requetes
    function definestyle2(feature){
        return {
            fillColor: 
            getColor(feature.properties.prix),
            weight: 2,
            opacity: 1,
			color:
            getColor(feature.properties.prix),
            fillOpacity: 0.7
				};
			}
    
    //legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 200, 300, 400, 500],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };

    legend.addTo(map);

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
				$('body').loadingModal('hide');
				$('body').loadingModal('destroy');
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
            style: definestyle2,
            onEachFeature: function (feature, layer) {
                layer.on('click', function (e) {
                    
                    var div=document.getElementById("textResult"); 
							var text = '<p style="white-space: nowrap;"><b>' + feature.properties.locnombre + '</b></br>';
							text = text + '- Surface m2:  ' + Math.round(parseFloat(feature.properties.aream2)) + " m2" + '</br>';
							text = text + "- Prix m2:   " + Math.round(parseFloat(feature.properties.prixm2))+ " €/m2" + '</br>';
							text = text + "- Adresse :  " + feature.properties.adr + '</br>';
							text = text + '- url: ' + "<a href='"+feature.properties.url+"'target='_blank'>Streetview</a>";
                             text = text	+ '</p>';
							div.innerHTML = text;
                    
                    //partie à compléter pour remplir le camembert
							d3.select("#camLog").select("svg").remove();
							tabLog = [];
							tabLog.push({"type":"Principale","valeur":feature.properties.P12_RP});
							tabLog.push({"type":"Secundaire","valeur":feature.properties.P12_RSECOC});
							tabLog.push({"type":"Vacances","valeur":feature.properties.P12_LOGVAC});
							addPie();
                }
        )}
        }).addTo(map);
		
		//zoomto couche resultat
		map.fitBounds(resultLayer.getBounds());
		
		//hide and destroy please wait modal
		$('body').loadingModal('hide');
		$('body').loadingModal('destroy');
	});
	
}

function showModal() {
	$('body').loadingModal({text: 'Loading...', backgroundColor: '#3498db',})
}

}