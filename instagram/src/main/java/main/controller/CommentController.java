package main.controller;

import lombok.RequiredArgsConstructor;
import main.service.CommentService;
import main.service.dto.CommentDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDTO>> index() {
        return ResponseEntity.status(HttpStatus.OK.value()).body(commentService.getAll());
    }

    @PostMapping
    public ResponseEntity<CommentDTO> create(@RequestBody CommentDTO request) {
        // TODO: Add authorization

        CommentDTO createdComment = commentService.createComment(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }
}
