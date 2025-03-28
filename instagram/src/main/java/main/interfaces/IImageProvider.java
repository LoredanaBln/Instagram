package main.interfaces;

import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface IImageProvider {
  String saveImage(MultipartFile image) throws IOException;

  String getUrl(String filename);

  Resource getImage(String filename) throws IOException;
}
