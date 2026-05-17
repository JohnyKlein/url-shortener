package com.urlshortener.shortener.messaging;

import com.urlshortener.shortener.config.RabbitProperties;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

import java.util.Map;

@Configuration
public class RabbitConfig {

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public TopicExchange analyticsExchange(RabbitProperties props) {
        return new TopicExchange(props.getExchange(), true, false);
    }

    @Bean
    public Queue analyticsQueue(RabbitProperties props) {
        return QueueBuilder.durable(props.getQueue())
                .withArguments(Map.of(
                        "x-dead-letter-exchange", "",
                        "x-dead-letter-routing-key", props.getDlq()
                ))
                .build();
    }

    @Bean
    public Queue analyticsDlq(RabbitProperties props) {
        return QueueBuilder.durable(props.getDlq()).build();
    }

    @Bean
    public Binding analyticsBinding(Queue analyticsQueue, TopicExchange analyticsExchange, RabbitProperties props) {
        return BindingBuilder.bind(analyticsQueue).to(analyticsExchange).with(props.getRoutingKey());
    }
}
