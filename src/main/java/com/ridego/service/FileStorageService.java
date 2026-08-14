package com.ridego.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String storeFile(MultipartFile file, String subDirectory);

    void deleteFile(String fileUrl);

    void validateFile(MultipartFile file);
}
