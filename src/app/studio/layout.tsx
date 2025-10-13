import './[[...tool]]/studio.css';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="sanity-studio-container"
      style={{ 
        backgroundColor: '#1a1a1a', 
        color: '#ffffff',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {children}
    </div>
  );
}
