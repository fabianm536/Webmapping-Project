var mapOptions = {
  projection: 'EPSG:4326',
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: ({
      collapsible: false
    })
  }),
  // on centre la vue par défaut sur Bogota
  view: new ol.View({
    center: ol.proj.fromLonLat([-74.0924,4.6349]),
    zoom: 11
  })
}
var map = new ol.Map(mapOptions);
//chargement de la carte
//var map = new ol.Map({target:’map’});

//grande barre de zoom
map.addControl(new ol.control.ZoomSlider());

//carte de vue globale
map.addControl(new ol.control.OverviewMap());


//credits des fonds de carte
map.addControl(new ol.control.Attribution());

//affichage plein ecran
map.addControl(new ol.control.FullScreen());

//controle mousePosition
var mousePosition = new ol.control.MousePosition({
             coordinateFormat: ol.coordinate.createStringXY(4),
             projection: 'EPSG:4326',
             target: document.getElementById('mouse-position'),
             undefinedHTML: '&nbsp;'
         });
         map.addControl(mousePosition);

//carte OSM
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});
map.addLayer(osmLayer);

//Deplacement de la carte avec la souris
map.addInteraction(new ol.interaction.DragPan());

//Zoom sur la carte avec la souris
map.addInteraction(new ol.interaction.MouseWheelZoom());

//rotation de la carte avec shift+clic souris
map.addInteraction(new ol.interaction.DragRotate());

// Couche des secteurs depuis un script PHP
var secteursLoader = function(extent, resolution, projection) {
    var url = 'http://localhost/Webmapping-Project/php/secteurs.php';
    $.ajax(url).then(function(response) {
        var format = new ol.format.GeoJSON();
        var features = format.readFeatures(
            response,
            {featureProjection: projection}
        );
        secteursSource.addFeatures(features);
    });
};

var secteursSource = new ol.source.Vector({
    loader: secteursLoader,
    strategy: ol.loadingstrategy.bbox
});

var secteursLayer = new ol.layer.Vector({
  title: 'Secteurs',
  extent: [-74.2245,4.41427,-73.9983,4.83727] ,
  source: secteursSource
});

map.addLayer(secteursLayer);