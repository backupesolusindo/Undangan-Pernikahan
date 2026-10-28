<?php
require 'db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $pdo->prepare("DELETE FROM guests WHERE id = ?");
    $stmt->execute([$id]);
}

header("Location: admin.php");
exit();
?>
