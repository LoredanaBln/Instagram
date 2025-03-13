package main.exception;

public class UnknownUser extends RuntimeException {
    public UnknownUser(String message) {
        super(message);
    }
}
