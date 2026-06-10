import { notFound } from 'next/navigation';

export default function PortfolioGeneratorLayout({ children }: { children: React.ReactNode }) {
  // Garante que o gerador de portfólio só possa ser acessado em ambiente de desenvolvimento (localhost)
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  
  return <>{children}</>;
}
