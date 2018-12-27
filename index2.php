<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Webmapping</title>
			
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
	    <link rel="stylesheet" href="lib/Fullscreen-Loading-Modal-Indicator-Plugin-For-jQuery-loadingModal/css/jquery.loadingModal.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css?family=Quicksand:400,700" rel="stylesheet"> 
        <link rel="stylesheet" href="css/style.css" type="text/css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"/>
        <link rel="stylesheet" href="lib/Leaflet-MiniMap-master/src/Control.MiniMap.min.css">
        <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.49.0/mapbox-gl.css' rel='stylesheet' />
        <script type="text/javascript" src="communes.js"></script>

    </head>
    
    <body>
        <header onload="initialize();">
        <h1>Prix Foncier de Bogotá App</h1>
        <h3> Consultez ici </h3>
            <div class="img" style="height: 22px;">
                <img src="Images/home4.png" align="left, center"/>
                <img src="Images/logosu.png" align="right, center" style= "height:100px; width:400px;padding-left:870px;top:-90px; padding-right:30px"/>
            </div>
            <form class= "box" id="formSelect" style="width: 1000px; height:57px; padding-left:180px; margin-bottom:10px;">
            <div class="row">
                <?php
                require 'php/conndb.php';
                $query="SELECT loccodigo, locnombre FROM communes ORDER BY loccodigo ASC";
                $resultado = pg_query($conexion, $query)or die("error en la consulta SQL");
                $numReg = pg_num_rows($resultado);
                if($numReg>0){
                ?>
                <select required name="idcommune" >
                    <option selected>Commune</option>
                    <?php
                    while ($fila=pg_fetch_array($resultado)){
                    echo '<option value = "'.$fila['loccodigo'].'">'.$fila['locnombre']."</option>";
                        }
                    ?>
                    </select>
                    <?php
                    }else{
                        echo "error";
                    }
                    pg_close($conexion);
                    ?>
				
				<select required name="surface" >
					<option selected>Surface</option>
					<option value = "< 40">Moins de 40</option>
					<option value = "between 40 and 60">de 40 à 60</option>
					<option value = "between 60 and 80">de 60 à 80</option>
					<option value = "between 80 and 100">de 80 à 100</option>
					<option value = "between 100 and 150">de 100 à 150</option>
					<option value = "between 150 and 200">de 150 à 200</option>
					<option value = "between 200 and 250">de 200 à 250</option>
					<option value = "between 250 and 300">de 250 à 300</option>
					<option value = "between 350 and 400">de 350 à 400</option>
					<option value = "between 450 and 500">de 450 à 500</option>
					<option value = "> 500">plus de 500</option>
				</select>
				
				<select required name="prix">
					<option selected>Prix m2</option>
					<option value = "< 100">Moins de 100</option>
					<option value = "between 100 and 200">de 100 à 200</option>
					<option value = "between 200 and 300">de 200 à 300</option>
					<option value = "between 300 and 400">de 300 à 400</option>
					<option value = "between 400 and 500">de 400 à 500</option>
					<option value = "> 500">Plus de 500 </option>
				</select>
                <p><input type="submit" value="Aller"/></p>
                </div>
            </form>
        </header>
        
        <center>
        <div id= "container">
            <div id="map"></div>              
            <div id="textResult">
        
                <div><img src="Images/bogo2.jpg" style="top: 0px;width: 260px;"/></div>
                <div style="width: 259px;"> <b>Bogota - Colombie</b> <br> 
                Altitude 2 640 m <br>
                Superficie 1 775,98 km2 <br>
                Population: 8.200.000 (2018) </div>
				
				<canvas id="myChart"></canvas>

            </div>
        </div>
        </center>
        
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
		
        <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
        <script src="lib/Leaflet-MiniMap-master/src/Control.MiniMap.js" type="text/javascript"></script>
		
        <script type="text/javascript" src="js/main.js"></script>
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	    <script src="lib/Fullscreen-Loading-Modal-Indicator-Plugin-For-jQuery-loadingModal/js/jquery.loadingModal.js"></script>
        <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"></script>
        <script src="lib/Leaflet-MiniMap-master/src/Control.MiniMap.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/carte.js"></script> 
        
        <script src="lib/leaflet-search-master/src/leaflet-search.js"></script>
        <link rel="stylesheet" href="lib/leaflet-search-master/src/leaflet-search.css"/>
        
        <link rel="stylesheet" href="lib/Leaflet.HtmlLegend-master/src/L.Control.HtmlLegend.css" />
        <script src="lib/Leaflet.HtmlLegend-master/src/L.Control.HtmlLegend.js"></script>
        
        <link rel="stylesheet" href="lib/Leaflet.NavBar-master/src/Leaflet.NavBar.css" />
        <script src="lib/Leaflet.NavBar-master/src/Leaflet.NavBar.js"></script>
        
        <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
        <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
		
		<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
		<script type="text/javascript" src="js/graph.js"></script>
		
		
		<div class="modal"></div>
	</body>
</html>