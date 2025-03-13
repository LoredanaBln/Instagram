package main.controller;

import main.dto.LoginRequest;
import main.dto.PasswordChangeRequest;
import main.dto.UserDTO;
import main.entity.User;
import main.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<User> signUpUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.OK.value()).body(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(
            @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.loginUser(loginRequest));
    }

    @PutMapping("/update")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO user) {
        return ResponseEntity.status(HttpStatus.OK.value()).body(userService.updateUser(user));
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK.value()).body(userService.findUserById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findUserByUsername(username));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers());
    }

    @PutMapping("/ban/{id}")
    public ResponseEntity<User> toggleUserBan(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.toggleUserBan(id));
    }

    @PutMapping("/password")
    public ResponseEntity<User> changePassword(
            @RequestBody PasswordChangeRequest passwordChangeRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.changePassword(passwordChangeRequest));
    }
}
