package main.service;

import main.entity.Comment;
import main.entity.Post;
import main.entity.User;
import main.repository.ICommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommentService {
    private final ICommentRepository commentRepository;

    public CommentService(ICommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createComment(String text, String imageUrl, User author, Post post) {
        Comment comment = new Comment();
        comment.setText(text);
        comment.setImageUrl(imageUrl);
        comment.setAuthor(author);
        comment.setPost(post);
        comment.setCreationTime(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, String newText) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setText(newText);
        return commentRepository.save(comment);
    }
}
