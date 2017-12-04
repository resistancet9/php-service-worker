<?php 
header("Content-Type: application/json");
$raw_post = json_decode(file_get_contents('php://input'), true);

$con = mysqli_connect("localhost","root","9122","notification");


if (mysqli_connect_errno())
  {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  } else {
    echo "Success";
  }

$endpoint = $raw_post['endpoint'];
$token = $raw_post['token'];
$key = $raw_post['key'];

$strSQL = "insert into notification_data values(null,  '$endpoint', '$token', '$key' )";
mysqli_query($con, $strSQL);
mysqli_close($con);
?>