<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}

session_start();
require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'/php/connectDb.php');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if(isset($_POST["logout"])) {
    $success = true;
    $message = 'Logged out successfully';
    
    if(isset($_SESSION['user']['UserID'])) {
        try {
            $sqlStat = "UPDATE users SET Status='inactive' WHERE UserID = ?";
            $stmtOn = $conn->prepare($sqlStat);
            $stmtOn->bind_param("i", $_SESSION['user']['UserID']);
            $stmtOn->execute();
        } catch (Exception $e) {
            $success = false;
            $message = 'Database update failed';
        }
    }

    $_SESSION = array();


    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-3600, '/');
    }
    
    session_destroy();
    
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid logout request'
    ]);
}
?>