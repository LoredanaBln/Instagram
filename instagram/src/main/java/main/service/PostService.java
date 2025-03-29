package main.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import main.entity.Post;
import main.entity.User;
import main.entity.UserType;
import main.repository.IPostRepository;
import main.repository.IUserRepository;
import main.service.dto.PostCreateRequest;
import main.service.dto.PostDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PostService {
  private final IPostRepository postRepository;
  private final AuthenticationService authenticationService;

  public List<PostDTO> getAll(HttpSession session) {
    authenticationService.getAuthenticatedUser(session);
    
    return postRepository.findAll().stream()
        .map(PostDTO::withRelationships)
        .collect(Collectors.toList());
  }

  public PostDTO create(PostCreateRequest request, MultipartFile image, HttpSession session) throws IOException {
    User authenticatedUser = authenticationService.getAuthenticatedUser(session);

    Post post = new Post();
    post.setTitle(request.getTitle());
    post.setText(request.getText());
    post.setImagePath(new LocalImageProvider().saveImage(image));
    post.setAuthor(authenticatedUser);
    if (image != null && !image.isEmpty()) {
      post.setImagePath(new LocalImageProvider().saveImage(image));
    }
    post.setAuthor(authenticatedUser);

    // Set parent post if this is a comment
    if (request.getParentId() != null) {
      Post parent = postRepository
                .findById(request.getParentId())
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + request.getParentId()));
      post.setParent(parent);
    }

    return PostDTO.withRelationships(postRepository.save(post));
  }

  public PostDTO get(Long id, HttpSession session) {
    authenticationService.getAuthenticatedUser(session);
    
    return postRepository
        .findById(id)
        .map(PostDTO::withRelationships)
        .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));
  }

  public PostDTO update(Long id, PostDTO request, HttpSession session) {
    User authenticatedUser = authenticationService.getAuthenticatedUser(session);
    Post post = postRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));

    // Check if user is author or moderator
    if (!post.getAuthor().getId().equals(authenticatedUser.getId()) 
        && !authenticatedUser.getRole().equals(UserType.MODERATOR)) {
      throw new RuntimeException("Not authorized to update this post");
    }

    if (request.getAttributes().getTitle() != null) {
      post.setTitle(request.getAttributes().getTitle());
    }

    if (request.getAttributes().getText() != null) {
      post.setText(request.getAttributes().getText());
    }

    if (request.getAttributes().getImagePath() != null) {
      post.setImagePath(request.getAttributes().getImagePath());
    }

    return PostDTO.withRelationships(postRepository.save(post));
  }

  public void delete(Long id, HttpSession session) {
    User authenticatedUser = authenticationService.getAuthenticatedUser(session);
    Post post = postRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));

    // Check if user is author or moderator
    if (!post.getAuthor().getId().equals(authenticatedUser.getId()) 
        && !authenticatedUser.getRole().equals(UserType.MODERATOR)) {
      throw new RuntimeException("Not authorized to delete this post");
    }

    postRepository.deleteById(id);
  }
}
