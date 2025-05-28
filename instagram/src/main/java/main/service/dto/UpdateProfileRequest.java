package main.service.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileRequest {
    private String username;
    private String phoneNumber;
    private MultipartFile image;
} 