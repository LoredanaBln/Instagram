package main.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import jakarta.transaction.Transactional;
import java.io.IOException;
import main.entity.User;
import main.repository.IUserRepository;
import main.service.dto.UserDTO;
import main.service.dto.userRegistration.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
@Transactional
class UserServiceTest {
  @Autowired private UserService userService;

  @Autowired private IUserRepository userRepository;
  private RegistrationRequest request;
  private MultipartFile mockImage;

  @BeforeEach
  void setUp() {
    request = new RegistrationRequest();
    request.setUsername("testUser");
    request.setPassword("password");
    request.setEmail("test@example.com");

    mockImage = new MockMultipartFile("file.jpg", "content".getBytes());
  }

  @Test
  void create() throws IOException {
    UserDTO result = userService.create(request, mockImage);

    assertNotNull(result);
    assertEquals("testUser", result.getAttributes().getUsername());
    assertEquals("test@example.com", result.getAttributes().getEmail());

    User savedUser = userRepository.findByUsername("testUser").orElse(null);
    assertNotNull(savedUser);
    assertEquals("testUser", savedUser.getUsername());
  }
}
