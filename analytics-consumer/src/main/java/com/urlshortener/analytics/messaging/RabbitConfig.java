package com.urlshortener.analytics.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class RabbitConfig {

    @Value("${app.rabbit.exchange}") private String exchange;
    @Value("${app.rabbit.routing-key}") private String routingKey;
    @Value("${app.rabbit.queue}") private String queue;
    @Value("${app.rabbit.dlq}") private String dlq;

    @Bean
    public MessageConverter jsonMessageConverter() { return new Jackson2JsonMessageConverter(); }

    @Bean
    public TopicExchange analyticsExchange() {
        return new TopicExchange(exchange, true, false);
    }

    @Bean
    public Queue analyticsQueue() {
        return QueueBuilder.durable(queue)
                .withArguments(Map.of(
                        "x-dead-letter-exchange", "",
                        "x-dead-letter-routing-key", dlq
                ))
                .build();
    }

    @Bean
    public Queue analyticsDlq() { return QueueBuilder.durable(dlq).build(); }

    @Bean
    public Binding binding() {
        return BindingBuilder.bind(analyticsQueue()).to(analyticsExchange()).with(routingKey);
    }
}
