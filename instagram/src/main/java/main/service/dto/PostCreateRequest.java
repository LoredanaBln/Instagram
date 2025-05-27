package main.service.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateRequest {
  private String title;
  private String text;
  private MultipartFile image;
  private Long parentId;
  private List<String> tags;
}
