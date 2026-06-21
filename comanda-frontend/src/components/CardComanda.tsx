// Definição da estrutura da Comanda
export interface Comanda {
  id: number;
  mesa: number;
  nomeCliente: string;
  pago: boolean;
}

interface CardComandaProps {
  comanda: Comanda;
}

/**
 * Componente visual que renderiza as info resumidas de uma comanda.
 * * @param comanda Objeto contendo os dados atuais vindos do Java (id, nomeCliente, pago).
 * @returns Um "card" estilizado com Tailwind.
 * * TODO: Incluir o atributo 'mesa' no futuro na interface e no layout assim que o backend Java/Banco de dados for atualizado.
 */
export default function CardComanda({ comanda }: CardComandaProps) {
  return (
    <div className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-700">Mesa {comanda.mesa}</h2>
        <p className="text-sm text-gray-500">Cliente: {comanda.nomeCliente}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        comanda.pago ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {comanda.pago ? 'Pago' : 'Aberto'}
      </span>
    </div>
  );
}