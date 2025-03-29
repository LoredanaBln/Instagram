package main.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import main.config.Constants;
import main.interfaces.IImageProvider;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalImageProvider implements IImageProvider {
  private static final String UPLOAD_DIR = "uploads//";

  @Override
  public String saveImage(MultipartFile image) throws IOException {
    Files.createDirectories(Paths.get(UPLOAD_DIR));

    String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
    Path filePath = Paths.get(UPLOAD_DIR, filename);

    Files.write(filePath, image.getBytes());

    return filePath.toString();
  }

  @Override
  public String getUrl(String filename) {
    return Constants.LOCAL_BASE_URL + filename.replace("\\", "/");
  }

  @Override
  public Resource getImage(String filename) throws IOException {
    Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
    Resource resource = new UrlResource(filePath.toUri());

    if (!resource.exists() || !resource.isReadable()) {
      throw new IOException("File not found: " + filename);
    }

    return resource;
  }
}
