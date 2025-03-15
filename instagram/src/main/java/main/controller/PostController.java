package main.controller;

import lombok.RequiredArgsConstructor;
import main.service.PostService;
import main.service.dto.PostDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDTO>> index() {
        return ResponseEntity.status(HttpStatus.OK.value()).body(postService.getAll());
    }

    @PostMapping
    public ResponseEntity<PostDTO> create(@RequestBody PostDTO request) {
        // TODO: Add authorization

        PostDTO createdComment = postService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> show(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(postService.get(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePostById(@PathVariable Long id, @RequestBody PostDTO postDTO) {
        // TODO: Add authorization

        try {
            return ResponseEntity.ok(postService.update(postDTO)); // Return updated post with 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Return 404 if post not found
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // TODO: Add authorization
        try {
            postService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
