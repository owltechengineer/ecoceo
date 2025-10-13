import './[[...tool]]/studio.css';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-sanity-studio>
      {children}
    </div>
  );
}
