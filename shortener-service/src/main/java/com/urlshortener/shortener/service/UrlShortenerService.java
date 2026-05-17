package com.urlshortener.shortener.service;

import com.urlshortener.shortener.api.dto.AnalyticsResponse;
import com.urlshortener.shortener.api.dto.ShortUrlResponse;
import com.urlshortener.shortener.api.dto.ShortenRequest;
import com.urlshortener.shortener.domain.ShortUrl;
import com.urlshortener.shortener.messaging.AnalyticsEvent;
import com.urlshortener.shortener.messaging.AnalyticsEventPublisher;
import com.urlshortener.shortener.repository.ShortUrlRepository;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UrlShortenerService {

    private static final Logger log = LoggerFactory.getLogger(UrlShortenerService.class);

    private final ShortUrlRepository repository;
    private final ShortCodeGenerator codeGenerator;
    private final AnalyticsEventPublisher analyticsPublisher;
    private final MeterRegistry meterRegistry;

    @Value("${app.shortener.base-url}")
    private String baseUrl;

    @Value("${app.shortener.max-urls-per-request}")
    private int maxUrlsPerRequest;

    private Counter createdCounter;
    private Counter redirectedCounter;
    private Counter failedCounter;
    private Timer creationTimer;

    @jakarta.annotation.PostConstruct
    void initMetrics() {
        createdCounter = meterRegistry.counter("urls.created.total");
        redirectedCounter = meterRegistry.counter("urls.redirected.total");
        failedCounter = meterRegistry.counter("urls.failed.total");
        creationTimer = meterRegistry.timer("urls.creation.latency");
    }

    @Transactional
    public List<ShortUrlResponse> shorten(ShortenRequest req, String userId) {
        if (req.urls().size() > maxUrlsPerRequest) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Maximum number of URLs per request is " + maxUrlsPerRequest);
        }
        return creationTimer.record(() ->
                req.urls().stream().map(entry -> createOne(entry, userId)).toList()
        );
    }

    private ShortUrlResponse createOne(ShortenRequest.UrlEntry entry, String userId) {
        try {
            boolean anonymous = userId == null || userId.isBlank();
            String code;
            int attempts = 0;
            do {
                code = codeGenerator.generate();
                if (++attempts > 5) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not generate unique short code");
                }
            } while (repository.existsByShortCode(code));

            if (anonymous) {
                return new ShortUrlResponse(
                        code,
                        baseUrl + "/" + code,
                        entry.url(),
                        Instant.now(),
                        entry.expiresAt(),
                        0L,
                        true
                );
            }

            ShortUrl saved = repository.save(ShortUrl.builder()
                    .shortCode(code)
                    .originalUrl(entry.url())
                    .ownerId(userId)
                    .expiresAt(entry.expiresAt())
                    .build());
            createdCounter.increment();
            return toResponse(saved);
        } catch (RuntimeException e) {
            failedCounter.increment();
            throw e;
        }
    }

    @Cacheable(cacheNames = "redirects", key = "#shortCode")
    public String resolveOriginalUrl(String shortCode) {
        ShortUrl url = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Short code not found"));
        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.GONE, "Short URL expired");
        }
        return url.getOriginalUrl();
    }

    @Transactional
    public void recordHit(String shortCode, String ip, String userAgent, String referer) {
        repository.incrementHits(shortCode);
        redirectedCounter.increment();
        try {
            analyticsPublisher.publish(new AnalyticsEvent(shortCode, Instant.now(), ip, userAgent, referer));
        } catch (Exception e) {
            log.warn("Failed to publish analytics for {}: {}", shortCode, e.getMessage());
        }
    }

    public AnalyticsResponse analytics(String shortCode, String userId) {
        ShortUrl url = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Short code not found"));
        if (url.getOwnerId() == null || !url.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this URL");
        }
        return new AnalyticsResponse(url.getShortCode(), url.getHits(), url.getOriginalUrl());
    }

    public List<ShortUrlResponse> listByUser(String userId) {
        return repository.findAllByOwnerIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional
    @CacheEvict(cacheNames = "redirects", key = "#shortCode")
    public void delete(String shortCode, String userId) {
        ShortUrl url = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Short code not found"));
        if (url.getOwnerId() == null || !url.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this URL");
        }
        repository.delete(url);
    }

    private ShortUrlResponse toResponse(ShortUrl s) {
        return new ShortUrlResponse(
                s.getShortCode(),
                baseUrl + "/" + s.getShortCode(),
                s.getOriginalUrl(),
                s.getCreatedAt(),
                s.getExpiresAt(),
                s.getHits(),
                false
        );
    }
}
