$(document).ready(initialize);

function initialize(){
    
	var map = L.map('map',{
	crs: L.CRS.EPSG3857,
	minZoom: 2,
	maxZoom: 18,
	zoomControl: true              
	}).setView([4.55, -74.1], 11);   



	var urlOsm = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}); 
    var urlLight = 'https://api.mapbox.com/styles/v1/lorenaposada/cjok5nnw70j2b2sqrx17y9cff/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9yZW5hcG9zYWRhIiwiYSI6IjdCcGNDZzAifQ.vel_GiKVU4-YeKnbmh0ELQ';
	var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
    var light = new L.TileLayer(urlLight).addTo(map);
    var resultLayer = L.geoJson();
	var resultPoint = L.geoJson();
	var lastClickedLayer;
	
	var secteurCadastral = new L.tileLayer.wms('http://localhost/cgi-bin/webfoncier/qgis_mapserv.fcgi?', {
		layers: 'secteur_cadastral20181223181327392',
		format: 'image/jpeg',
		transparent: true,
		opacity: 0.5
	});
	
	var bloc = new L.tileLayer.wms('http://localhost/cgi-bin/webfoncier/qgis_mapserv.fcgi?', {
		layers: 'bloc20181224162909862',
		format: 'image/jpeg',
		transparent: true,
		opacity: 0.5
	});	
	
	var batiment = new L.tileLayer.wms('http://localhost/cgi-bin/webfoncier/qgis_mapserv.fcgi?', {
		layers: 'batiment20181220190743156',
		format: 'image/jpeg',
		transparent: true,
		opacity: 0.5
	});	
   
   
    //ajouter geojson communes
    var commBog = L.geoJson(combog,{
        style: definestyle,
    }).addTo(map);
	
	//layers by zoom
	map.on('zoomend', function() {
		if (map.getZoom() <13){
			map.removeLayer(secteurCadastral);
			map.removeLayer(bloc);
			map.addLayer(commBog);
		} else if (map.getZoom() <17) {
			map.removeLayer(commBog);
			map.removeLayer(bloc);
			map.addLayer(secteurCadastral);
		} else {
			map.removeLayer(commBog);
			map.removeLayer(secteurCadastral);
			map.addLayer(bloc);
		}
	});


    
    //cartes base
    var baseMaps = {
        "Light":light,
        "OpenStreetMap":OpenStreetMap_Mapnik,
		"WorldImagery":Esri_WorldImagery
         };	
	
	var overlayMaps = {
		"Sec. Cadastral": secteurCadastral,
		"Communes":commBog,
		"Bloc":bloc,
		"Batiment": batiment
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
    L.control.layers(baseMaps,overlayMaps,{autoZIndex: true}).addTo(map);
	
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
            fillOpacity: 0.4
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
	
	//styleSelection	
	var stylelayer = {
    default: {
        color: "blue",
        opacity: 1,
        fillcolor: "blue",
        fillOpacity: 0.1,
        weight: 3
    },
    highlight: {
        weight: 5,
        color: "cyan",
        dashArray: '',
        fillOpacity: 0.7
    }

	}



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

		var url = "http://localhost/Webmapping-Project/php/getData.php?"+values;
		

		var resultData = $.ajax({
		  url:url,
		  dataType: "json",
		  success: console.log("Data successfully loaded."),
		  error: function (xhr) {
		alert(xhr.statusText)
		}
		})


		$.when(resultData).done(function() {
			
			//si aucun resultat
			if (resultData.responseJSON.features.length===0){
				//hide and destroy please wait modal
				$('body').loadingModal('hide');
				$('body').loadingModal('destroy');
				alert("Aucun résultat");
			
			};

			//ajouter geojson avec des labels en popup
			resultLayer = L.geoJSON(resultData.responseJSON,{
				    
				style: stylelayer.default,

				onEachFeature: function (feature, layer) {
					layer.on('click', function (e) {

						var div=document.getElementById("textBog"); 
								var text = '<p style="white-space: nowrap;"><b>' + feature.properties.locnombre + '</b></br>';
								text = text + '- Surface m2:  ' + Math.round(parseFloat(feature.properties.aream2)) + " m2" + '</br>';
								text = text + "- Prix m2:   " + Math.round(parseFloat(feature.properties.prixm2))+ " €/m2" + '</br>';
								text = text + "- Adresse :  " + feature.properties.adr + '</br>';
								text = text + '- url: ' + "<a href='"+feature.properties.url+"'target='_blank'>Streetview</a>";
								 text = text	+ '</p>';
								div.innerHTML = text;
						
						//showgraph
						showGraph(feature.properties.lat,feature.properties.long);
						
						//showPoints Transport
						showTransport(feature.properties.lat,feature.properties.long);
						
						//hightlight selection
						
						setStyle(e);

						}
				)}
			}).addTo(map);

			//zoomto couche resultat
			map.fitBounds(resultLayer.getBounds());
			
			


			//hide and destroy please wait modal
			$('body').loadingModal('hide');
			$('body').loadingModal('destroy');
		});

	});
}
	
function showTransport(lat,long){
	
	map.removeLayer(resultPoint);
	var values = "xadresse="+long+"&yadresse="+lat;
	var url = "http://localhost/Webmapping-Project/php/getTransData.php?" + values;
	
	var resultData = $.ajax({
		  url:url,
		  dataType: "json",
		  success: console.log("Point data successfully loaded."),
		  error: function (xhr) {
		alert(xhr.statusText)
		}
		})
	$.when(resultData).done(function() {
	var transpIcon = L.icon({
		iconUrl: 'Images/transpIcon.png',
		iconSize:     [40, 50], // size of the icon
		iconAnchor:   [22, 44], // point of the icon which will correspond to marker's location
});
		
	function onEachFeature(feature, layer) {
		if (feature.properties && feature.properties.ntrnombre) {
			layer.bindPopup("Arret: "+feature.properties.ntrnombre+ '</b></br>'+"Distance: "+ feature.properties.dist_min+" m"+ '</b></br>'+"Type: "+ feature.properties.ntrmtransp_des);
		}
	}
	
	resultPoint = L.geoJSON(resultData.responseJSON,{
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng,{icon: transpIcon});
		}, onEachFeature: onEachFeature
	}).addTo(map);
	
	map.fitBounds(resultPoint.getBounds());
		
	});
	
}
	
function setStyle(e){
	if(lastClickedLayer){
		lastClickedLayer.setStyle(stylelayer.default);
	}
	var layer = e.target;
	layer.setStyle(stylelayer.highlight);
	
	lastClickedLayer = layer;
}
	
function showModal() {
	$('body').loadingModal({text: 'Loading...', backgroundColor: '#3498db',})
}

}