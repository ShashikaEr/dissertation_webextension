<?php
header('Access-Control-Allow-Origin: *');
include ('readURL.php');

$read = new ViewURL();
//$url = $read->readURL();

$url = $_GET['url'];
$decodedUrl = urldecode($url);
$mysqli = new mysqli("localhost", "root", "", "phishing_blacklist_database");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
$query = "SELECT COUNT(*) as count FROM urls WHERE url_link = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $decodedUrl);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();
$exists = $data['count'] > 0;
$stmt->close();
$mysqli->close();

header('Content-Type: application/json');
echo json_encode(['exists' => $exists]);

?>