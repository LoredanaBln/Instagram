package main.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmsService {
  @Value("${twilio.account.sid}")
  private String accountSid;

  @Value("${twilio.auth.token}")
  private String authToken;

  @Value("${twilio.phone.number}")
  private String fromPhoneNumber;

  private String formatPhoneNumber(String phoneNumber) {
    String cleaned = phoneNumber.replaceAll("[^0-9]", "");
    if (cleaned.startsWith("0")) {
      cleaned = "+40" + cleaned.substring(1);
    } else if (!cleaned.startsWith("+")) {
      cleaned = "+40" + cleaned;
    }
    return cleaned;
  }

  public void sendBanNotification(String toPhoneNumber, String username) {
    try {
      Twilio.init(accountSid, authToken);

      String formattedNumber = formatPhoneNumber(toPhoneNumber);
      System.out.println("Sending SMS to: " + formattedNumber);

      Message message =
          Message.creator(
                  new PhoneNumber(formattedNumber),
                  new PhoneNumber(fromPhoneNumber),
                  String.format(
                      "Your account %s has been banned. Please check your email for details.",
                      username))
              .create();

      if (message.getStatus() == Message.Status.QUEUED
          || message.getStatus() == Message.Status.SENT
          || message.getStatus() == Message.Status.DELIVERED) {
        System.out.println("SMS sent successfully. Status: " + message.getStatus());
      } else {
        System.err.println("SMS may have failed. Status: " + message.getStatus());
        if (message.getErrorMessage() != null) {
          System.err.println("Error message: " + message.getErrorMessage());
        }
      }
    } catch (Exception e) {
      System.err.println("Failed to send SMS: " + e.getMessage());
    }
  }
}
