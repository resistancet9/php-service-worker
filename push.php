<?php 
header("Content-Type: application/json");
$raw_post = file_get_contents('php://input');
echo $raw_post;
?>