<?php
$raw_post = json_decode(file_get_contents('php://input'), true);
require __DIR__ . '/vendor/autoload.php';
use Minishlink\WebPush\WebPush;

$con = mysqli_connect("localhost", "root", "9122", "notification");

if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
} else {
	echo "Success";
}

$auth = array(
	'VAPID' => array(
		'subject' => 'https://test.com/',
		'publicKey' => 'BCmti7ScwxxVAlB7WAyxoOXtV7J8vVCXwEDIFXjKvD-ma-yJx_eHJLdADyyzzTKRGb395bSAtxlh4wuDycO3Ih4',
		'privateKey' => 'HJweeF64L35gw5YLECa-K7hwp3LLfcKtpdRNK8C_fPQ',
	),
);

$token = $raw_post['token'];

// $strSQL = "select * from notification_data where token = '$token';";
$strSQL = "select * from notification_data where token = 'HcyB+sJoGin+Rqu+rZlqlw==';";
$result = mysqli_query($con, $strSQL);
$s = mysqli_fetch_assoc($result);
echo count($result);
if (count($result) === 1) {
	$endpoint = $s['endpoint'];
	$key = $s['key'];
	$token = $s['token'];
	$push_data = ["title" => "Which Friend Loves You With All Their Heart?", "options" => ["body" => "Which Friend Loves You With All Their Heart?", "icon" => "https://lh3.googleusercontent.com/3K_Xj5qSmCeRLZEG7x7nQSU4qYbU82hx1kj01zDIrFzQaLlkFF2cznu1eEVYPhKh_u4=w300", "data" => ["url" => "http://dev.meaww.com/activities/recommend/love_ya_sj_p/11237?utm_source=direct&utm_medium=recommend&utm_campaign=11237"]]];

	$webPush = new WebPush($auth);
	$res = $webPush->sendNotification(
		"$endpoint",
		json_encode($push_data),
		"$key",
		"$token",
		true
	);
}

mysqli_close($con);
?>