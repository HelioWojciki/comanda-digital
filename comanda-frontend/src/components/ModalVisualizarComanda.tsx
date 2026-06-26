"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
interface ItemComanda {
  id?: string;
  nome: string;
  preco: number;
}

interface ComandaDetalhes {
  id: string;
  mesa: number;
  nomeCliente: string;
  aberta: boolean;
  valorTotal: number;
  itens: ItemComanda[];
}

interface ModalVisualizarComandaProps {
  comandaId: string; //Recebe o ID da comanda que foi clicada
  onFechar: () => void;
  onComandaAtualizada: () => void; // Avisa a pg para atualizar depois de pagar
}

export default function ModalVisualizarComanda({
  comandaId,
  onFechar,
  onComandaAtualizada,
}: ModalVisualizarComandaProps) {
  const [comanda, setComanda] = useState<ComandaDetalhes | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [novoItemNome, setNovoItemNome] = useState("");
  const [novoItemPreco, setNovoItemPreco] = useState("");
  const [adicionandoItem, setAdicionandoItem] = useState(false);
  
  // buscar os detalhes dessa comanda específica
  const buscarDetalhesDaComanda = () => {
    api
      .get(`/comandas/${comandaId}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((response) => {
        setComanda(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes:", error);
        alert("Erro ao carregar os detalhes.");
        onFechar();
      });
  };

  useEffect(() => {
    buscarDetalhesDaComanda();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comandaId]);

  // funcao de pg, que altera status
  const lidarComPagamento = () => {
    if (!comanda) return;
    
    setProcessandoPagamento(true);

    const comandaAtualizada = {
      ...comanda,
      aberta: false,
    };

    api
      .put(`/comandas/${comandaId}`, comandaAtualizada)
      .then(() => {
        onComandaAtualizada();
        onFechar();
      })
      .catch((error) => {
        console.error("Erro ao processar pagamento:", error);
        alert("Não foi possível processar o pagamento.");
      })
      .finally(() => {
        setProcessandoPagamento(false);
      });
  };

  const lidarComAdicionarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comanda) return;
    
    if (!novoItemNome.trim() || !novoItemPreco.trim()) {
      alert("Preencha o nome e o preço do produto.");
      return;
    }

    setAdicionandoItem(true);

    const novoItem = {
      nome: novoItemNome,
      preco: parseFloat(novoItemPreco.replace(",", ".")),
    };

    const novaListaDeItens = [...comanda.itens, novoItem];
    const novoValorTotal = novaListaDeItens.reduce((total, item) => total + Number(item.preco), 0);

    const comandaAtualizada = {
      ...comanda,
      itens: novaListaDeItens,
      valorTotal: novoValorTotal
    };

    api
      .put(`/comandas/${comandaId}`, comandaAtualizada)
      .then(() => {
        setNovoItemNome(""); 
        setNovoItemPreco(""); 
        
        setComanda(comandaAtualizada); 
        
        onComandaAtualizada(); 
      })
      .catch((error) => {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao adicionar o novo pedido.");
      })
      .finally(() => {
        setAdicionandoItem(false);
      });
  };


  return (
    <div 
      onClick={onFechar}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-100 overflow-y-auto max-h-[90vh] cursor-default"
      >
        {carregando || !comanda ? (
          <p className="text-center text-gray-500 font-medium my-10">A carregar detalhes da mesa...</p>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Mesa {comanda.mesa}</h2>
                <p className="text-gray-500">Cliente: {comanda.nomeCliente}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                comanda.aberta ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {comanda.aberta ? 'Aberto' : 'Pago'}
              </span>
            </div>

            <hr className="border-gray-200 my-4" />
            
            <h3 className="text-lg font-bold text-gray-800 mb-3">Itens Consumidos</h3>
            
            {/* Lista de Itens Existentes */}
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
              {comanda.itens?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="text-gray-700">{item.nome}</span>
                  <span className="font-medium text-gray-800">R$ {item.preco.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {comanda.aberta && (
              <form onSubmit={lidarComAdicionarItem} className="flex gap-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                <input
                  type="text"
                  placeholder="Novo pedido..."
                  value={novoItemNome}
                  onChange={(e) => setNovoItemNome(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={novoItemPreco}
                  onChange={(e) => setNovoItemPreco(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={adicionandoItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:bg-gray-400"
                >
                  {adicionandoItem ? "..." : "Add"}
                </button>
              </form>
            )}

            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg mb-6">
              <span className="text-blue-800 font-semibold text-lg">Total a Pagar:</span>
              <span className="text-blue-900 font-bold text-2xl">R$ {comanda.valorTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onFechar}
                disabled={processandoPagamento || adicionandoItem}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
              >
                Fechar
              </button>
              
              {comanda.aberta && (
                <button
                  type="button"
                  onClick={lidarComPagamento}
                  disabled={processandoPagamento || adicionandoItem}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow transition-all disabled:bg-gray-400"
                >
                  {processandoPagamento ? "A processar..." : "Pagar Comanda"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}