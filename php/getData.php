<?php 
$config_dbname = 'lorena'; // nom de la base de données 
$config_user = 'postgres'; // utilisateur ayant accès à la base 
$config_password = 'postgres'; // mot de passe de l'utilisateur 

$pg_conn = pg_connect("host=localhost dbname=$config_dbname user=$config_user password=$config_password"); 
pg_set_client_encoding($pg_conn,"UNICODE"); // déclaration du jeu de caractères en unicode pour la gestion correcte des accents

//get the table and fields data
$table = 'communes';
$field = 'locnombre';
$table1 = 'bloc';
$field1 = 'prixm2';
$table2 = 'parcelle';
$field2 = 'aream2';

//create sql statement 
$sql = "SELECT ST_AsGeoJSON(ST_Transform(p.geom,4326)) as geojson, $field, $field1, $field2 FROM $table1 b LEFT JOIN $table c ON st_intersects(c.geom,b.geom) LEFT JOIN $table2 p ON st_intersects(b.geom,p.geom) WHERE loccodigo = '09' and (prixm2 between 0 and 100) and (p.aream2 between 80 and 90)";
$result = pg_query($pg_conn,$sql); 

$feature = array(); 
while ($row = pg_fetch_assoc($result)) { 
	$res['locnombre'] = $row['locnombre'];
	$res['prixm2'] = $row['prixm2'];
	$res['aream2'] = $row['aream2'];
    $geom = $row['geojson']; // chargement de la colonne géométrique en GeoJSON 

    $feature[] = '{"type": "Feature", "geometry": ' . $geom . ', "properties": ' . json_encode($res) . '}'; // création de l'objet GeoJSON contenant la géométrie et les valeurs attributaires d'un enregistrement de la base 
} 

echo '{"type": "FeatureCollection", "features": [' . implode(', ',$feature) . ']}'; // liste de tous les objets GeoJSON provenants de la base
?>
