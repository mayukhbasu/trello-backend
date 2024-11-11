package com.trello.user.exception;

public class UserNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L; // Add this line
    public UserNotFoundException(String message) {
        super(message);
    }
}