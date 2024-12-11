<?php

$DB_HOST = "mysql-container";  
$DB_USER = "pilot";           
$DB_PASSWORD = "pilot123";    
$DB_NAME = "Blitzkrieg";

$conn = new mysqli($DB_HOST,$DB_USER, $DB_PASSWORD,$DB_NAME, 3306);

if ($conn ->connect_error){
    echo "failed to connect to db".$conn -> connect_error;
} else {
    
}


?>
