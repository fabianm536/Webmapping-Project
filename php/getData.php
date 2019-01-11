<?php 

require 'conndb.php';

//recuperer les données de la requete index.php select
$idcommune = $_GET['idcommune'];
$surface = $_GET['surface'];
$prix = $_GET['prix'];

//creation de variables
$table = 'communes';
$field = 'locnombre';
$table1 = 'bloc';
$field1 = 'prixm2';
$table2 = 'parcelle';
$field2 = 'aream2';
$table3 = 'adresse';	
 
//creation champ geojson
$select1 = "SELECT ST_AsGeoJSON(ST_Transform(p.geom,4326)) as geojson";

//sql adresse unique et url streetview
$selectadresse = "SELECT distinct ON (p.lotcodigo) a.pdoclote, (a.pdonvial || ' ' || a.pdotexto) as adr, ('https://www.google.com/maps?q&layer=c&cbll='||ST_Y(ST_intersection(a.geom, a.geom))||','|| ST_X(ST_intersection(a.geom, a.geom))||'&cbp=12,180,0,0,0&z=18') as url, ST_Y(ST_intersection(a.geom, a.geom)) as lat, ST_X(ST_intersection(a.geom, a.geom)) as long from parcelle p inner join adresse a on a.pdoclote = p.lotcodigo WHERE (p.aream2 $surface) order by p.lotcodigo, a.id desc";

//where, condition de requete index.php
$where = "loccodigo = '$idcommune' and (prixm2 $prix) and (p.aream2 $surface)";

//sql requete final
$sql = "$select1, $field, $field1, $field2 , adr, url, lat, long FROM $table1 b LEFT JOIN $table c ON st_intersects(c.geom,b.geom) LEFT JOIN $table2 p ON st_intersects(b.geom,p.geom) LEFT JOIN ($selectadresse) s1 ON s1.pdoclote = p.lotcodigo WHERE $where";

//recuperer le resultat de la requete
$result = pg_query($conexion,$sql);

if (!$result) {
  echo "An error occurred.\n";
  exit;
}

//exporter données en format geojson apres la requete php
$feature = array(); 
while ($row = pg_fetch_assoc($result)) { 
	$res['locnombre'] = $row['locnombre'];
	$res['prixm2'] = $row['prixm2'];
	$res['aream2'] = $row['aream2'];
	$res['adr'] = $row['adr'];
	$res['url'] = $row['url'];
	$res['lat'] = $row['lat'];
	$res['long'] = $row['long'];
    $geom = $row['geojson']; // chargement de la colonne géométrique en GeoJSON 

    $feature[] = '{"type": "Feature", "geometry": ' . $geom . ', "properties": ' . json_encode($res) . '}'; // création de l'objet GeoJSON contenant la géométrie et les valeurs attributaires d'un enregistrement de la base 
} 

echo '{"type": "FeatureCollection", "features": [' . implode(', ',$feature) . ']}'; // liste de tous les objets GeoJSON provenants de la base

//echo json_encode(array('sql' => $sql));

?>