<?php
session_start(); 

require_once '../connectDb'; 

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if ($_SESSION['user']['role'] === 'vendor') {
       
        $orgID = $_SESSION['user']['OrgID']; 
      
        $query = "SELECT * FROM booths WHERE OrgID = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $orgID);
        $stmt->execute();
        $boothResult = $stmt->get_result();
        
        $booths = [];
        while ($row = $boothResult->fetch_assoc()) {
            $booths[] = $row;
        }
        
    
        echo json_encode($booths);

    } elseif ($_SESSION['user']['role'] === 'customer') {
        $query = "SELECT * FROM booths";
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
    $orgID = $_SESSION['user']['OrgID'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $schedules = $_POST['schedules'];
    $location = $_POST['location'];
    //boothIcon
    //status?

    $insertQuery = "INSERT INTO booths (orgID, title, description, schedules, location ) VALUES (?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("sssss", $orgID, $title, $description, $schedules, $location);
    if ($insertStmt->execute()) {
        http_response_code(201); // Send 201 Created status code
        echo json_encode(["success" => "Booth created successfully"]); 
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
    
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
