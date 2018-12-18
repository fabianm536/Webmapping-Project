<?php 
$config_dbname = 'lorena'; // nom de la base de données 
$config_user = 'postgres'; // utilisateur ayant accès à la base 
$config_password = 'postgres'; // mot de passe de l'utilisateur 

$pg_conn = pg_connect("host=localhost dbname=$config_dbname user=$config_user password=$config_password"); 
pg_set_client_encoding($pg_conn,"UNICODE"); // déclaration du jeu de caractères en unicode pour la gestion correcte des accents

//get the table and fields data
$table = $_GET['table'];
$fields = $_GET['fields'];

//turn fields array into formatted string
$fieldstr = "";
foreach ($fields as $i => $field){
	$fieldstr = $fieldstr . "l.$field, ";
}

//get the geometry as geojson in WGS84
$fieldstr = $fieldstr . "ST_AsGeoJSON(ST_Transform(l.geom,4326)) as geojson";

//create basic sql statement
$sql = "SELECT $fieldstr FROM $table l";
$result = pg_query($pg_conn,$sql); 

$feature = array(); 
while ($row = pg_fetch_assoc($result)) { 
    $res['scanombre'] = $row['scanombre']; 
    $geom = $row['geojson']; // chargement de la colonne géométrique en GeoJSON 

    $feature[] = '{"type": "Feature", "geometry": ' . $geom . ', "properties": ' . json_encode($res) . '}'; // création de l'objet GeoJSON contenant la géométrie et les valeurs attributaires d'un enregistrement de la base 
} 

echo '{"type": "FeatureCollection", "features": [' . implode(', ',$feature) . ']}'; // liste de tous les objets GeoJSON provenants de la base
?>
