package main.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import main.entity.Vote;
import main.entity.VoteType;
import main.service.VoteService;
import main.service.dto.VoteDTO;
import main.service.dto.VoteCountDTO;
import main.security.RequireAuthentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VoteController {
    private final VoteService voteService;

    @PostMapping("/{postId}")
    @RequireAuthentication
    public ResponseEntity<?> vote(
            @PathVariable Long postId,
            @RequestParam VoteType type,
            HttpSession session) {
        try {
            Vote vote = voteService.vote(postId, type, session);
            
            if (vote == null) {
                return ResponseEntity.ok().build();
            }
            
            VoteDTO voteDTO = new VoteDTO(
                vote.getId(),
                vote.getPost().getId(),
                vote.getUser().getId(),
                vote.getType()
            );
            
            return ResponseEntity.ok(voteDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{postId}/count")
    public ResponseEntity<VoteCountDTO> getVoteCount(@PathVariable Long postId) {
        return ResponseEntity.ok(voteService.getVoteCount(postId));
    }
} 