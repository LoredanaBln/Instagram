package main.service.dto.userAuthentication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import main.entity.UserType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
  private String username;
  private UserType role;
  private boolean authenticated;
}
