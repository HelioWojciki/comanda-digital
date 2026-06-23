"use client";

import { useState } from "react";
import api from "@/services/api";
import { Comanda } from "./CardComanda";

interface ModalNovaComandaProps {
  onFechar: () => void;
  onComandaCriada: (novaComanda: Comanda) => void;
}

export default function ModalNovaComanda({
  onFechar,
  onComandaCriada,
}: ModalNovaComandaProps) {
  const [nomeCliente, setNomeCliente] = useState("");
  const [mesa, setMesa] = useState("");
  const [nomeItem, setNomeItem] = useState("");
  const [precoItem, setPrecoItem] = useState("");
  const [enviando, setEnviando] = useState(false);

  // enviar o formulário
  const lidarComSalvarComanda = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!nomeCliente.trim() || !mesa || !nomeItem.trim() || !precoItem) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setEnviando(true);

    // montando JSON
    const novaComandaParaSalvar = {
      nomeCliente: nomeCliente,
      mesa: Number(mesa),
      itens: [
        {
          nome: nomeItem,
          preco: parseFloat(precoItem.replace(",", ".")),
        },
      ],
    };

    // Requisição POST para o backend Java
    api
      .post("/comandas", novaComandaParaSalvar)
      .then((response) => {
        onComandaCriada(response.data); // Coloca a nova comanda na tela
        onFechar(); // Fecha a janela
      })
      .catch((error) => {
        console.error("Erro ao salvar comanda:", error);
        alert("Erro ao criar nova comanda no servidor.");
      })
      .finally(() => setEnviando(false));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Abrir Nova Comanda
        </h2>

        <form onSubmit={lidarComSalvarComanda} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Cliente
            </label>
            <input
              type="text"
              required
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              placeholder="Ex: Felipe Silva"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Número da Mesa
            </label>
            <input
              type="number"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
              placeholder="Ex: 5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Item
            </label>
            <input
              type="text"
              required
              value={nomeItem}
              onChange={(e) => setNomeItem(e.target.value)}
              placeholder="Ex: Água com gás"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="text"
              required
              value={precoItem}
              onChange={(e) => setPrecoItem(e.target.value)}
              placeholder="Ex: 5,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* fazero primeiro pedido */}
          <hr className="border-gray-200 my-4" />
          <h3 className="text-lg font-bold text-gray-800">Primeiro Pedido</h3>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              disabled={enviando}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-all disabled:bg-gray-400"
            >
              {enviando ? "Criando..." : "Criar Comanda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
