package com.urlshortener.shortener.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.rabbit")
@Getter @Setter
public class RabbitProperties {
    private String exchange;
    private String routingKey;
    private String queue;
    private String dlq;
}
