package com.urlshortener.shortener.messaging;

import com.urlshortener.shortener.config.RabbitProperties;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AnalyticsEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;
    private final RabbitProperties props;

    @Retry(name = "analyticsPublisher")
    @CircuitBreaker(name = "analyticsPublisher", fallbackMethod = "fallback")
    public void publish(AnalyticsEvent event) {
        rabbitTemplate.convertAndSend(props.getExchange(), props.getRoutingKey(), event);
    }

    @SuppressWarnings("unused")
    private void fallback(AnalyticsEvent event, Throwable t) {
        log.warn("Analytics publish failed for {}: {}", event.shortCode(), t.getMessage());
    }
}
