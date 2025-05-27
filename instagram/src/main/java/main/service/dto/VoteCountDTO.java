package main.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteCountDTO {
    private long postId;
    private long count;
    private long upvotes;
    private long downvotes;
} 