<?php
header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Methods: POST, OPTIONS");  
header("Access-Control-Allow-Headers: Content-Type, Authorization");  
header("Content-Type: application/json");  

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$response = ["success" => false, "message" => "Erreur inconnue"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if (!empty($data["email"]) && !empty($data["code"])) {
        $email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);
        $code = trim($data["code"]);

        // Vérifie le code
        if (file_exists("codes/$email.txt")) {
            $savedCode = trim(file_get_contents("codes/$email.txt"));
            if ($savedCode === $code) {
                $response = ["success" => true, "message" => "Vérification réussie"];
                unlink("codes/$email.txt"); // Supprime le fichier après vérification
            } else {
                $response = ["success" => false, "message" => "Code incorrect"];
            }
        } else {
            $response = ["success" => false, "message" => "Aucun code trouvé"];
        }
    } else {
        $response = ["success" => false, "message" => "Données invalides"];
    }
}

echo json_encode($response);
exit;
