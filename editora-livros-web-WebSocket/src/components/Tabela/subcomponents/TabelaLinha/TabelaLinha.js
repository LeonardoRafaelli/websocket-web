import React, { useEffect } from 'react';
import { Table } from 'flowbite-react';
import { TabelaLinhaCelula, TabelaLinhaCelulaAcoes } from "../";
import { Link, useNavigate } from 'react-router-dom';

export const TabelaLinha = ({ linha, indice, acoes, deletar, editar }) => {

    const navigate = useNavigate();

    const openChat = () => {
        navigate(`/livro/${linha.isbn}/chat`);
    }

    return (<>
        <Table.Row key={indice} onClick={openChat} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:cursor-pointer">
            {
                Object.values(linha).map((celula, indice) => (
                    <TabelaLinhaCelula key={indice} celula={celula} />
                ))
            }
            {acoes && <TabelaLinhaCelulaAcoes objeto={linha} deletar={deletar} editar={editar} />}
        </Table.Row>
    </>);
}