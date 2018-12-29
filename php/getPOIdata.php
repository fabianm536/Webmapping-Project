<?php 

require 'conndb.php';

$Xadresse = $_GET['xadresse'];
$Yadresse = $_GET['yadresse'];

$sql = "select des_activite, MIN(round(cast(distance as numeric),2)) dist_min
from (with index_query as (
  select 
    des_activite,
	(st_distance(geom, st_setsrid(st_makepoint($Xadresse,$Yadresse),4686)))*40030173.5920411/360 as distance
  from point_interet 
  order by geom <#> st_setsrid(st_makepoint($Xadresse,$Yadresse),4686) limit 100
)
select des_activite, distance from index_query ) as res
group by des_activite";

$result = pg_query($conexion,$sql);


//echo json_encode(array('sql' => $sql));

$feature1 = array(); 
$feature2 = array();


while ($row = pg_fetch_assoc($result)) { 

	$feature1[] = '"' . $row['des_activite'] . '"' ;
	$feature2[] =  $row['dist_min'] ;
} 
 

echo '{"labels": [' . implode(', ',$feature1) . '],' . '"datasets": [{	"label": "Distance aux points d' . "'" . 'interet (m)", "backgroundColor": "rgba(153, 51, 255,0.5)", "data": [' . implode(', ',$feature2) . ']}]}';
?>