package main.interfaces;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface IImageProvider {
    String saveImage(MultipartFile image) throws IOException;
    String getUrl(String filename);
    Resource getImage(String filename) throws IOException;
}
