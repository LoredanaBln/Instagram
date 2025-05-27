package main.service.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostUpdateRequest {
  private String title;
  private String text;
  private MultipartFile imagePath;
  private List<String> tags;
}
