<?php
// Check if the request method is OPTIONS (used in preflight requests for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Allow any origin to access the resource
    header('Access-Control-Allow-Origin: *');

    // Allow only POST and OPTIONS methods for this request
    header('Access-Control-Allow-Methods: POST, OPTIONS');

    // Allow 'Content-Type' header to be included in the request
    header('Access-Control-Allow-Headers: Content-Type');

    // Cache preflight request for 20 days (in seconds)
    header('Access-Control-Max-Age: 1728000');

    // Respond with no content and plain text type
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    // Terminate the script as no further processing is needed for OPTIONS request
    die();
}

// Start a new session or resume the existing session
session_start();

// Include the database connection file
require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'/php/connectDb.php');

// Set the response headers for JSON data and allow all origins
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if the 'logout' parameter is set in the POST request
if(isset($_POST["logout"])) {

    // Initialize the response variables
    $success = true;
    $message = 'Logged out successfully';
    
    // If the user is logged in (check for a session variable 'UserID')
    if(isset($_SESSION['user']['UserID'])) {
        try {
            // SQL query to update the user's status to 'inactive' in the database
            $sqlStat = "UPDATE users SET Status='inactive' WHERE UserID = ?";

            // Prepare the SQL statement
            $stmtOn = $conn->prepare($sqlStat);

            // Bind the UserID from session to the SQL query parameter
            $stmtOn->bind_param("i", $_SESSION['user']['UserID']);
            
            // Execute the query to update the user's status
            $stmtOn->execute();
        } catch (Exception $e) {
            // If an error occurs during the database update, set success to false and set the message
            $success = false;
            $message = 'Database update failed';
        }
    }

    // Clear all session data
    $_SESSION = array();

    // If the session cookie exists, delete it by setting an expiration date in the past
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-3600, '/');
    }
    
    // Destroy the session
    session_destroy();
    
    // Return a JSON response indicating the success or failure of the logout process
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
} else {
    // If 'logout' is not set in the POST request, return a JSON response indicating an invalid request
    echo json_encode([
        'success' => false,
        'message' => 'Invalid logout request'
    ]);
}
?>