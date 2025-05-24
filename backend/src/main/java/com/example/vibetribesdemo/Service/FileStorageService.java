package com.example.vibetribesdemo.Service;

public interface FileStorageService {
    String storeFile(byte[] fileData, String fileName);
    void deleteFile(String fileName);
    byte[] getFile(String fileName);
} 