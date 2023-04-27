package br.senai.sc.editoralivros.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/editora-livros-api/websocket") // endpoint para se conectar ao websocket
                .setAllowedOrigins("http://localhost:3000") // quem pode se conectar ao websocket
                .withSockJS() // habilita o uso do metodo stomp do websocket
                .setSessionCookieNeeded(true); // precisa de cookie para se conectar
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/editora-livros-api");
    }
}
