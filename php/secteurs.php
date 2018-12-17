<?php 
$config_dbname = 'webmapping'; // nom de la base de données 
$config_user = 'postgres'; // utilisateur ayant accès à la base 
$config_password = 'postgres'; // mot de passe de l'utilisateur 

$pg_conn = pg_connect("host=localhost dbname=$config_dbname user=$config_user password=$config_password"); 
pg_set_client_encoding($pg_conn,"UNICODE"); // déclaration du jeu de caractères en unicode pour la gestion correcte des accents

$sql = "SELECT ST_AsGeoJSON(geom) as geojson, scanombre FROM secteur_cadastral WHERE scacodigo = '002535'"; 
$result = pg_query($pg_conn,$sql); 

$feature = array(); 
while ($row = pg_fetch_assoc($result)) { 
    $res['scanombre'] = $row['scanombre']; 
    $geom = $row['geojson']; // chargement de la colonne géométrique en GeoJSON 

    $feature[] = '{"type": "Feature", "geometry": ' . $geom . ', "properties": ' . json_encode($res) . '}'; // création de l'objet GeoJSON contenant la géométrie et les valeurs attributaires d'un enregistrement de la base 
} 

echo '{"type": "FeatureCollection", "features": [' . implode(', ',$feature) . ']}'; // liste de tous les objets GeoJSON provenants de la base
?>
