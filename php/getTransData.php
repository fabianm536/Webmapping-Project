<?php 

require 'conndb.php';

$Xadresse = $_GET['xadresse'];
$Yadresse = $_GET['yadresse'];

$sql = "select ST_AsGeoJSON(ST_Transform(geom,4326)) as geojson, ntrnombre, ntrmtransp_des, (MIN(round(cast(distance as numeric),2))) dist_min
from (with index_query as (
  select 
    ntrnombre, geom,ntrmtransp_des,
	(st_distance(geom, st_setsrid(st_makepoint($Xadresse,$Yadresse),4686)))*40030173.5920411/360 as distance
  from node_transport 
  order by geom <#> st_setsrid(st_makepoint($Xadresse,$Yadresse),4686) limit 100
)
select ntrnombre, distance, ntrmtransp_des, geom from index_query ) as res
group by ntrnombre, ntrmtransp_des, geojson order by dist_min limit 10";

$result = pg_query($conexion,$sql);

if (!$result) {
  echo "An error occurred.\n";	
  exit;
}

$feature = array(); 

while ($row = pg_fetch_assoc($result)) { 
	$res['ntrnombre'] = $row['ntrnombre'];
	$res['dist_min'] = $row['dist_min'];
	$res['ntrmtransp_des'] = $row['ntrmtransp_des'];
	$geom = $row['geojson']; 

	$feature[] = '{"type": "Feature", "geometry": ' . $geom . ', "properties": ' . json_encode($res) . '}';;
} 
 
echo '{"type": "FeatureCollection", "features": [' . implode(', ',$feature) . ']}'; 

?>