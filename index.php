<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Webmapping</title>
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />

    </head>
    
    <body>
        <header>

        </header>
        <center>

            <form id="formSelect">
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
                <p><input type="submit" value="Send"/></p>
            </form>
        </center>
        <div id="map" style="position: absolute;top: 100;left: 100;width: 99%;height: 70%;"></div>
			
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
        <script src="lib/Leaflet-MiniMap-master/src/Control.MiniMap.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/main.js"></script>
	</body>
</html>