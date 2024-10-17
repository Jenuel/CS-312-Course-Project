<?php

require_once 'connectDb.php';

header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $boothName =$_POST['boothName'];
    $orgName =$_POST['orgName'];
    $schedules = $_POST['schedules'];
    $location = $_POST['location'];

    $createBooth = "INSERT INTO booths (booth_name, org_name, schedules, location) 
                 VALUES ('$boothName', '$orgName', '$schedules', '$location')";

    if ($conn->query($createBooth) === TRUE) {
        echo "Booth created successfully!";
    } else {
        echo "Error creating booth: " . $conn->error;
    }
}

?>