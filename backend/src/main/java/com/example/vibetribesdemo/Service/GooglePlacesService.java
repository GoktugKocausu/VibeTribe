package com.example.vibetribesdemo.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class GooglePlacesService {
    
    @Value("${google.places.api.key}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    
    public GooglePlacesService() {
        this.restTemplate = new RestTemplate();
    }
    
    public List<Map<String, String>> searchAddress(String query) {
        String url = UriComponentsBuilder
            .fromHttpUrl("https://maps.googleapis.com/maps/api/place/autocomplete/json")
            .queryParam("input", query)
            .queryParam("key", apiKey)
            .queryParam("language", "tr")
            .queryParam("components", "country:tr")
            .build()
            .toUriString();
            
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        List<Map<String, String>> results = new ArrayList<>();
        
        if (response.getBody() != null && response.getBody().has("predictions")) {
            response.getBody().get("predictions").forEach(prediction -> {
                Map<String, String> result = new HashMap<>();
                result.put("label", prediction.get("description").asText());
                result.put("value", prediction.get("description").asText());
                result.put("placeId", prediction.get("place_id").asText());
                results.add(result);
            });
        }
        
        return results;
    }
    
    public Map<String, Double> getPlaceDetails(String placeId) {
        String url = UriComponentsBuilder
            .fromHttpUrl("https://maps.googleapis.com/maps/api/place/details/json")
            .queryParam("place_id", placeId)
            .queryParam("key", apiKey)
            .queryParam("fields", "geometry")
            .build()
            .toUriString();
            
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
        Map<String, Double> coordinates = new HashMap<>();
        
        if (response.getBody() != null && 
            response.getBody().has("result") && 
            response.getBody().get("result").has("geometry") &&
            response.getBody().get("result").get("geometry").has("location")) {
                
            JsonNode location = response.getBody().get("result").get("geometry").get("location");
            coordinates.put("latitude", location.get("lat").asDouble());
            coordinates.put("longitude", location.get("lng").asDouble());
        }
        
        return coordinates;
    }
} 