import { createContext } from "react";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs"

export const WebSocketContext = createContext();

export const WebSocketService = ({children}) => {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const connect = () => {
            const socket = new SockJS("http://localhost:8443/editora-livros-api/websocket"); // Usa o protocolo stomp para fazer a conexão
            const stomp = Stomp.over(socket);

            stomp.connect({}, () => {
                setStompClient(stomp); // Fazendo a conexão, ira setar o stomp client
            }, err => {
                console.log("Erro ao conectar: ", err)
                setTimeout(() => {
                    console.log("Reconectando...")
                    connect();
                }, 3000)
            })
        }
        connect();
    }, [])


    const disconnect = () => {
        if (stompClient) stompClient.disconnect();
    }

    const subscribe = (destiny, callback) => {
        // Se o stompClient existir e não tiver uma inscrição para o caminho, se inscreve
        if (stompClient && !stompClient.subscriptions[destiny]) return stompClient.subscribe(destiny, callback);
        
    }

    const send = (destiny, message) => {
        if (stompClient) stompClient.send(destiny, {}, JSON.stringify(message));
        else {
            console.log("Conexão não estabelecida");
        }
    }

    return (
        <WebSocketContext.Provider value={{ disconnect, send, subscribe, stompClient }}>
            {children}
        </WebSocketContext.Provider>
    )
}