<?php
// Allow cross-origin requests and define accepted request methods and headers
header('Access-Control-Allow-Origin: http://10.241.155.155:8080'); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Include the database connection script
require_once(realpath($_SERVER["DOCUMENT_ROOT"]) . '/php/connectDb.php');

// Set the response content type to JSON
header('Content-Type: application/json; charset=utf-8');

// Retrieve and decode the JSON payload from the client
$test = json_decode(file_get_contents("php://input"), true);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $test['action']; // Determine the action (e.g., 'signUp', 'signIn')

    // Handle the Sign-Up action
    if ($action === 'signUp') {
        // Collect user details from the POST request
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Check if the email is already registered
        $checkEmailQuery = "SELECT * FROM users WHERE SchoolEmail = ?";
        $stmt = $conn->prepare($checkEmailQuery);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Email already exists, return an error response
            echo json_encode(["success" => false, "error" => "Email already in use"]);
        } else {
            // Insert the new user into the database
            $insertQuery = "INSERT INTO users (FirstName, LastName, SchoolEmail, Password, Image) VALUES (?, ?, ?, ?, ?)";
            $insertStmt = $conn->prepare($insertQuery);

            // Include a default profile image
            $imageData = file_get_contents("./vendor/res/1564534_customer_man_user_account_profile_icon.png");

            $insertStmt->bind_param("ssssb", $firstName, $lastName, $email, $password, $imageData);

            if ($insertStmt->execute()) {
                // User registered successfully
                echo json_encode(["success" => true, "message" => "User registered successfully"]);
            } else {
                // Database error occurred
                echo json_encode(["error" => "Error: " . $conn->error]);
            }
        }

    // Handle the Sign-In action
    } elseif ($action === 'signIn') {
        // Collect user login details from the JSON payload
        $email = $test['email'];
        $password = $test['password'];

        // Validate the credentials against the database
        $sql = "SELECT * FROM users WHERE SchoolEmail = ? AND Password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc(); // Retrieve user details

            if ($user['Status'] == 'inactive') {
                // Initialize a session for the user
                session_start();
                $_SESSION['user'] = [
                    'UserID' => $user['UserID'],
                    'FirstName' => $user['FirstName'],
                    'LastName' => $user['LastName']
                ];

                $userID = $user['UserID'];

                // Check if the user is a vendor
                $vendorQuery = "SELECT VendorID, OrgID FROM vendor WHERE UserID = ?";
                $vendorStmt = $conn->prepare($vendorQuery);
                $vendorStmt->bind_param("i", $userID);
                $vendorStmt->execute();
                $vendorResult = $vendorStmt->get_result();

                if ($vendorResult->num_rows > 0) {
                    $vendor = $vendorResult->fetch_assoc();

                    if (isset($vendor['VendorID']) && isset($vendor['OrgID'])) {
                        // Vendor-specific session details
                        $_SESSION['user']['role'] = 'vendor';
                        $_SESSION['user']['VendorID'] = $vendor['VendorID'];
                        $_SESSION['user']['OrgID'] = $vendor['OrgID'];

                        echo json_encode([
                            "success" => true,
                            "role" => "vendor",
                            "message" => "User login successfully",
                            "UserID" => $vendor['VendorID']
                        ]);
                        exit;
                    }
                }

                // Check if the user is a customer
                $customerQuery = "SELECT CustomerID FROM customer WHERE UserID = ?";
                $customerStmt = $conn->prepare($customerQuery);
                $customerStmt->bind_param("i", $userID);
                $customerStmt->execute();
                $customerResult = $customerStmt->get_result();

                if ($customerResult->num_rows > 0) {
                    $customer = $customerResult->fetch_assoc();

                    if (isset($customer['CustomerID'])) {
                        // Customer-specific session details
                        $_SESSION['user']['role'] = 'customer';
                        $_SESSION['user']['CustomerID'] = $customer['CustomerID'];

                        echo json_encode([
                            "success" => true,
                            "role" => "customer",
                            "message" => "User login successfully",
                            "UserID" => $customer['CustomerID']
                        ]);
                        exit;
                    }
                }
            }

            // Invalid credentials
            echo json_encode(["error" => "Incorrect email or password"]);
            exit;
        } else {
            // Email and password combination not found
            echo json_encode(["error" => "Incorrect email or password"]);
        }
    }
}
?>
