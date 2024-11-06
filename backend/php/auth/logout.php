
<?php

header('Content-Type: application/json; charset=utf-8');

if(isset($_GET["logout"])){
    session_destroy();  
    unset($_SESSION['user'] ['userID']);
    unset($_SESSION['user'] ['FirstName']);
    unset($_SESSION['user'] ['LastName']);
    
}

