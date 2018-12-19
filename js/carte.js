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
    
    //ajouter geojson avec des labels en popup
	$.when(secteurs).done(function() {
		var secteursData = L.geoJSON(secteurs.responseJSON,{
            onEachFeature: function (feature, layer) {
					layer.bindPopup("Localidad: "+feature.properties.locnombre+"<br>Surface m2: "+feature.properties.aream2+"<br>Prix m2: "+feature.properties.prixm2);
                }
        }).addTo(map);
	});

    //control layers
    L.control.layers(baseMaps).addTo(map);
    
    //minimap
    var osm2 = new L.TileLayer(urlOsm);
    var miniMap = new L.Control.MiniMap(osm2,{position:'bottomleft'}).addTo(map);
    
    //ajouter geojson
    var commBog = L.geoJson(combog,{
        style: definestyle
    }).addTo(map);
    
    //SearchControl
    var searchControl = new L.Control.Search({
        layer: commBog,
        propertyName:'locnombre'
    });
    
    //SearchControl
    map.addControl(searchControl);
    
    //ajouter legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML +=
            '<img src="leyenda4.png" alt="legend" width="50" height="50">';

        return div;
        };

    legend.addTo(map);
    
    //navigation
    L.control.navbar().addTo(map);

    
 //cloropleth geojson
    function getColor(d) {
        if (d < 215) return '#1a9641'
        else if (d < 344) return '#a6d96a'
        else if (d < 474) return '#ffffc0'
        else if (d < 603) return '#fdae61'
        else return '#d7191c';
      }
            
    //Associer la plage de coulour à un champ
    function definestyle(feature){
        return {
            fillColor: 
            getColor(feature.properties.prix),
            weight: 2,
            opacity: 0,
			color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
				};
			}
}