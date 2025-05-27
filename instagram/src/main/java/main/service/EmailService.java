package main.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
  private final JavaMailSender mailSender;

  @Value("${spring.mail.username}")
  private String fromEmail;

  public void sendBanNotification(String toEmail, String username) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("Account Banned");
    message.setText(
        String.format(
            "Dear %s,\n\nYour account has been banned due to violation of our community guidelines. "
                + "If you believe this is a mistake, please contact our support team.\n\n"
                + "Best regards,\nLategram team",
            username));

    mailSender.send(message);
  }
}
