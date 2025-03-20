package main.service;

import main.entity.User;
import main.repository.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final IUserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(IUserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User registerUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  public User findUserById(Long id) {
    return userRepository.findById(id).orElseThrow();
  }

  public boolean verifyPassword(String rawPassword, String encodedPassword) {
    return passwordEncoder.matches(rawPassword, encodedPassword);
  }

  public void banUser(Long userId) {
    User user = userRepository.findById(userId).orElseThrow();
    user.setBanned(true);
    userRepository.save(user);
  }
}
