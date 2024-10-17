<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "boothsystem";
$conn = new mysqli($host,$user, $pass,$db);

if ($conn ->connection_error){
    echo "failed to connect to db".$conn -> connect_error;
}

?>
