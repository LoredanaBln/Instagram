package main.service.dto;

import lombok.Data;
import main.entity.Comment;

import java.time.LocalDateTime;


public class CommentDTO {
    private String type = "comments";
    private Long id;
    private CommentAttributes attributes;
    private CommentRelationships relationships;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.attributes = new CommentAttributes(comment.getText(), comment.getImagePath(), comment.getCreationTime());
        this.relationships = new CommentRelationships();
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
    public static class CommentRelationships {
        // TODO: include comment relationship
    }
}
