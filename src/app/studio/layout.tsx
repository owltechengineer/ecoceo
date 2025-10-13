import './[[...tool]]/studio.css';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {children}
    </div>
  );
}
