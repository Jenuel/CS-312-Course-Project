<?php
session_start();
include("connect.php");

?>


<!DOCTYPE html>
<html lang="en">

<head>

<title>Gomepage</title>
</head>
<body>


</body>
<div style="text-align:center; padding:15%">
<p style="font-size:50px; font-weight:bold">
    Hello

    <?php

    if(isset($_SESSION['email'])){
        $email=$_SESSION['email'];
        $query=mysqli_query($conn, "SELECT users.* FROM 'users' WHERE users.email='$emai'");

        while($row=mysqli_fetch_array($query)){
            echo "$row['FirstName']. ' '$row['LastName']";
        }
    }
    ?>

</p>


</div>


</html>
