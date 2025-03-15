package main.service;

import lombok.RequiredArgsConstructor;
import main.entity.Comment;
import main.repository.ICommentRepository;
import main.service.dto.CommentDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final ICommentRepository commentRepository;

    public List<CommentDTO> getAll() {
        return commentRepository.findAll()
            .stream()
            .map(CommentDTO::withRelationships)
            .collect(Collectors.toList());
    }

    public Comment createComment(String text, String imageUrl, User author, Post post) {
        Comment comment = new Comment();
        comment.setText(text);
//        comment.setImageUrl(imageUrl);
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
