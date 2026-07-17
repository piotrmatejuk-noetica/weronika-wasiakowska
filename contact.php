<?php
header('Content-Type: application/json; charset=utf-8');

function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('method_not_allowed', 405);
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? 'Wiadomość ze strony'));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $message === '') {
    fail('missing_fields');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('invalid_email');
}

// Strip anything that could be used for header injection.
$clean = function ($v) {
    return preg_replace('/[\r\n]+/', ' ', $v);
};
$name = $clean($name);
$email = $clean($email);
$subject = $clean($subject);

$to = 'hello@weronikawasiakowska.com';
$mailSubject = '[Strona] ' . $subject . ' — ' . $name;

$body = "Nowa wiadomość z formularza kontaktowego weronikawasiakowska.com\n\n"
    . "Imię: {$name}\n"
    . "E-mail: {$email}\n"
    . "Temat: {$subject}\n\n"
    . "Wiadomość:\n{$message}\n";

$fromAddress = 'no-reply@weronikawasiakowska.com';
$headers = "From: Formularz weronikawasiakowska.com <{$fromAddress}>\r\n"
    . "Reply-To: {$name} <{$email}>\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $mailSubject, $body, $headers);

if (!$sent) {
    fail('send_failed', 500);
}

echo json_encode(['ok' => true]);
