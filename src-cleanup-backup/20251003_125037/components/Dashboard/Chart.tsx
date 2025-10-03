interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string | string[];
    }>;
  };
}

export default function Chart({ type, data }: ChartProps) {
  // Placeholder per i grafici - in futuro integreremo Chart.js
  const renderPlaceholder = () => {
    switch (type) {
      case 'line':
        return (
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600 font-medium">Grafico Lineare</p>
              <p className="text-sm text-gray-500">Entrate vs Uscite</p>
            </div>
          </div>
        );
      case 'bar':
        return (
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600 font-medium">Grafico a Barre</p>
              <p className="text-sm text-gray-500">Stato Investimenti</p>
            </div>
          </div>
        );
      case 'doughnut':
        return (
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🥧</div>
              <p className="text-gray-600 font-medium">Grafico a Torta</p>
              <p className="text-sm text-gray-500">Ricavi per Servizio</p>
            </div>
          </div>
        );
      default:
        return <div>Grafico non supportato</div>;
    }
  };

  return (
    <div className="w-full">
      {renderPlaceholder()}
      {/* In futuro qui andrà il vero componente Chart.js */}
    </div>
  );
}
