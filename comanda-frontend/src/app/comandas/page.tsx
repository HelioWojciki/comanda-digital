"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import CardComanda, { Comanda } from "@/components/CardComanda";
import ModalNovaComanda from "@/components/ModalNovaComanda";
import ModalVisualizarComanda from "@/components/ModalVisualizarComanda";
import DashboardMetricas from "@/components/DashboardMetricas";

export default function ComandasPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [comandaSelecionadaId, setComandaSelecionadaId] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<"abertas" | "pagas">("abertas");

  const carregarComandasDoServidor = () => {
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
  };

  useEffect(() => {
    carregarComandasDoServidor();
  }, []);

  // abrir os detalhes
  const lidarComVisualizar = (id: string) => {
    setComandaSelecionadaId(id);
  };

  const adicionarNovaComandaNaLista = (novaComanda: Comanda) => {
    setComandas((listaAtual) => [novaComanda, ...listaAtual]);
  };

  const comandasAbertas = comandas.filter((c) => c.aberta);
  const comandasPagas = comandas.filter((c) => !c.aberta);
  const comandasParaExibir = filtroAtivo === "abertas" ? comandasAbertas : comandasPagas;

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

      {/* componente de métricas */}
      {!carregando && <DashboardMetricas comandas={comandas} />}

      {/* barra de abas para clicar e filtrar */}
      <div className="flex border-b border-gray-200 my-6">
        <button
          onClick={() => setFiltroAtivo("abertas")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            filtroAtivo === "abertas"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Mesas Ativas ({comandasAbertas.length})
        </button>
        <button
          onClick={() => setFiltroAtivo("pagas")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            filtroAtivo === "pagas"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Histórico (Pagas) ({comandasPagas.length})
        </button>
      </div>

      {carregando ? (
        <p className="text-blue-500 font-medium">
          Buscando dados no servidor Java...
        </p>
      ) : comandasParaExibir.length === 0 ? (
        <p className="text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
          {filtroAtivo === "abertas" 
            ? "Nenhuma comanda aberta no momento." 
            : "O histórico de pagamentos está vazio."}
        </p>        
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comandasParaExibir.map((comanda) => (
            <CardComanda
              key={comanda.id}
              comanda={comanda}
              onVisualizar={lidarComVisualizar} 
            />
          ))}
        </div>
      )}

      {/* Modal criar */}
      {mostrarModal && (
        <ModalNovaComanda 
          onFechar={() => setMostrarModal(false)}
          onComandaCriada={adicionarNovaComandaNaLista}
        />
      )}

      {/* modal de visualizacao e pagamento */}
      {comandaSelecionadaId && (
        <ModalVisualizarComanda
          comandaId={comandaSelecionadaId}
          onFechar={() => setComandaSelecionadaId(null)}
          onComandaAtualizada={carregarComandasDoServidor}
        />
      )}

    </main>
  );
}
