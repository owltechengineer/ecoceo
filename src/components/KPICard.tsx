interface KPICardProps {
  title: string;
  value: string;
  change: string;
  status: 'green' | 'yellow' | 'red';
  icon: string;
}

export default function KPICard({ title, value, change, status, icon }: KPICardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'red':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-white/30border-gray-200';
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6 border-l-4 ${getStatusColor(status)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-sm font-medium ${getChangeColor(change)}`}>
          {change}
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      
      <div className="mt-4 flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          status === 'green' ? 'bg-green-500' : 
          status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <span className="text-xs text-gray-500">
          {status === 'green' ? 'Ottimo' : 
           status === 'yellow' ? 'Attenzione' : 'Critico'}
        </span>
      </div>
    </div>
  );
}
