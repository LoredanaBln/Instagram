package main.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import main.entity.User;
import main.repository.IUserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final IUserRepository userRepository;

    public User getAuthenticatedUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("Not authenticated");
        }
        return userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
} 