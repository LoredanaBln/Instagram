package main.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import main.entity.Comment;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class CommentDTO {
    private String type = "comments";
    private Long id;
    private CommentAttributes attributes;
    private CommentRelationships relationships;
    private CommentLinks links;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.attributes = new CommentAttributes(comment.getText(), comment.getImagePath(), comment.getCreationTime());
        this.relationships = new CommentRelationships();
        this.links = new CommentLinks(this.id.toString());
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
        // TODO: include comment relationship
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
