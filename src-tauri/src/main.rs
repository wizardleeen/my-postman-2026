// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
struct HttpResponse {
    status: u16,
    status_text: String,
    headers: HashMap<String, String>,
    body: String,
    response_time: u64,
}

#[tauri::command]
async fn make_http_request(
    method: String,
    url: String,
    headers: HashMap<String, String>,
    body: Option<String>,
) -> Result<HttpResponse, String> {
    let start_time = Instant::now();
    
    // Create reqwest client
    let client = reqwest::Client::new();
    
    // Build the request
    let mut request_builder = match method.to_uppercase().as_str() {
        "GET" => client.get(&url),
        "POST" => client.post(&url),
        "PUT" => client.put(&url),
        "DELETE" => client.delete(&url),
        "PATCH" => client.patch(&url),
        "HEAD" => client.head(&url),
        _ => return Err(format!("Unsupported HTTP method: {}", method)),
    };
    
    // Add headers
    for (key, value) in headers {
        request_builder = request_builder.header(&key, &value);
    }
    
    // Add body if present
    if let Some(body_content) = body {
        if !body_content.trim().is_empty() {
            request_builder = request_builder.body(body_content);
        }
    }
    
    // Send the request
    match request_builder.send().await {
        Ok(response) => {
            let status = response.status().as_u16();
            let status_text = response.status().canonical_reason().unwrap_or("Unknown").to_string();
            
            // Extract headers
            let mut response_headers = HashMap::new();
            for (key, value) in response.headers() {
                response_headers.insert(
                    key.to_string(),
                    value.to_str().unwrap_or("<invalid>").to_string(),
                );
            }
            
            // Get response body
            let body_text = match response.text().await {
                Ok(text) => text,
                Err(e) => format!("Failed to read response body: {}", e),
            };
            
            let response_time = start_time.elapsed().as_millis() as u64;
            
            Ok(HttpResponse {
                status,
                status_text,
                headers: response_headers,
                body: body_text,
                response_time,
            })
        }
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![make_http_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}