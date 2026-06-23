'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import CardComanda, { Comanda } from '@/components/CardComanda';
import { error } from 'console';

export default function ComandasPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/comandas', {
      headers: {
        'Cache-Control': 'no-cache',
        'Progma': 'no-cache',
        'Expires': '0'
      }
    })
      .then((response) => {
        setComandas(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar comandas:', error);
        setCarregando(false);
      });
  }, []);

  const lidarComAlternarStatus = (id: string) => {
    // Procura a comanda clicada na lista atual do React
    const comandaAlvo = comandas.find(c => c.id === id);
    if (!comandaAlvo) return;

    // inverte o valor
    const novoStatusAberta = !comandaAlvo.aberta;

    // Dispara a atualização para o Java
    api.patch(`/comandas/${id}`, {aberta: novoStatusAberta})
      .then(() => {
        setComandas(listaAtual => 
          listaAtual.map(c => c.id === id ? {...c, aberta: novoStatusAberta} : c)
        );
      })
      .catch((error) => {
        console.error('Erro ao atualizar no Java:', error);
        alert('Não foi possível atualizar o status no servidor.');
      })
  }

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Painel de Comandas</h1>
      <p className="text-gray-600 mb-8">Gerenciamento de mesas e atendimento.</p>

      {carregando ? (
        <p className="text-blue-500 font-medium">Buscando dados no servidor Java...</p>
      ) : comandas.length === 0 ? (
        <p className="text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
          Nenhuma comanda aberta no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comandas.map((comanda) => (
            <CardComanda 
              key={comanda.id} 
              comanda={comanda} 
              onAlternarStatus={lidarComAlternarStatus}
            />
          ))}
        </div>
      )}
    </main>
  );
}