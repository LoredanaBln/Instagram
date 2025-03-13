package main.service;

import main.dto.LoginRequest;
import main.dto.PasswordChangeRequest;
import main.dto.UserDTO;
import main.entity.User;
import main.exception.BannedUserException;
import main.exception.UnknownUser;
import main.repository.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.List;

@Service
public class UserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(IUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (user == null || user.getUsername() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("User details cannot be null");
        }

        userRepository.findByUsername(user.getUsername())
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Username already exists");
                });

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public UserDTO loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (user.isBanned()) {
            throw new BannedUserException("This account has been banned");
        }

        if (!matchPassword(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return this.convertToDTO(user);
    }

    public UserDTO updateUser(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getId()).orElseThrow(() -> new UnknownUser("The user is unknown"));
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        userRepository.save(user);
        return convertToDTO(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UnknownUser("The user is unknown"));
        userRepository.delete(user);
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UnknownUser("The user is unknown"));
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UnknownUser("The user is unknown"));
    }

    public boolean matchPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isBanned()
        );
    }

    public User toggleUserBan(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UnknownUser("The user is unknown"));
        user.setBanned(!user.isBanned());
        return userRepository.save(user);
    }

    public User changePassword(PasswordChangeRequest passwordChangeRequest) {
        User user = userRepository.findByUsername(passwordChangeRequest.getUsername()).orElseThrow(() -> new UnknownUser("The user is unknown"));
        if (!matchPassword(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        return userRepository.save(user);
    }
}
