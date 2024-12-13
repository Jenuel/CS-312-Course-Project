<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Credentials: true');


ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
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

            if ($row['BoothIcon'] !== null) {
                $row['BoothIcon'] = base64_encode($row['BoothIcon']);
            }
            $booths[] = $row;
        }

        echo json_encode($booths);

    } else {
        echo json_encode(["error" => "Role not recognized"]);
    }



// Handling POST request (e.g., submitting form data or updates)
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
 
 // If boothId is present, it's an update operation
 if (isset($input['boothId'])) {
    $boothId = $input['boothId'];
    $orgID = $_SESSION['user']['OrgID'];
    $title = $input['title'];
    $description = $input['description'];
    $schedules = $input['schedules'];
    $location = $input['location'];
    
    // Check if the booth belongs to the user's organization
    $checkQuery = "SELECT BoothID FROM booth WHERE BoothID = ? AND OrgID = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("ii", $boothId, $orgID);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["error" => "Unauthorized to edit this booth"]);
        exit();
    }


    if (isset($input['boothIcon']) && !empty($input['boothIcon'])) {
        $imageData = base64_decode($input['boothIcon']);
        $updateQuery = "UPDATE booth SET Title = ?, Description = ?, Schedules = ?, Location = ?, BoothIcon = ? WHERE BoothID = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("sssssi", $title, $description, $schedules, $location, $imageData, $boothId);
    } else {
        $updateQuery = "UPDATE booth SET Title = ?, Description = ?, Schedules = ?, Location = ? WHERE BoothID = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ssssi", $title, $description, $schedules, $location, $boothId);
    }

    if ($updateStmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Error updating booth: " . $conn->error]);
    }
}  
// If no boothId, it's a create operation
else {
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
        $insertStmt->bind_param("ssssssi", $title, $description, $schedules, $location, $boothIcon, $status, $orgID);
        if ($insertStmt->execute()) {
            http_response_code(201); 
            echo json_encode(["success" => true]); 
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {

        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathSegments = explode('/', $path);
        $boothId = end($pathSegments);

        if (!is_numeric($boothId)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid booth ID"]);
            exit();
        }

        $orgID = $_SESSION['user']['OrgID'];
        
        // Check if the booth belongs to the user's organization
        $checkQuery = "SELECT BoothID FROM booth WHERE BoothID = ? AND OrgID = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param("ii", $boothId, $orgID);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized to delete this booth"]);
            exit();
        }

        // Delete the booth
        $deleteQuery = "DELETE FROM booth WHERE BoothID = ? AND OrgID = ?";
        $deleteStmt = $conn->prepare($deleteQuery);
        $deleteStmt->bind_param("ii", $boothId, $orgID);

        if ($deleteStmt->execute()) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Booth deleted successfully"]);
        } else {
            throw new Exception($conn->error);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error deleting booth: " . $e->getMessage()]);
    }
    exit(); 
}
else {
    echo json_encode(["error" => "Invalid request method"]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Invalid request method"]);
    exit();
}
