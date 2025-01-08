package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.Service.NominatimService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class NominatimServiceImpl implements NominatimService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private static final int MAX_RETRIES = 3; // Retry limit
    private static final long RETRY_DELAY_MS = 1000; // Delay between retries in milliseconds

    @Override
    public Map<String, Object> geocode(String address) {
        RestTemplate restTemplate = new RestTemplate();
        String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);

        String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                .queryParam("q", encodedAddress)
                .queryParam("format", "json")
                .queryParam("addressdetails", 1)
                .toUriString();

        log.info("Calling Nominatim API with URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "VibeTribesApp/1.0 (your_email@example.com)");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        int attempts = 0;

        while (attempts < MAX_RETRIES) {
            try {
                ResponseEntity<List> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
                HttpStatus statusCode = (HttpStatus) responseEntity.getStatusCode();
                List<Map<String, Object>> response = responseEntity.getBody();

                log.info("Nominatim API Response: Status Code: {}, Response: {}", statusCode, response);

                if (response != null && !response.isEmpty()) {
                    return response.get(0); // Return the first result
                }

                // Log the headers for debugging
                log.info("Response Headers: {}", responseEntity.getHeaders());
            } catch (Exception e) {
                log.error("Error during Nominatim API call: {}", e.getMessage());
            }

            attempts++;
            log.warn("Retrying Nominatim API call. Attempt {}/{}", attempts, MAX_RETRIES);
            try {
                Thread.sleep(RETRY_DELAY_MS);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Retry interrupted", ie);
            }
        }

        throw new RuntimeException("Failed to geocode address after multiple attempts.");
    }
}
