<?php

$DB_HOST = "localhost";
$DB_USER = "devuser";
$DB_PASSWORD = "devuser";
$DB_NAME = "boothsystem";

$conn = new mysqli($DB_HOST,$DB_USER, $DB_PASSWORD,$DB_NAME, 3306);

if ($conn ->connect_error){
    echo "failed to connect to db".$conn -> connect_error;
} else {
    
}


?>
