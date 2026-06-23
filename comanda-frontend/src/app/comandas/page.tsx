"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import CardComanda, { Comanda } from "@/components/CardComanda";
import ModalNovaComanda from "@/components/ModalNovaComanda";

export default function ComandasPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    api
      .get("/comandas", {
        headers: {
          "Cache-Control": "no-cache",
          Progma: "no-cache",
          Expires: "0",
        },
      })
      .then((response) => {
        setComandas(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar comandas:", error);
        setCarregando(false);
      });
  }, []);

  const lidarComAlternarStatus = (id: string) => {
    // Procura a comanda clicada na lista atual do React
    const comandaAlvo = comandas.find((c) => c.id === id);
    if (!comandaAlvo) return;

    // inverte o valor
    const novoStatusAberta = !comandaAlvo.aberta;

    const comandaAtualizada = {
      ...comandaAlvo,
      aberta: novoStatusAberta
    };

    // Dispara a atualização para o Java
    api
      .put(`/comandas/${id}`, comandaAtualizada)
      .then(() => {
        setComandas((listaAtual) =>
          listaAtual.map((c) =>
            c.id === id ? { ...c, aberta: novoStatusAberta } : c,
          ),
        );
      })
      .catch((error) => {
        console.error("Erro ao atualizar no Java:", error);
        alert("Não foi possível atualizar o status no servidor.");
      });
  };

  const adicionarNovaComandaNaLista = (novaComanda: Comanda) => {
    setComandas((listaAtual) => [novaComanda, ...listaAtual]);
  };

  return (
    <main className="p-10 max-w-4xl mx-auto">

      {/* Btn só faz o interruptor virar 'true' */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Painel de Comandas
          </h1>
          <p className="text-gray-600">Gerenciamento de mesas e atendimento.</p>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-all"
        >
          + Nova Comanda
        </button>
      </div>

      {carregando ? (
        <p className="text-blue-500 font-medium">
          Buscando dados no servidor Java...
        </p>
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

      {/* se 'mostrarModal' for true ele aparece na tela */}
      {mostrarModal && (
        <ModalNovaComanda 
          onFechar={() => setMostrarModal(false)}
          onComandaCriada={adicionarNovaComandaNaLista}
        />
      )}

    </main>
  );
}
