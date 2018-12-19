<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Webmapping</title>
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />

    </head>
    
    <body onload="initialize();">
        <header>
            <div class = "container">
            <h1>comunnes</h1>
            </div>
        </header>
        <center>
        <h1>elija una comuna</h1><br>
            <div class="panel info">
              <div class="panel gheading">
                  <strong> comuna</strong>
                </div>
            </div>
            <form action="php/getData.php" name=formSelect method="post">
                <?php
                require 'php/conndb.php';
                $query="SELECT loccodigo, locnombre FROM communes ORDER BY loccodigo ASC";
                $resultado = pg_query($conexion, $query)or die("error en la consulta SQL");
                $numReg = pg_num_rows($resultado);

                if($numReg>0){
                ?>
                <select required name="idcommune" >
                    <option selected></option>
                    <?php
                    while ($fila=pg_fetch_array($resultado)){
                    echo "<option value ".$fila['loccodigo'].">".$fila['locnombre']."</option>";
                        }
                    ?>
                    </select>
                    <?php
                    }else{
                        echo "error";
                    }
                    pg_close($conexion);
                    ?>
                <p><input type="submit" /></p>
            </form>
        </center>
        <div id="map" style="position: absolute;top: 100;left: 100;width: 99%;height: 70%;"></div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
        <script src="lib/Leaflet-MiniMap-master/src/Control.MiniMap.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/carte.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
	</body>
</html>