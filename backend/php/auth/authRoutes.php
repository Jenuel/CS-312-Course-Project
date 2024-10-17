<?php

require_once 'connectDb.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    
    //Sign-Up
    if ($action === 'signUp') {
    
        $firstName =$_POST['fName'];
        $lastName =$_POST['lName'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $password = md5($password);

        $checkEmail = "SELECT * FROM users where SchoolEmail='$email'";
        $result = $conn->query($checkEmail);

        if($result->num_rows>0){    
            echo "Email already in use";
        } else {
            $inserQuery = "INSERT INTO users (FirstName, LastName, SchoolEmail, Password) 
            VALUES ('$firstName', '$lastName', '$email', '$password')";

            if ($conn->query($inserQuery)== TRUE){
                header("location: index.php"); //should be home.html with token (session)

            } else {
                echo "Error: .$conn->error";
            }

        }
        //Login
    } elseif ($action === 'signIn') {

        $email = $_POST['email'];
        $password = $_POST['password'];
        $password = md5($password);

        $sql= "SELECT * FROM users WHERE email='$email' and password='$password'";
        $result=$conn->query($sql);

        if($result->num_row>0){
            session.start();
            $row = $result->fetch_assoc();
            $_SESSION['email']=$row['email'];
            header("Location: homepage.php"); //should be home.html
            exit();
            
        } else {
            echo "Incorrect email or password";
        }
    }

}
?>