package main.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.entity.Post;
import main.entity.User;
import main.service.LocalImageProvider;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Data
@NoArgsConstructor
public class PostDTO {
  private String type = "posts";
  private Long id;
  private PostAttributes attributes;
  private PostRelationships relationships;
  private PostLinks links;

  // INFO: If there are going to be more optional fields consider Builder pattern.
  public PostDTO(Post post, Boolean includeRelationships) {
    this.id = post.getId();

    // TODO: Add DI LocalImageProvider
    this.attributes =
        new PostAttributes(
            post.getTitle(),
            post.getText(),
            new LocalImageProvider().getUrl(post.getImagePath()),
            post.getCreatedAt(),
            post.getUpdatedAt()
        );
    this.relationships =
        includeRelationships
            ? new PostRelationships(post.getAuthor(), post.getParent(), post.getComments())
            : null;
    this.links = new PostLinks(this.id.toString());
  }

  public static PostDTO withRelationships(Post post) {
    return new PostDTO(post, true);
  }

  public static PostDTO withoutRelationships(Post post) {
    return new PostDTO(post, false);
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class PostAttributes {
    private String title;
    private String text;
    private String imagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
  }

  @Data
  @NoArgsConstructor
  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  public static class PostRelationships {
    private UserDTO author;
    private PostDTO post;
    private List<PostDTO> comments;

    public PostRelationships(User user, Post parent, List<Post> comments) {
      this.author = UserDTO.withoutRelationships(user);
      if (parent != null) {
        this.post = PostDTO.withoutRelationships(parent);
      }
      this.comments =
          comments.stream().map(PostDTO::withoutRelationships).collect(Collectors.toList());
    }
  }

  @Data
  @NoArgsConstructor
  public static class PostLinks {
    private String self;
    private String parent;

    public PostLinks(String key) {
      this.self =
          ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString()
              + "/api/posts/"
              + key;
      this.parent =
          ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString()
              + "/api/posts/";
    }
  }
}
