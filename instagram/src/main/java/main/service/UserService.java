package main.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import main.entity.User;
import main.repository.IUserRepository;
import main.service.dto.UserDTO;
import main.service.dto.userRegistration.RegistrationRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {
  private final IUserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

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

  public UserDTO update(UserDTO request) {
    User user =
        userRepository
            .findById(request.getId())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getId()));

    if (request.getAttributes().getUsername() != null) {
      user.setUsername(request.getAttributes().getUsername());
    }

    if (request.getAttributes().getEmail() != null) {
      user.setEmail(request.getAttributes().getEmail());
    }

    if (request.getAttributes().getRole() != null) {
      user.setRole(request.getAttributes().getRole());
    }

    if (request.getAttributes().getScore() != null) {
      user.setScore(request.getAttributes().getScore());
    }

    if (request.getAttributes().getIsBanned() != null) {
      user.setBanned(request.getAttributes().getIsBanned());
    }

    return UserDTO.withRelationships(userRepository.save(user));
  }

  public void delete(Long id) {
    userRepository.deleteById(id);
  }
}
