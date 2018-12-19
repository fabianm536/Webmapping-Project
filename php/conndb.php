<?php
            $user="postgres";
            $password="postgres";
            $dbname="lorena";
            $port="5432";
            $host="localhost";

            $cadenaConexion = "host=$host port=$port dbname=$dbname user=$user password=$password";

            $conexion=pg_connect($cadenaConexion) or die ("Error en la conexion:".pg_last_error());
?>