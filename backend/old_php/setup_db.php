<?php
$host = 'localhost';
$username = 'root'; // Default username Laragon/XAMPP
$password = '';     // Default password Laragon/XAMPP

try {
    // 1. Connect ke MySQL server
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Buat database jika belum ada
    $pdo->exec("CREATE DATABASE IF NOT EXISTS undangan_db");
    
    // 3. Gunakan database tersebut
    $pdo->exec("USE undangan_db");

    // 4. Buat tabel guests
    $sqlTable = "CREATE TABLE IF NOT EXISTS guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        guest_count INT NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlTable);
    echo "Tabel 'guests' berhasil dicek/dibuat.\n";

    // 5. Cek apakah data sudah ada, jika kosong masukkan data dummy
    $stmt = $pdo->query("SELECT COUNT(*) FROM guests");
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        $sqlInsert = "INSERT INTO guests (name, phone, status, guest_count, message, created_at) VALUES 
            ('Bambang & Keluarga', '081234567890', 'Hadir', 4, 'Sugeng ngambali warsa palakrama kagem Juwita & Seno. Mugi-mugi dados keluarga ingkang sakinah, mawaddah, warahmah.', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
            ('Siti Rahmawati', '085712345678', 'Hadir', 1, 'Selamat atas pernikahannya Juwita & Seno! Cantik dan gagah sekali dalam balutan adat Jawa.', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
            ('Aryo Prasetyo', '081987654321', 'Tidak Hadir', 0, 'Barakallah Juwita & Seno! Mohon maaf belum bisa hadir secara langsung. Doa terbaik dan keberkahan selalu untuk kalian.', DATE_SUB(NOW(), INTERVAL 15 MINUTE))";
        
        $pdo->exec($sqlInsert);
        echo "Berhasil mengisi data awal (dummy data) ke dalam database!\n";
    } else {
        echo "Data pengunjung sudah tersedia di database.\n";
    }

} catch(PDOException $e) {
    die("Error Database Setup: " . $e->getMessage() . "\n");
}
?>
