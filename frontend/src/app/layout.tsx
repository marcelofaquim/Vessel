import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Vessel - Reserva de Hospedagens',
  description: 'Plataforma de reservas de alta performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}