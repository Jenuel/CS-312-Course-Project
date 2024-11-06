<?php
session_start(); 

require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'/CS-312-Course-Project/backend/php/connectDb.php');

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

$input=json_decode(file_get_contents("php://input"), true);

/*this get still not sure if will be working */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    /*This checks the user if it is a vendor */
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
            $booths[] = $row;
        }
        
        echo json_encode($booths);

    } elseif ($_SESSION['user']['role'] === 'customer') {
        $query = "SELECT b.BoothID, b.Title, b.Description, b.Schedules, b.Location, b.BoothIcon, b.Status
          FROM booth b";

        // Initialize conditions and bind parameters
        $conditions = [];
        $params = [];

        // 1. Filter by Status (OPEN or CLOSE)
        if (isset($_GET['filter']) && in_array($_GET['filter'], ['OPEN', 'CLOSE'])) {
            $conditions[] = "b.Status = ?";
            $params[] = $_GET['filter'];  // Set filter value (OPEN or CLOSE)
        }

        // 2. Add WHERE clause if there are any conditions
        if (count($conditions) > 0) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        // 3. Sorting logic (only if 'sort' parameter is provided)
        if (isset($_GET['sort']) && in_array($_GET['sort'], ['A-Z', 'Z-A'])) {
            $sortOrder = $_GET['sort'] === 'A-Z' ? 'ASC' : 'DESC';
            $query .= " ORDER BY b.Title " . $sortOrder;
        }

        // Prepare and execute the query
        $stmt = $conn->prepare($query);

        // Bind parameters if needed (for filter)
        if (!empty($params)) {
            $types = str_repeat('s', count($params));  // Assuming all filter values are strings
            $stmt->bind_param($types, ...$params);     // Bind the filter parameter
        }
                
    } else {
        echo json_encode(["error" => "Role not recognized"]);
    }

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
