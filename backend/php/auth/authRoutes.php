<?php

require_once '../connectDb';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    
    // Sign-Up
    if ($action === 'signUp') {
    
        $firstName = $_POST['fName'];
        $lastName = $_POST['lName'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        $hashedPassword = md5($password);

        // Check if email is already registered
        $checkEmailQuery = "SELECT * FROM users WHERE SchoolEmail = ?";
        $stmt = $conn->prepare($checkEmailQuery);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {    
            echo json_encode(["error" => "Email already in use"]);
        } else {
            $insertQuery = "INSERT INTO users (FirstName, LastName, SchoolEmail, Password) 
                            VALUES (?, ?, ?, ?)";
            $insertStmt = $conn->prepare($insertQuery);
            $insertStmt->bind_param("ssss", $firstName, $lastName, $email, $hashedPassword);

            if ($insertStmt->execute()) {
                header("Location: ../../../website/auth/login.html"); // Should be home.html with token/session
            } else {
                echo json_encode(["error" => "Error: " . $conn->error]);
            }
        }
    
    // Login
    } elseif ($action === 'signIn') {

        $email = $_POST['email'];
        $password = $_POST['password'];

        // Hash the password using MD5
        $hashedPassword = md5($password);

        
        $sql = "SELECT * FROM users WHERE SchoolEmail = ? AND Password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $email, $hashedPassword);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            session_start();
            $_SESSION['user'] = [
                'id' => $user['id'],
                'FirstName' => $user['FirstName'],
                'LastName' => $user['LastName']
            ];

            $userID = $user['id'];

            // Check if the user is a vendor
            $vendorQuery = "SELECT VendorID, OrgID FROM VENDOR WHERE UserID = ?";
            $vendorStmt = $conn->prepare($vendorQuery);
            $vendorStmt->bind_param("i", $userID);
            $vendorStmt->execute();
            $vendorResult = $vendorStmt->get_result();
        
            if ($vendorResult->num_rows > 0) {
                $vendor = $vendorResult->fetch_assoc();
                $_SESSION['user']['role'] = 'vendor';
                $_SESSION['user']['VendorID'] = $vendor['VendorID'];
                $_SESSION['user']['OrgID'] = $vendor['OrgID'];
                
                header('Location: ../../../website/vendor/html/vendorhome');
                exit;
            }

            // Check if the user is a customer
            $customerQuery = "SELECT CustomerID FROM CUSTOMER WHERE UserID = ?";
            $customerStmt = $conn->prepare($customerQuery);
            $customerStmt->bind_param("i", $userID);
            $customerStmt->execute();
            $customerResult = $customerStmt->get_result();
        
            if ($customerResult->num_rows > 0) {
                $customer = $customerResult->fetch_assoc();
                $_SESSION['user']['role'] = 'customer';
                $_SESSION['user']['CustomerID'] = $customer['CustomerID'];
                
                header('Location: ../../../website/client/html/clienthome');
                exit;
            }

            exit();
            
        } else {
            echo json_encode(["error" => "Incorrect email or password"]);
        }
    }
}
?>
