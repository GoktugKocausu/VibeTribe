package com.example.vibetribesdemo.Service;



import java.util.Map;

public interface NominatimService {
    Map<String, Object> geocode(String address);
}
