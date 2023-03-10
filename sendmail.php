<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

//От кого письмо
$mail->setFrom('marychev228@gmail.com');
//Komy otpravit'
$mail->addAddress('marycheff17@gmail.com');
//Tema pis'ma
$mail->Subject = 'Privet!!! Eto testovoye soobsheniye';

//PyKA
$hand = "Правая";
if ($_POST['hand'] == "left") {
    $hand = "Левая";
}


//Telo pis'ma
$body = '<h1>Eto to samoe pismo</h1>';

if (trim(!empty($_POST['name']))) {
    $body .= '<p><strong>Name:</strong>' . $_POST['name'] . '</p>';
}
if (trim(!empty($_POST['email']))) {
    $body .= '<p><strong>E-mail:</strong>' . $_POST['email'] . '</p>';
}
if (trim(!empty($_POST['hand']))) {
    $body .= '<p><strong>Hand:</strong>' . $hand . '</p>';
}
if (trim(!empty($_POST['age']))) {
    $body .= '<p><strong>Age:</strong>' . $_POST['age'] . '</p>';
}
if (trim(!empty($_POST['message']))) {
    $body .= '<p><strong>Message:</strong>' . $_POST['message'] . '</p>';
}

//Dobavlenie faila
if (!empty($_FILES['image']['tmp_name'])) {
    //путь загрузки файла
    $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
    //грузим файл
    if (copy($_FILES['image']['tmp_name'], $filePath)) {
        $fileAttach = $filePath;
        $body .= '<p><strong>Фото в приложении</strong>';
        $mail->addAttachment($fileAttach);
    }
}

$mail->Body = $body;

//Отправляем
if (!$mail->send()) {
    $message = 'Ошибка';
} else {
    $message = 'Данные отправлены';
}
$response = ['mesage' => $message];

header('Content-type: application/json');
echo json_encode($response);
