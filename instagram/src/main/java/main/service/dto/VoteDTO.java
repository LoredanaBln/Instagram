package main.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import main.entity.VoteType;

@Data
@AllArgsConstructor
public class VoteDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private VoteType type;
} 