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
  const [enviando, setEnviando] = useState(false);

  const [itens, setItens] = useState([{ nome: "", preco: "" }]);

  const adicionarNovoCampoItem = () => {
    setItens([...itens, { nome: "", preco: "" }]);
  };

  const removerCampoItem = (indexParaRemover: number) => {
    if (itens.length === 1) return;
    const novaLista = itens.filter((_, index) => index !== indexParaRemover);
    setItens(novaLista);
  };

  const atualizarValorItem = (
    index: number,
    campo: "nome" | "preco",
    valor: string,
  ) => {
    const novaLista = [...itens];
    novaLista[index][campo] = valor;
    setItens(novaLista);
  };

  // enviar o formulário
  const lidarComSalvarComanda = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!nomeCliente.trim() || !mesa) {
      alert("Por favor, preencha o Nome e a Mesa.");
      return;
    }

    const temItemVazio = itens.some((item) => !item.nome.trim() || !item.preco);
    if (temItemVazio) {
      alert("Por favor, preencha o nome e o preço de todos os itens da lista.");
      return;
    }

    setEnviando(true);

    // JSON agora envia a lista (array) mapeada para o Java
    const novaComandaParaSalvar = {
      nomeCliente: nomeCliente,
      mesa: Number(mesa),
      itens: itens.map((item) => ({
        nome: item.nome,
        preco: parseFloat(item.preco.replace(",", ".")),
      })),
    };

    // Req. de POST
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
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg border border-gray-100 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Abrir Nova Comanda</h2>

        <form onSubmit={lidarComSalvarComanda} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Cliente *</label>
              <input
                type="text" required value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Ex: Felipe Silva"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Número da Mesa *</label>
              <input
                type="number" required min="1" value={mesa}
                onChange={(e) => setMesa(e.target.value)}
                placeholder="Ex: 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <hr className="border-gray-200" />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Pedido Inicial</h3>
              <button 
                type="button" 
                onClick={adicionarNovoCampoItem}
                className="text-sm bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-md hover:bg-green-200 transition"
              >
                + Adicionar Outro Item
              </button>
            </div>

            <div className="space-y-3">
              {itens.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <input
                      type="text" required placeholder="Nome do Produto"
                      value={item.nome}
                      onChange={(e) => atualizarValorItem(index, 'nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="text" required placeholder="R$ 0,00"
                      value={item.preco}
                      onChange={(e) => atualizarValorItem(index, 'preco', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  {/* Esconde o btn de apagar se for o último item da lista */}
                  {itens.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removerCampoItem(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                      title="Remover item"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button" onClick={onFechar} disabled={enviando}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={enviando}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow disabled:bg-gray-400"
            >
              {enviando ? "A processar..." : "Abrir Comanda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}