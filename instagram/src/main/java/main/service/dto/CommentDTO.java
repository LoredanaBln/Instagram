package main.service.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entity.Comment;
import main.entity.User;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CommentDTO {
    private String type = "comments";
    private Long id;
    private CommentAttributes attributes;
    private CommentRelationships relationships;
    private CommentLinks links;

    // INFO: If there are going to be more optional fields consider Builder pattern.
    public CommentDTO(Comment comment, Boolean includeRelationships) {
        this.id = comment.getId();
        this.attributes = new CommentAttributes(comment.getText(), comment.getImagePath(), comment.getCreationTime());
        this.relationships = includeRelationships ? new CommentRelationships(comment.getAuthor()) : null;
        this.links = new CommentLinks(this.id.toString());
    }

    public static CommentDTO withRelationships(Comment comment) {
        return new CommentDTO(comment, true);
    }

    public static CommentDTO withoutRelationships(Comment comment) {
        return new CommentDTO(comment, false);
    }

    @Data
    public static class CommentAttributes {
        private String text;
        private String imagePath;
        private LocalDateTime creationTime;

        public CommentAttributes(String text, String imagePath, LocalDateTime creationTime) {
            this.text = text;
            this.imagePath = imagePath;
            this.creationTime = creationTime;
        }
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public static class CommentRelationships {
        private UserDTO author;

        public CommentRelationships(User user) {
            this.author = UserDTO.withoutRelationships(user);
        }
    }

    @Data
    public static class CommentLinks {
        private String self;
        private String parent;

        public CommentLinks(String key) {
            this.self = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/api/comments/" + key;
            this.parent = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() + "/api/comments/";
        }
    }
}
