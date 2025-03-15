package main.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.entity.Post;
import main.entity.User;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;

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
        this.attributes = new PostAttributes(
                post.getTitle(),
                post.getText(),
                post.getImagePath(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
        this.relationships = includeRelationships ? new PostRelationships(post.getAuthor()) : null;
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

        public PostRelationships(User user) {
            this.author = UserDTO.withoutRelationships(user);
        }
    }

    @Data
    @NoArgsConstructor
    public static class PostLinks {
        private String self;
        private String parent;

        public PostLinks(String key) {
            this.self = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/api/posts/" + key;
            this.parent = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/api/posts/";
        }
    }
}
