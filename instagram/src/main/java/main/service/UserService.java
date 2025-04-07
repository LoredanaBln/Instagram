package main.service;

import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import main.entity.User;
import main.entity.UserType;
import main.repository.IUserRepository;
import main.service.dto.UserDTO;
import main.service.dto.userAuthentication.AuthenticationResponse;
import main.service.dto.userAuthentication.LoginRequest;
import main.service.dto.userAuthentication.RegistrationRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {
  private final IUserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationService authenticationService;

  public List<UserDTO> getAll() {
    return userRepository.findAll().stream()
        .map(UserDTO::withRelationships)
        .collect(Collectors.toList());
  }

  public UserDTO create(RegistrationRequest request, MultipartFile image) throws IOException {
    if (request.getUsername() == null) {
      throw new RuntimeException("Username is required");
    }

    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
      throw new RuntimeException("Username already exists");
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setEmail(request.getEmail());
    user.setImagePath(new LocalImageProvider().saveImage(image));

    User savedUser = userRepository.save(user);
    return UserDTO.withRelationships(savedUser);
  }

  public UserDTO get(Long id) {
    return userRepository
        .findById(id)
        .map(UserDTO::withRelationships)
        .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
  }

  public UserDTO update(Long id, UserDTO request, HttpSession session) {
    User authenticatedUser = authenticationService.getAuthenticatedUser(session);
    User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getId()));

    if (!authenticatedUser.getId().equals(user.getId())
        && !authenticatedUser.getRole().equals(UserType.MODERATOR)) {
      throw new RuntimeException("Not authorized to update this user");
    }

    if (request.getAttributes().getUsername() != null) {
      user.setUsername(request.getAttributes().getUsername());
    }

    return UserDTO.withRelationships(userRepository.save(user));
  }

  public void delete(Long id, HttpSession session) {
    User authenticatedUser = authenticationService.getAuthenticatedUser(session);

    if (!authenticatedUser.getId().equals(id)
        && !authenticatedUser.getRole().equals(UserType.MODERATOR)) {
      throw new RuntimeException("Not authorized to delete this user");
    }
    userRepository.deleteById(id);

    // invalidate session if user deletes its account
    if (authenticatedUser.getId().equals(id)) {
      session.invalidate();
    }
  }

  public AuthenticationResponse login(LoginRequest loginRequest, HttpSession session) {
    User user =
        userRepository
            .findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Invalid username"));

    if (user.isBanned()) {
      throw new RuntimeException("User banned");
    }

    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
      throw new BadCredentialsException("Invalid password");
    }

    session.setAttribute("userId", user.getId());

    return new AuthenticationResponse(user.getUsername(), user.getRole(), true);
  }
}
