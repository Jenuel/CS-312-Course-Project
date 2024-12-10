<?php
session_start(); 

require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'/php/connectDb.php');

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

$input=json_decode(file_get_contents("php://input"), true);

/*this get still not sure if will be working */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    
    if ($_SESSION['user']['role'] === 'vendor') {

        $orgID = $_SESSION['user']['OrgID']; 
      
        $query = "SELECT b.BoothID, b.Title, b.Description, b.Schedules, b.Location, b.BoothIcon, b.Status, o.OrgName
              FROM booth b
              JOIN organization o ON b.OrgID = o.OrgID
              WHERE b.OrgID = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $orgID);
        $stmt->execute();
        $boothResult = $stmt->get_result();
        
        $booths = [];
        while ($row = $boothResult->fetch_assoc()) {

            if ($row['BoothIcon'] !== null) {
                $row['BoothIcon'] = base64_encode($row['BoothIcon']);
            }
            $booths[] = $row;
        }

        echo json_encode($booths);

    } elseif ($_SESSION['user']['role'] === 'customer') {
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

    } else {
        echo json_encode(["error" => "Role not recognized"]);
    }



// Handling POST request (e.g., submitting form data or updates)
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
 

    $orgID = $_SESSION['user']['OrgID'];
    $title = $input['title'];
    $description = $input['description'];
    $schedules = $input['schedules'];
    $location = $input['location'];
    $boothIcon = null;
    $status = 'open';
    
    if ($input['boothIcon']) {
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['boothIcon']));
        $boothIcon = $imageData;
    }


    $insertQuery = "INSERT INTO booth (Title, Description, Schedules, Location, BoothIcon, Status, orgID ) VALUES (?, ?, ?, ?, ?,?,?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("ssssssi", $title, $description, $schedules, $location, $boothIcon, $status, $orgID); //check if the data types are correct
    if ($insertStmt->execute()) {
        http_response_code(201); // Send 201 Created status code
        echo json_encode(["success" => true]); 
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
    
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
