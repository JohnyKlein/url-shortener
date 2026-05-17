package com.urlshortener.analytics.messaging;

import com.urlshortener.analytics.domain.AnalyticsEventEntity;
import com.urlshortener.analytics.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AnalyticsEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsEventConsumer.class);
    private final AnalyticsEventRepository repository;

    @RabbitListener(queues = "${app.rabbit.queue}")
    @Transactional
    public void onMessage(AnalyticsEvent event) {
        log.info("Received analytics event for shortCode={}", event.shortCode());
        repository.save(AnalyticsEventEntity.builder()
                .shortCode(event.shortCode())
                .occurredAt(event.timestamp())
                .ip(event.ip())
                .userAgent(event.userAgent())
                .referer(event.referer())
                .build());
    }

    @RabbitListener(queues = "${app.rabbit.dlq}")
    public void onDlq(AnalyticsEvent event) {
        log.warn("DLQ message received: {}", event);
    }
}
