package main.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.entity.Post;
import main.entity.User;
import main.entity.UserType;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Data
@NoArgsConstructor
public class UserDTO {
  private String type = "users";
  private Long id;
  private UserAttributes attributes;
  private UserRelationships relationships;
  private UserLinks links;

  public UserDTO(User user, Boolean includeRelationships) {
    this.id = user.getId();
    this.attributes =
        new UserAttributes(
            user.getUsername(), user.getEmail(), user.getRole(), user.getScore(), user.isBanned());
    this.relationships = includeRelationships ? new UserRelationships(user.getPosts()) : null;
    this.links = new UserLinks(this.id.toString());
  }

  public static UserDTO withRelationships(User user) {
    return new UserDTO(user, true);
  }

  public static UserDTO withoutRelationships(User user) {
    return new UserDTO(user, false);
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserAttributes {
    private String username;
    private String email;
    private UserType role;
    private Double score;
    private Boolean isBanned;
  }

  @Data
  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  public static class UserRelationships {
    private List<PostDTO> comments;

    public UserRelationships(List<Post> posts) {
      this.comments =
          posts.stream().map(PostDTO::withoutRelationships).collect(Collectors.toList());
    }
  }

  @Data
  public static class UserLinks {
    private String self;
    private String parent;

    public UserLinks(String key) {
      this.self =
          ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString()
              + "/api/users/"
              + key;
      this.parent =
          ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString()
              + "/api/users/";
    }
  }
}
