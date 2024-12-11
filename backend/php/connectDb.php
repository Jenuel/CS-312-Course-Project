<?php

$DB_HOST = "mysql-container";  // Use container name
$DB_USER = "pilot";           // Use the MySQL user we created
$DB_PASSWORD = "pilot";     // Use the password we set
$DB_NAME = "Blitzkrieg";

$conn = new mysqli($DB_HOST,$DB_USER, $DB_PASSWORD,$DB_NAME, 3306);

if ($conn ->connect_error){
    echo "failed to connect to db".$conn -> connect_error;
} else {
    
}


?>
