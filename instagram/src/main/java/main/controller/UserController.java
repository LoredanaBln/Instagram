package main.controller;

import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import main.service.UserService;
import main.service.dto.UserDTO;
import main.service.dto.userAuthentication.AuthenticationResponse;
import main.service.dto.userAuthentication.LoginRequest;
import main.service.dto.userAuthentication.RegistrationRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import main.security.RequireAuthentication;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping
  public ResponseEntity<List<UserDTO>> index() {
    return ResponseEntity.status(HttpStatus.OK.value()).body(userService.getAll());
  }

  @PostMapping
  public ResponseEntity<UserDTO> create(
      @ModelAttribute RegistrationRequest request,
      @RequestParam(value = "image", required = false) MultipartFile image)
      throws IOException {

    UserDTO createdUser = userService.create(request, image);

    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserDTO> show(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(userService.get(id));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}")
  @RequireAuthentication
  public ResponseEntity<UserDTO> update(
      @PathVariable Long id, @RequestBody UserDTO userDTO, HttpSession session) {
    try {
      return ResponseEntity.ok(userService.update(id, userDTO, session));
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Not authenticated")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      if (e.getMessage().contains("Not authorized")) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  @RequireAuthentication
  public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session) {
    try {
      userService.delete(id, session);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      if (e.getMessage().contains("Not authenticated")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      if (e.getMessage().contains("Not authorized")) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> login(
      @RequestBody LoginRequest loginRequest, HttpSession session) {
    try {
      AuthenticationResponse response = userService.login(loginRequest, session);
      return ResponseEntity.ok(response);
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
  }

  @PostMapping("/logout")
  @RequireAuthentication
  public ResponseEntity<Void> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.noContent().build();
  }
}
