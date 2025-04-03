<?php

$url = "https://www.99acres.com/99api/v1/getmy99Response/OeAuXClO43hwseaXEQ/uid/";

// Use double quotes for XML to allow variable substitution if needed
$request = "<?xml version='1.0' encoding='UTF-8'?><query><user_name>99acres</user_name><pswd>jfhfj</pswd><start_date>2024-09-30 00:00:00</start_date><end_date>2024-10-01 23:59:59</end_date></query>";

$allParams = array('xml' => $request);
$leads = get99AcresLeads($allParams, $url);
print_r($leads);

function get99AcresLeads($allParams, $url) {
    $crl = curl_init($url);
    
    curl_setopt($crl, CURLOPT_POST, 1);
    curl_setopt($crl, CURLOPT_POSTFIELDS, http_build_query($allParams)); // Use http_build_query for proper URL encoding
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, 1);
    
    // Optional: Set headers if required by the API
    curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // Execute the cURL request
    $response = curl_exec($crl);

    // Check for cURL errors
    if (curl_errno($crl)) {
        echo 'Curl error: ' . curl_error($crl);
    }

    curl_close($crl); // Always close the cURL session
    return $response;
}
