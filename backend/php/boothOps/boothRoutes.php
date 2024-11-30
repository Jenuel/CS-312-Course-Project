<?php
session_start();

// Allow requests from specific origin (replace with your frontend's actual URL)
header("Access-Control-Allow-Origin: *"); // Change this to match the origin of your frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Allow cookies (sessions) to be passed with requests
header('Content-Type: application/json; charset=utf-8');

// If it's a preflight request, terminate early with a 200 response
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);  // End the request early
}

require_once('/usr/share/nginx/html/connectDb.php');

//require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'http://localhost:8080/connectDb.php');


$input=json_decode(file_get_contents("php://input"), true);

/*this get still not sure if will be working */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    
    $query = "SELECT b.BoothID, b.Title, b.Description, b.Schedules, b.Location, b.BoothIcon, b.Status, o.OrgName
              FROM booth b
              JOIN organization o ON b.OrgID = o.OrgID";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $boothResult = $stmt->get_result();

        $booths = [];
        while ($row = $boothResult->fetch_assoc()) {
            $booths[] = $row;
        }

        echo json_encode($booths);


// Handling POST request (e.g., submitting form data or updates)
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orgID = $_SESSION['user']['OrgID'];
    $title = $input['title'];
    $description = $input['description'];
    $schedules = $input['schedules'];
    $location = $input['location'];
    $boothIcon = $input['boothIcon'];
    $status = true;
    

    $insertQuery = "INSERT INTO booth (Title, Description, Schedules, Location, BoothIcon, Status, orgID ) VALUES (?, ?, ?, ?, ?,?,?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("ssssbsi", $title, $description, $schedules, $location, $boothIcon, $status, $orgID); //check if the data types are correct
    if ($insertStmt->execute()) {
        http_response_code(201); // Send 201 Created status code
        echo json_encode(["success" => true]); 
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
    
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
