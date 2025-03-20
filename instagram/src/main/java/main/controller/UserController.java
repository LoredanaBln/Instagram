package main.controller;

import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import main.service.UserService;
import main.service.dto.UserDTO;
import main.service.dto.userRegistration.RegistrationRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
  public ResponseEntity<UserDTO> updateUserById(
      @PathVariable Long id, @RequestBody UserDTO userDTO) {
    // TODO: Add authorization

    try {
      return ResponseEntity.ok(userService.update(userDTO)); // Return updated user with 200 OK
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build(); // Return 404 if post not found
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    // TODO: Add authorization
    try {
      userService.delete(id);
      return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
