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

//coordonnes du pointeur de la souris
map.addControl(new ol.control.MousePosition());

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
map.setView(view);

//Deplacement de la carte avec la souris
map.addInteraction(new ol.interaction.DragPan());

//Zoom sur la carte avec la souris
map.addInteraction(new ol.interaction.MouseWheelZoom());

//rotation de la carte avec shift+clic souris
 map.addInteraction(new ol.interaction.DragRotate());

