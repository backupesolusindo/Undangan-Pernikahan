<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->name) && isset($data->phone) && isset($data->status) && isset($data->guest_count)) {
        $stmt = $pdo->prepare("INSERT INTO guests (name, phone, status, guest_count, message) VALUES (?, ?, ?, ?, ?)");
        try {
            $stmt->execute([$data->name, $data->phone, $data->status, $data->guest_count, $data->message ?? '']);
            echo json_encode(["status" => "success", "message" => "Data berhasil disimpan"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // API endpoint for fetching existing wishes if needed
    try {
        $stmt = $pdo->query("SELECT name, status, message, created_at as time FROM guests ORDER BY created_at DESC");
        $guests = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($guests);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
}
?>
