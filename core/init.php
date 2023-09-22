<?php
header('Access-Control-Allow-Origin: *'); //allow cross origin requests from any domain

$url = $_GET['url']; //retrieve the value from HTTP request
$decodedUrl = urldecode($url); //decode the URL
$mysqli = new mysqli("localhost", "root", "", "phishing_blacklist_database"); //establish the DB connection
if ($mysqli->connect_error) { //handle if any error
    die("Connection failed: " . $mysqli->connect_error); //terminate 
}
$query = "SELECT COUNT(*) as count FROM urls WHERE url_link = ?"; //pass the parameter and fetch 
$stmt = $mysqli->prepare($query); //prepare the SQL query
$stmt->bind_param("s", $decodedUrl); //bind parameter
$stmt->execute(); //execute
$result = $stmt->get_result(); //fetch results 
$data = $result->fetch_assoc(); //fetch the first row of the result
$exists = $data['count'] > 0; //if matching urls are exist
$stmt->close(); //close the prepared statement
$mysqli->close(); //close the DB connection

header('Content-Type: application/json'); //set the HTTP response
echo json_encode(['exists' => $exists]); //JSON response with key and a boolean value

?>