
<?php
require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'/php/connectDb.php');

header('Content-Type: application/json; charset=utf-8');

if(isset($_POST["logout"])){
    $sqlStat = "UPDATE users SET Status="inactive" WHERE UserID = ?";
    $stmtOn = $conn->prepare($sqlStat);
    $stmtOn->bind_param("s",$_SESSION['user'] ['userID']);
    $stmtOn->execute();
    session_destroy();  
    unset($_SESSION['user'] ['userID']);
    unset($_SESSION['user'] ['FirstName']);
    unset($_SESSION['user'] ['LastName']);

}
