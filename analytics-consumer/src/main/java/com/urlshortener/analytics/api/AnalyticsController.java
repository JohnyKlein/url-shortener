package com.urlshortener.analytics.api;

import com.urlshortener.analytics.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsEventRepository repository;

    @GetMapping("/{shortCode}/count")
    public ResponseEntity<Map<String, Object>> count(@PathVariable String shortCode) {
        return ResponseEntity.ok(Map.of(
                "shortCode", shortCode,
                "events", repository.countByShortCode(shortCode)
        ));
    }
}
