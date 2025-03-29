package main.controller;

import java.util.List;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import main.security.RequireAuthentication;
import main.service.PostService;
import main.service.dto.PostCreateRequest;
import main.service.dto.PostDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
  private final PostService postService;

  @GetMapping
  @RequireAuthentication
  public ResponseEntity<List<PostDTO>> index(HttpSession session) {
    try {
      return ResponseEntity.status(HttpStatus.OK.value()).body(postService.getAll(session));
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Not authenticated")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping
  @RequireAuthentication
  public ResponseEntity<PostDTO> create(
          @ModelAttribute PostCreateRequest request,
          @RequestParam(value = "image", required = false) MultipartFile image,
          HttpSession session) {
    try {
      PostDTO createdComment = postService.create(request, image, session);

      return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    } catch (java.io.IOException exception) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/{id}")
  @RequireAuthentication
  public ResponseEntity<PostDTO> show(@PathVariable Long id, HttpSession session) {
    try {
      return ResponseEntity.ok(postService.get(id, session));
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Not authenticated")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}")
  @RequireAuthentication
  public ResponseEntity<PostDTO> updatePostById(
          @PathVariable Long id,
          @RequestBody PostDTO postDTO,
          HttpSession session) {
    try {
      return ResponseEntity.ok(postService.update(id, postDTO, session));
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Not authenticated")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      if (e.getMessage().contains("Not authorized")) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  @RequireAuthentication
  public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session) {
    try {
      postService.delete(id, session);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Not authenticated")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      if (e.getMessage().contains("Not authorized")) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }
      return ResponseEntity.notFound().build();
    }
  }
}
