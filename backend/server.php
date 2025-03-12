<?php
require 'vendor/autoload.php'; // Load Composer autoloader

// Allow CORS for specific domains
$allowedOrigins = ['http://localhost:5173', 'https://pidginpal.vercel.app'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

use Dotenv\Dotenv;

// Load the .env file
$dotenv = Dotenv::createImmutable('/var/www/html/backend/');
$dotenv->load();

// Access environment variables securely
$apiKey = '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';
$model ='gpt-4o-mini';

// Validate API key
if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error", "details" => "API key is missing or invalid."]);
    exit();
}

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Validate request payload
if (empty($data) || !isset($data['messages'][0]['content'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request payload"]);
    exit();
}

$payload = [
    "model" => $model,
    "messages" => [
        [
            "role" => "system",
            "content" => "You are a rude Nigerian Pidgin chatbot. Respond to users in Nigerian Pidgin English with a sassy and rude tone. Use Nigerian slang and phrases. Be funny but disrespectful.",
        ],
        [
            "role" => "user",
            "content" => $data['messages'][0]['content'],
        ],
    ],
    "max_tokens" => 100, // Limit response to 100 tokens
    "stream" => false,
    "temperature" => 0.7, // Controls randomness
    "top_p" => 0.9, // Controls diversity
];

// Log the request payload for debugging
error_log("Request Payload: " . json_encode($payload));

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json",
]);

$response = curl_exec($ch);

// Handle cURL errors
if (curl_errno($ch)) {
    $errorMsg = curl_error($ch);
    error_log("cURL Error: " . $errorMsg);
    http_response_code(500);
    echo json_encode(["error" => "Internal Server Error", "details" => $errorMsg]);
    curl_close($ch);
    exit();
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Log the API response for debugging
error_log("API Response: " . $response);

// Improved error handling
header("Content-Type: application/json");

if ($httpCode === 402 || $httpCode === 429) {
    // Fallback response if quota is exceeded
    $fallbackResponse = [
        "choices" => [
            [
                "message" => [
                    "role" => "assistant",
                    "content" => "Abeg, no vex. My brain don tire. Try again later.",
                ],
            ],
        ],
    ];
    echo json_encode($fallbackResponse);
} else {
    http_response_code($httpCode);
    echo $response;
}
?>