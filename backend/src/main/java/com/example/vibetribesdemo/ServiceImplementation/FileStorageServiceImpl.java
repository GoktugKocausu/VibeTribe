package com.example.vibetribesdemo.ServiceImplementation;

import com.example.vibetribesdemo.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/bmp"
    ));

    public FileStorageServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(byte[] fileData, String originalFileName) {
        try {
            // Validate image format
            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(fileData));
            if (bufferedImage == null) {
                throw new RuntimeException("Invalid image format or corrupted file");
            }

            // Get file extension from original file name
            String fileExtension = StringUtils.getFilenameExtension(originalFileName);
            if (fileExtension == null) {
                throw new RuntimeException("Invalid file format");
            }

            // Generate new file name
            String fileName = UUID.randomUUID().toString() + "." + fileExtension.toLowerCase();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);

            // Write file
            Files.write(targetLocation, fileData);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file. Please try again!", ex);
        }
    }

    @Override
    public byte[] getFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            if (!filePath.toFile().exists()) {
                throw new RuntimeException("File not found");
            }
            return Files.readAllBytes(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not read file. Please try again!", ex);
        }
    }

    public boolean isValidImageContentType(String contentType) {
        return ALLOWED_CONTENT_TYPES.contains(contentType);
    }
} 