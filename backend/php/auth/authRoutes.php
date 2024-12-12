<?php
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once (realpath($_SERVER["DOCUMENT_ROOT"]) .'/php/connectDb.php');

header('Content-Type: application/json; charset=utf-8');

$test=json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $test['action'];
    
    // Sign-Up
    if ($action === 'signUp') {
    
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        // $hashedPassword = md5($password);

        // Check if email is already registered
        $checkEmailQuery = "SELECT * FROM users WHERE SchoolEmail = ?";
        $stmt = $conn->prepare($checkEmailQuery);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {    
            echo json_encode(["success" => false, "error" => "Email already in use"]);
        } else {
            $insertQuery = "INSERT INTO users (FirstName, LastName, SchoolEmail, Password) 
                            VALUES (?, ?, ?, ?)";
            $insertStmt = $conn->prepare($insertQuery);
            $insertStmt->bind_param("ssss", $firstName, $lastName, $email, $password);

            if ($insertStmt->execute()) {
                echo json_encode(["success" => true, "message" => "User registered successfully"]); //Redirection will happen in the frontend
            } else {
                echo json_encode(["error" => "Error: " . $conn->error]);
            }
        }
    
    // Login
    } elseif ($action === 'signIn') {

        $email = $test['email'];
        $password = $test['password'];

        // Hash the password using MD5
        // $hashedPassword = md5($password);

        $sql = "SELECT * FROM users WHERE SchoolEmail = ? AND Password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
             
            if ($user['Status'] == 'inactive') {
            session_start();
            /* For disabling multiple logins.
            $sqlStat = "UPDATE users SET Status='active' WHERE SchoolEmail = ? AND Password = ?";
            $stmtOn = $conn->prepare($sqlStat);
            $stmtOn->bind_param("ss", $email, $password);
            $stmtOn->execute();
            */

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
            
                // Validate that the required keys exist
                if (isset($vendor['VendorID']) && isset($vendor['OrgID'])) {
                    $_SESSION['user']['role'] = 'vendor';
                    $_SESSION['user']['VendorID'] = $vendor['VendorID'];
                    $_SESSION['user']['OrgID'] = $vendor['OrgID'];
            
                    echo json_encode([
                        "success" => true,
                        "role" => "vendor",
                        "message" => "User login successfully",
                        "UserID" => $vendor['VendorID']
                    ]); // Redirection will happen in frontend
                } else {
                    echo json_encode([
                        "success" => false,
                        "message" => "Vendor details are incomplete."
                    ]);
                }
            
                exit;
            }
            

            // Check if the user is a customer
            $customerQuery = "SELECT CustomerID FROM customer WHERE UserID = ?";
            $customerStmt = $conn->prepare($customerQuery);
            $customerStmt->bind_param("i", $userID);
            $customerStmt->execute();
            $customerResult = $customerStmt->get_result();
        
            if ($customerResult->num_rows > 0) {
                $customer = $customerResult->fetch_assoc();
            
                // Validate that the required key exists
                if (isset($customer['CustomerID'])) {
                    $_SESSION['user']['role'] = 'customer';
                    $_SESSION['user']['CustomerID'] = $customer['CustomerID'];
            
                    // Prepare response
                    $transport = [
                        "success" => true,
                        "role" => "customer",
                        "message" => "User login successfully",
                        "UserID" => $customer['CustomerID']
                    ];
                    echo json_encode($transport); // Redirection will happen in frontend
                } else {
                    // Handle case where CustomerID is missing
                    echo json_encode([
                        "success" => false,
                        "message" => "Customer details are incomplete."
                    ]);
                }
            
                exit;
            }
            

        } else {
            echo json_encode(["error" => "Incorrect email or password"]);

        }

            exit();
            
        } else {
            echo json_encode(["error" => "Incorrect email or password"]);
        }
    }
}
?>
