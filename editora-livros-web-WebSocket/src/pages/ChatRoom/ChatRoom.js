import React, { useEffect, useState } from 'react'
import { Button, Card, TextInput } from "flowbite-react";
import { Paragrafo, Titulo } from "../../components";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { apiMensagens, WebSocketContext } from '../../services';
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { useContext } from 'react';

export const ChatRoom = () => {

    const isbn = useParams().isbn
    const [mensagens, setMensagens] = useState([]);
    const [mensagem, setMensagem] = useState({});
    const { send, subscribe, stompClient } = useContext(WebSocketContext)

    useEffect(() => {
        async function carregar() {
            updateMessages();
            setDefaultMensagem();
        }
        carregar();
    }, []);

    
    // Chamado quando uma nova mensagem é recebida (websocket) (callback)
    const novaMensagem = response => {
        const mensagemRecebida = JSON.parse(response.body);
        console.log("Mensagem recebida: ", mensagemRecebida);
        setMensagens([...mensagens, mensagemRecebida]);
    }

    useEffect(() => {
        let subscribeId = subscribe(`/livro/${isbn}/chat`, novaMensagem);
        return () => {
            console.log("Desconectando...")
            if (subscribeId) subscribeId.unsubscribe();
        }
    }, [stompClient]);


    const updateMessages = async () => {
        apiMensagens.getMensagensLivro(isbn)
            .then((response) => {
                console.log(response);
                setMensagens(response);
            }).catch((error) => {
                console.log(error);
            })
    }

    const setDefaultMensagem = () => {
        const userCookie = Cookies.get('user');
        const userDecode = decodeURIComponent(userCookie);
        const user = JSON.parse(userDecode);
        const { pessoa } = user;
        const { cpf } = pessoa;
        setMensagem({
            livro: { isbn: isbn },
            remetente: { cpf: cpf },
            mensagem: ""
        })
        console.log(mensagem)
    }

    const atualizaMensagem = (event) => {
        event.preventDefault();
        const { value } = event.target;
        setMensagem({ ...mensagem, "mensagem": value });
    }


    const submit = async (event) => {
        if (mensagem.mensagem === null || mensagem.mensagem === undefined || mensagem.mensagem === '') return;
        event.preventDefault();
        send(`/editora-livros-api/livro/${isbn}`, mensagem);
        setDefaultMensagem();
    }

    return (
        <>
            <Card>
                {
                    Object.values(mensagens).map((mensagem) => (
                        console.log(mensagem),
                        <Card key={mensagem.id}>
                            <Titulo texto={mensagem.remetente.nome} />
                            <Paragrafo texto={mensagem.mensagem} />
                        </Card>
                    ))
                }
                <form onSubmit={submit}>
                    <TextInput
                        id="mensagem"
                        type="text"
                        placeholder="Digite a sua mensagem aqui..."
                        required={true}
                        onChange={atualizaMensagem}
                        value={mensagem.mensagem}
                    />
                    <Button type="submit">
                        <ForwardToInboxIcon className='h-4 w-auto pr-2' />
                        Enviar mensagem
                    </Button>
                </form>
            </Card>
        </>
    )
}