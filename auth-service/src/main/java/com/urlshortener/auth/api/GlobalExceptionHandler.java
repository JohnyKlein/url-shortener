package com.urlshortener.auth.api;

import com.urlshortener.auth.api.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .sorted(Comparator.comparing(FieldError::getField))
                .map(f -> formatField(f.getField()) + ": " + capitalize(f.getDefaultMessage()))
                .distinct()
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(ApiError.of(400, msg));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleStatus(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(ApiError.of(
                        ex.getStatusCode().value(),
                        ex.getReason() != null ? ex.getReason() : "Request error"
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of(500, "Internal server error"));
    }

    private String formatField(String field) {
        return switch (field) {
            case "email" -> "Email";
            case "password" -> "Password";
            default -> toReadableLabel(field);
        };
    }

    private String capitalize(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    private String toReadableLabel(String field) {
        String withSpaces = field.replaceAll("([a-z])([A-Z])", "$1 $2");
        return capitalize(withSpaces);
    }
}