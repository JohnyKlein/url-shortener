package com.urlshortener.shortener.api;

import com.urlshortener.shortener.api.dto.AnalyticsResponse;
import com.urlshortener.shortener.api.dto.ShortUrlResponse;
import com.urlshortener.shortener.api.dto.ShortenRequest;
import com.urlshortener.shortener.service.UrlShortenerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ShortenerController {

    private final UrlShortenerService service;

    @PostMapping("/shorten")
    public ResponseEntity<List<ShortUrlResponse>> shorten(
            @Valid @RequestBody ShortenRequest req,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.shorten(req, userId));
    }

    @GetMapping("/analytics/{shortCode}")
    public ResponseEntity<AnalyticsResponse> analytics(
            @PathVariable String shortCode,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(service.analytics(shortCode, userId));
    }

    @GetMapping("/urls")
    public ResponseEntity<List<ShortUrlResponse>> myUrls(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(service.listByUser(userId));
    }

    @DeleteMapping("/urls/{shortCode}")
    public ResponseEntity<Void> delete(
            @PathVariable String shortCode,
            @RequestHeader("X-User-Id") String userId) {
        service.delete(shortCode, userId);
        return ResponseEntity.noContent().build();
    }
}
