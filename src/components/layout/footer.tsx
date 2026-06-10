import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { ImageAssets } from '@/lib/placeholder-images';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const logoImage = ImageAssets.find((img) => img.id === 'bsn-logo-footer');

  return (
    <footer className="border-t border-border/40 py-6 md:py-8 bg-card">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center">
          {logoImage && (
            <Image
              src={logoImage.imageUrl}
              alt="Banda Sinfônica Nacional Logo"
              width={50}
              height={25}
              className="object-contain"
            />
          )}
        </div>
        <div className="text-sm text-muted-foreground text-center">
          <p>
            &copy; {currentYear} Banda Sinfônica Nacional. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por{' '}
            <Link href="https://www.linkedin.com/in/anniecrlarcher/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
              Annie Larcher
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://web.facebook.com/profile.php?id=61582234621848" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="https://www.instagram.com/bandasinfonicanacionalbr/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="https://youtube.com/@bandasinfonicanacional?si=aY0vFga80RHuWRJX" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
