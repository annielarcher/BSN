'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Users, Mic2, BookOpen, Star, CheckCircle2, Landmark, Heart, Music, Film, MapPin, FileText, ExternalLink, PlayCircle, Camera, FileCheck, Facebook, Instagram, Youtube, Printer, Settings } from 'lucide-react';
import { lideranca, testimonials, noticias, musicos } from '@/lib/institutional-data';
import { ImageAssets, VideoAssets } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import eventosData from '@/lib/eventos.json';
import NovoPortfolio from './novo-portfolio';

type PortfolioType = 'geral' | 'rouanet' | 'investidor' | 'novo';

export default function PortfolioGeneratorPage() {
  const [type, setType] = useState<PortfolioType>('geral');
  const [pdfHeight, setPdfHeight] = useState<number | null>(null);

  const heroImage = ImageAssets.find((img) => img.id === 'institutional-hero');
  const logoImage = ImageAssets.find((img) => img.id === 'bsn-logo');
  const rouanetLogoUrl = "https://www.gov.br/cultura/pt-br/centrais-de-conteudo/marcas-e-logotipos/marcas-rouanet/LogoLeiRouanet_colorida.png";

  const proofImages = ImageAssets.filter(img => img.id.startsWith('gallery-') && !['gallery-10', 'gallery-14'].includes(img.id)).slice(0, 10);

  const pastEvents = eventosData.events.slice(0, 6).map(e => {
    // Tenta extrair apenas o mês e ano para ficar mais conciso, ou usa a data original
    const dateParts = e.date.split(' de ');
    const shortDate = dateParts.length === 3 
      ? `${dateParts[1].substring(0, 3).toUpperCase()} ${dateParts[2]}`
      : e.date;

    return {
      year: shortDate,
      title: e.title,
      description: e.description,
      location: e.location
    };
  });

  const handlePrint = () => {
    if (type === 'novo') {
      const container = document.getElementById('novo-portfolio-container');
      if (container) {
        // Obter altura exata em pixels do contêiner que será impresso
        // Como vamos aumentar a "lente" (font-size) no print, a altura real impressa será maior.
        // Multiplicamos por 1.45 (fator de escala de 16px para ~23px + margem de segurança)
        const height = container.scrollHeight * 1.45;
        setPdfHeight(height);
        // Aguarda a renderização do novo style antes de chamar o print
        setTimeout(() => window.print(), 300);
        return;
      }
    }
    window.print();
  };

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: ${type === 'novo' ? `297mm ${pdfHeight ? pdfHeight + 'px' : '1500mm'}` : 'A4 portrait'}; 
            margin: 0; 
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          
          ${type === 'novo' ? `
          /* Aumenta a lente base do tailwind (rem) para Mobile Landscape */
          html {
            font-size: 22px !important;
          }
          /* Layout Contínuo (Digital Scroll) */
          section.portfolio-section {
            page-break-after: auto;
            break-after: auto;
            min-height: auto;
          }
          ` : `
          /* Layout Paginado Padrão */
          section.portfolio-section { 
            page-break-after: always; 
            break-after: page; 
            min-height: 296mm; 
            box-sizing: border-box;
          }
          section.portfolio-section:last-of-type { 
            page-break-after: auto; 
            break-after: auto; 
          }
          `}
        }
      `}} />

      {/* Control Panel (Hidden on Print) */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-50 border-b border-border shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Settings className="text-primary w-5 h-5" />
          <span className="font-bold">Gerador de Portfólio</span>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
          <Button 
            variant={type === 'geral' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setType('geral')}
          >
            Apresentação Geral
          </Button>
          <Button 
            variant={type === 'rouanet' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setType('rouanet')}
          >
            Edital / Rouanet
          </Button>
          <Button 
            variant={type === 'investidor' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setType('investidor')}
          >
            Investidor Privado
          </Button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <Button 
            variant={type === 'novo' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setType('novo')}
            className="bg-amber-500 text-black hover:bg-amber-400 font-bold"
          >
            Novo Design (Premium)
          </Button>
        </div>

        <Button onClick={handlePrint} className="gap-2 font-bold">
          <Printer className="w-4 h-4" />
          Gerar PDF
        </Button>
      </div>

      {/* Padding to push content below fixed header */}
      <div className="h-24 print:hidden"></div>

      {type === 'novo' ? (
        <div id="novo-portfolio-container">
          <NovoPortfolio />
        </div>
      ) : (
        <div className="min-h-screen bg-background text-foreground font-sans print:bg-[#0d121f] print:text-white">
        
        {/* =====================================================================================
            1. CAPA
        ===================================================================================== */}
        <section className="portfolio-section relative w-full min-h-screen flex flex-col items-center justify-center text-center p-6 print:p-4 border-b border-primary/20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30 select-none print:opacity-40">
            {heroImage && (
              <Image src={heroImage.imageUrl} alt="" fill className="object-cover grayscale" priority />
            )}
          </div>
          
          <div className={`relative z-10 bg-background/95 p-10 print:p-4 rounded-2xl border-2 border-primary/30 md:backdrop-blur-md md:bg-background/90 max-w-5xl shadow-2xl print:border-4 print:shadow-none print:bg-[#0d121f]/95 w-full ${type === 'geral' ? '' : ''}`}>
            
            <div className="flex flex-col justify-center items-center gap-4 print:gap-2 mb-8 print:mb-2">
              {logoImage && (
                <div className="bg-white/5 p-4 rounded-lg">
                  <Image src={logoImage.imageUrl} alt="Logo BSN" width={500} height={250} className="w-64 md:w-[400px] h-auto print:w-72" />
                </div>
              )}
              {type === 'rouanet' && (
                <div className="bg-white p-2 rounded-md h-fit mt-4">
                  <img src={rouanetLogoUrl} alt="Lei de Incentivo à Cultura - Rouanet" className="w-24 h-auto object-contain" />
                </div>
              )}
            </div>
            
            <h1 className="font-headline text-5xl md:text-7xl print:text-4xl font-bold mb-4 print:mb-2 text-primary tracking-tight uppercase" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>
              {type === 'geral' ? 'Portfólio Artístico 2026' : 'Portfólio Cultural'}
            </h1>
            
            {type === 'geral' ? (
              <p className="font-body text-xl md:text-3xl print:text-base text-muted-foreground uppercase tracking-[0.2em] mb-8 print:mb-3 border-t border-b border-primary/20 py-3 print:py-1 print:text-gray-300">
                Excelência • Inovação • Brasilidade
              </p>
            ) : (
              <h2 className="font-body text-2xl md:text-3xl print:text-xl font-bold text-foreground mb-10 print:mb-6 print:text-white">
                Banda Sinfônica Nacional
              </h2>
            )}

            {type === 'geral' ? (
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary bg-primary/10 text-primary font-bold text-sm md:text-base print:text-xs uppercase tracking-wider print:border-2">
                <CheckCircle2 size={18} />
                Apresentação Institucional
              </div>
            ) : (
              <div className="text-left bg-secondary/30 p-8 print:p-4 rounded-xl border border-primary/20 print:border-white/20 print:bg-white/10">
                <div className="grid md:grid-cols-2 gap-6 print:gap-x-4 print:gap-y-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1 print:text-gray-400">Proponente / Direção</p>
                    <p className="text-lg print:text-base font-bold text-foreground mb-4 print:text-white">Geyzilane de Andrade Moreira</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1 print:text-gray-400">Projeto</p>
                    <p className="text-lg print:text-base font-bold text-foreground mb-4 print:text-white">
                      {type === 'rouanet' ? 'Plano Anual BSN 2026 (PRONAC 2512974)' : 'Plano Anual BSN 2026'}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4 print:my-2 bg-primary/30" />

                <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                  {type === 'rouanet' && (
                    <Badge variant="outline" className="border-primary text-primary font-bold px-4 py-1 print:border-white print:text-white">
                      Artigo 18 (100% Incentivo)
                    </Badge>
                  )}
                  {type === 'investidor' && (
                    <Badge variant="outline" className="border-primary text-primary font-bold px-4 py-1 print:border-white print:text-white">
                      Cotas de Patrocínio Direto
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-primary text-primary font-bold px-4 py-1 print:border-white print:text-white">
                    Música Instrumental
                  </Badge>
                  <Badge variant="outline" className="border-primary text-primary font-bold px-4 py-1 print:border-white print:text-white">
                    Rio de Janeiro - RJ
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================================================
            2. APRESENTAÇÃO
        ===================================================================================== */}
        <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto print:py-10 flex flex-col justify-center">
          <div className="mb-6 print:mb-4 flex items-center gap-2 text-primary print:text-white">
            <span className="text-4xl font-bold opacity-30">02</span>
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>Apresentação</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 print:gap-6">
            <div>
              <h2 className="font-headline text-4xl print:text-3xl font-bold mb-6 text-foreground print:text-white">
                Excelência, Inovação e Brasilidade
              </h2>
              <div className="space-y-4 print:space-y-2 text-lg print:text-base text-justify leading-relaxed text-muted-foreground print:text-gray-300">
                <p>
                  A <strong>Banda Sinfônica Nacional (BSN)</strong> não é apenas uma orquestra; é um movimento cultural fundado para romper as barreiras entre a música de concerto e a cultura popular.
                </p>
                <p>
                  Nossa missão é <strong>democratizar a excelência</strong>. Formada por mestres e doutores em música, a BSN une o rigor técnico da música de concerto com a vibrante diversidade da cultura brasileira, levando grandes espetáculos a teatros renomados e espaços públicos.
                </p>
              </div>
            </div>

            <div className="space-y-6 print:space-y-4">
              <Card className={`bg-card border-l-4 break-inside-avoid print:bg-[#1a202c] ${type !== 'geral' ? 'border-l-primary print:border-l-[#fbbf24]' : 'border-l-primary'}`}>
                <CardContent className="pt-6 print:pt-4">
                  <h4 className="flex items-center gap-2 font-bold text-lg mb-2 print:mb-1 print:text-white">
                    <Music className={type !== 'geral' ? "text-primary print:text-[#fbbf24]" : "text-primary"} /> Área de Atuação
                  </h4>
                  <p className="text-sm print:text-gray-300">Música Instrumental (Erudita e Popular), Educação Musical e Preservação do Patrimônio Imaterial.</p>
                </CardContent>
              </Card>

              <Card className={`bg-card border-l-4 break-inside-avoid print:bg-[#1a202c] ${type !== 'geral' ? 'border-l-primary print:border-l-[#fbbf24]' : 'border-l-primary'}`}>
                <CardContent className="pt-6 print:pt-4">
                  <h4 className="flex items-center gap-2 font-bold text-lg mb-2 print:mb-1 print:text-white">
                    <Heart className={type !== 'geral' ? "text-primary print:text-[#fbbf24]" : "text-primary"} /> Impacto e Metas
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1 print:text-xs print:text-gray-300">
                    <li>Democratização do acesso à música sinfônica.</li>
                    <li>Fomento à liderança feminina na música (Meta: 30% mulheres).</li>
                    <li>Formação de novas plateias através de concertos didáticos.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* =====================================================================================
            3. EXPERIÊNCIA E HISTÓRICO
        ===================================================================================== */}
        <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto print:py-8 flex flex-col justify-center">
          <div className="mb-8 print:mb-4 flex items-center gap-2 text-primary print:text-white">
            <span className="text-4xl font-bold opacity-30">03</span>
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>Histórico de Sucesso</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-4 print:mb-2 print:gap-2">
            {pastEvents.map((event) => (
              <div key={event.title} className="border border-primary/20 p-6 print:p-3 rounded-xl bg-card break-inside-avoid print:border-gray-500 print:bg-[#1a202c]">
                <div className={`font-bold text-sm mb-2 print:text-xs ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>{event.year}</div>
                <h4 className="font-headline text-xl print:text-sm font-bold mb-2 print:text-white">{event.title}</h4>
                <p className="text-sm print:text-xs text-muted-foreground mb-4 print:text-gray-300">{event.description}</p>
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>
                  <MapPin size={14} /> {event.location}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-y border-primary/20 py-8 print:py-2 print:border-gray-500">
            <div>
              <span className={`block text-4xl print:text-2xl font-bold ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>+1000</span>
              <span className="text-xs print:text-[10px] uppercase tracking-widest print:text-gray-300">Espectadores</span>
            </div>
            <div>
              <span className={`block text-4xl print:text-2xl font-bold ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>4</span>
              <span className="text-xs print:text-[10px] uppercase tracking-widest print:text-gray-300">Grandes Palcos</span>
            </div>
            <div>
              <span className={`block text-4xl print:text-2xl font-bold ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>100%</span>
              <span className="text-xs print:text-[10px] uppercase tracking-widest print:text-gray-300">Aprovação Crítica</span>
            </div>
            <div>
              <span className={`block text-4xl print:text-2xl font-bold ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>10%</span>
              <span className="text-xs print:text-[10px] uppercase tracking-widest print:text-gray-300">Mulheres (Meta: 30%)</span>
            </div>
          </div>
        </section>

        {/* =====================================================================================
            4. EQUIPE TÉCNICA E ARTÍSTICA
        ===================================================================================== */}
        <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto print:py-8 flex flex-col justify-center">
          <div className="mb-8 print:mb-4 flex items-center gap-2 text-primary print:text-white">
            <span className="text-4xl font-bold opacity-30">04</span>
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>Liderança e Corpo Musical</h3>
          </div>

          <div className="space-y-6 print:space-y-3 mb-10 print:mb-6">
            {lideranca.map((lider) => (
              <div key={lider.id} className="flex flex-col md:flex-row gap-6 print:gap-4 p-6 print:p-3 border border-primary/20 rounded-xl bg-card break-inside-avoid print:border-gray-500 print:bg-[#1a202c]">
                <div className={`shrink-0 flex items-center justify-center w-20 h-20 print:w-16 print:h-16 rounded-full print:bg-white/10 ${type !== 'geral' ? 'bg-primary/10 text-primary print:text-[#fbbf24]' : 'bg-primary/10 text-primary'}`}>
                   {lider.id.includes('geyzi') ? <Star size={32} /> : <Mic2 size={32} />}
                </div>
                <div>
                  <h4 className="font-headline text-2xl print:text-lg font-bold text-foreground print:text-white">{lider.nome}</h4>
                  <p className={`text-sm font-bold uppercase mb-2 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>{lider.cargo}</p>
                  <p className="text-sm print:text-xs text-justify leading-relaxed text-muted-foreground print:text-gray-300">{lider.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 print:p-4 bg-card rounded-xl border border-primary/20 break-inside-avoid print:border-gray-500 print:bg-[#1a202c]">
              <h4 className="font-bold text-lg mb-4 print:mb-2 print:text-white flex items-center gap-2">
                <Users className={type !== 'geral' ? "text-primary print:text-[#fbbf24]" : "text-primary"} /> Estrutura do Corpo Musical
              </h4>
              <p className="text-sm print:text-xs text-muted-foreground mb-4 print:mb-2 print:text-gray-300">
                  Nossa banda é composta majoritariamente por <strong>Mestres e Doutores</strong> em música, com passagens por orquestras internacionais (Inglaterra, Europa) e grandes instituições brasileiras (UFRJ, UNIRIO).
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 print:grid-cols-5 print:gap-x-3 print:gap-y-2 text-sm mt-6 print:mt-3 print:text-[9px]">
                  <div>
                      <h5 className={`font-headline text-base print:text-xs font-bold border-b border-primary/20 pb-1 mb-2 print:pb-0 print:mb-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>Madeiras</h5>
                      <ul className="space-y-1 text-muted-foreground print:text-gray-300">
                          {musicos.madeiras.slice(0, 5).map(m => <li key={m.nome}>{m.nome}</li>)}
                          <li>...</li>
                      </ul>
                  </div>
                  <div>
                      <h5 className={`font-headline text-base print:text-xs font-bold border-b border-primary/20 pb-1 mb-2 print:pb-0 print:mb-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>Metais</h5>
                      <ul className="space-y-1 text-muted-foreground print:text-gray-300">
                          {musicos.metais.slice(0, 5).map(m => <li key={m.nome}>{m.nome}</li>)}
                          <li>...</li>
                      </ul>
                  </div>
                  <div>
                      <h5 className={`font-headline text-base print:text-xs font-bold border-b border-primary/20 pb-1 mb-2 print:pb-0 print:mb-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>Percussão</h5>
                      <ul className="space-y-1 text-muted-foreground print:text-gray-300">
                          {musicos.percussao.slice(0, 5).map(m => <li key={m.nome}>{m.nome}</li>)}
                      </ul>
                  </div>
                  <div>
                      <h5 className={`font-headline text-base print:text-xs font-bold border-b border-primary/20 pb-1 mb-2 print:pb-0 print:mb-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>Cordas</h5>
                      <ul className="space-y-1 text-muted-foreground print:text-gray-300">
                          {musicos.cordas.slice(0, 5).map(m => <li key={m.nome}>{m.nome}</li>)}
                      </ul>
                  </div>
                  <div className="print:block">
                      <h5 className={`font-headline text-base print:text-xs font-bold border-b border-primary/20 pb-1 mb-2 print:pb-0 print:mb-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>Equipe</h5>
                      <ul className="space-y-1 text-muted-foreground print:text-gray-300">
                          {musicos.equipe.slice(0, 5).map(m => <li key={m.nome}>{m.nome}</li>)}
                      </ul>
                  </div>
              </div>
          </div>
        </section>

        {/* =====================================================================================
            5. PROJETOS EM ANDAMENTO & IMPACTO / CLIPPING
        ===================================================================================== */}
        <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto print:py-8 flex flex-col justify-center">
          <div className="mb-8 print:mb-4 flex items-center gap-2 text-primary print:text-white">
            <span className="text-4xl font-bold opacity-30">05</span>
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>Temporada 2026 & Impacto</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 print:gap-4 mb-10 print:mb-6">
            <div className="space-y-6 print:space-y-4">
              <div className="flex gap-4 items-start break-inside-avoid">
                <Film className={`shrink-0 mt-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`} />
                <div>
                  <strong className="block text-lg print:text-sm print:text-white">Trilhas de Cinema</strong>
                  <p className="text-sm print:text-xs text-muted-foreground print:text-gray-300">Série focada em grandes temas de filmes, estratégia para atrair o público jovem e lotar grandes teatros.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start break-inside-avoid">
                <Users className={`shrink-0 mt-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`} />
                <div>
                  <strong className="block text-lg print:text-sm print:text-white">Fomento à Liderança Feminina</strong>
                  <p className="text-sm print:text-xs text-muted-foreground print:text-gray-300">Presença de mulheres na regência e repertório destacando compositoras brasileiras e internacionais.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start break-inside-avoid">
                <Heart className={`shrink-0 mt-1 ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`} />
                <div>
                  <strong className="block text-lg print:text-sm print:text-white">Ação Social: Dignidade Feminina</strong>
                  <p className="text-sm print:text-xs text-muted-foreground print:text-gray-300">
                    Realização de concertos com ingresso solidário (itens de higiene) destinado a <strong>mulheres em situação de vulnerabilidade</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-xl p-8 print:p-4 shadow-lg break-inside-avoid print:border-gray-500 print:bg-[#1a202c]">
               <h4 className="font-headline text-2xl print:text-xl font-bold mb-6 print:mb-3 print:text-white">O Que Dizem os Críticos</h4>
               {testimonials.slice(0, 1).map((t) => (
                  <div key={t.id} className="italic text-muted-foreground print:text-gray-300">
                    <p className="mb-4 text-justify print:mb-2 text-sm">"{t.quote}"</p>
                    <strong className="block text-foreground not-italic print:text-white">{t.name}</strong>
                    <span className={`text-xs uppercase tracking-wider font-bold ${type !== 'geral' ? 'text-primary print:text-[#fbbf24]' : 'text-primary'}`}>{t.title}</span>
                  </div>
               ))}
               <Separator className="my-6 print:my-2 bg-primary/20" />
               <div className="text-center">
                  <p className="text-sm font-bold uppercase mb-4 print:mb-2 print:text-white">Palcos e Parceiros de Mídia</p>
                  <div className="flex flex-wrap justify-center gap-4 opacity-70 print:opacity-100 print:text-gray-300 font-bold text-xs">
                     <span>AGÊNCIA BRASIL</span> • <span>JORNAL DO BRASIL</span> • <span>SESC RIO</span> • <span>CCBB</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* =====================================================================================
            6. COTAS DE PATROCÍNIO / LEI ROUANET (CONDICIONAL)
        ===================================================================================== */}
        {(type === 'rouanet' || type === 'investidor') && (
          <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto print:py-10 flex flex-col justify-center">
            <div className="mb-8 print:mb-4 flex items-center gap-2 text-primary print:text-white">
              <span className="text-4xl font-bold opacity-30">06</span>
              <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: '#fbbf24', printColorAdjust: 'exact' }}>
                {type === 'rouanet' ? 'Plano de Execução (Lei Rouanet)' : 'Oportunidade de Patrocínio'}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 print:gap-4 mb-8 print:mb-4">
              <div className="space-y-6">
                <h4 className="font-headline text-2xl print:text-lg font-bold flex items-center gap-2 print:text-white">
                  <Landmark className="text-primary print:text-[#fbbf24]" /> 
                  {type === 'rouanet' ? 'Dados do Projeto' : 'Associe sua Marca'}
                </h4>
                {type === 'rouanet' ? (
                  <ul className="space-y-4 print:space-y-1 text-base print:text-sm print:text-gray-300">
                    <li><strong>PRONAC:</strong> 2512974</li>
                    <li><strong>Área:</strong> Música (Art. 18 - 100% Incentivo)</li>
                    <li><strong>Prazo de Captação:</strong> Até 01/12/2026</li>
                    <li><strong>Local de Execução:</strong> Rio de Janeiro, RJ</li>
                  </ul>
                ) : (
                  <p className="text-muted-foreground print:text-gray-300 text-justify text-sm">
                    Apoiar a Banda Sinfônica Nacional significa associar a sua marca à <strong>alta cultura, educação, inclusão social e excelência</strong>. Oferecemos contrapartidas robustas de visibilidade em todos os nossos materiais de comunicação, ingressos VIPs, e a possibilidade de ativação de marca (branding) em nossos concertos e redes sociais, que impactam milhares de pessoas mensalmente.
                  </p>
                )}
              </div>
              <div className="space-y-6">
                 <h4 className="font-headline text-2xl print:text-lg font-bold flex items-center gap-2 print:text-white">
                    <FileText className="text-primary print:text-[#fbbf24]" /> 
                    {type === 'rouanet' ? 'Destinação dos Recursos' : 'Impacto do seu Investimento'}
                  </h4>
                  <ul className="list-disc list-inside space-y-2 print:space-y-1 text-sm print:text-xs text-muted-foreground print:text-gray-300">
                    {type === 'rouanet' ? (
                      <>
                        <li>Pagamento de cachês para músicos e equipe técnica.</li>
                        <li>Locação de pautas em teatros de grande porte.</li>
                        <li>Logística e transporte de instrumentos pesados.</li>
                        <li>Ações de acessibilidade em libras e audiodescrição.</li>
                      </>
                    ) : (
                      <>
                        <li>Viabilização de cachês para músicos de elite.</li>
                        <li>Acesso a teatros renomados para a formação de plateia.</li>
                        <li>Manutenção de ações sociais de ingressos solidários.</li>
                        <li>Fomento direto à música instrumental brasileira e fortalecimento ESG.</li>
                      </>
                    )}
                  </ul>
              </div>
            </div>

            {/* Box Destaque */}
            <div className="bg-card p-10 rounded-3xl border-2 border-primary/20 text-center break-inside-avoid print:bg-[#1a202c] print:border-gray-500">
                <Landmark size={64} className="mx-auto text-primary mb-6 print:text-[#fbbf24]" />
                <h3 className="font-headline text-3xl font-bold mb-4 text-primary print:text-[#fbbf24]">
                  {type === 'rouanet' ? 'Incentivo Fiscal: 100%' : 'Marketing com Propósito'}
                </h3>
                <p className="text-lg mb-6 leading-relaxed text-muted-foreground print:text-gray-300">
                  {type === 'rouanet' 
                    ? <>Este projeto está aprovado no <strong>Artigo 18</strong> da Lei Rouanet. Sua empresa pode deduzir <strong>100% do valor investido</strong> do Imposto de Renda devido (até 4% para Lucro Real).</>
                    : <>Invista em Cultura e potencialize seu <strong>balanço ESG</strong>. Transformamos investimento em impacto real e visibilidade, conectando sua marca a um público engajado e diversificado.</>
                  }
                </p>
                {type === 'rouanet' && (
                  <div className="bg-background/50 p-6 rounded-xl border border-primary/30 inline-block w-full print:bg-black/20 print:border-gray-600">
                    <span className="block text-xs uppercase tracking-widest mb-2 font-bold text-muted-foreground print:text-gray-400">Status de Aprovação</span>
                    <div className="font-mono text-sm md:text-base break-words text-foreground print:text-white font-bold">
                       PRONAC 2512974 • Aprovado e pronto para captação
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* =====================================================================================
            7. GALERIA / COMPROVAÇÕES
        ===================================================================================== */}
        <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto print:py-6 flex flex-col justify-center">
          <div className="mb-8 print:mb-4 flex items-center gap-2 text-primary print:text-white">
            <span className="text-4xl font-bold opacity-30">{type === 'geral' ? '06' : '07'}</span>
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>Galeria e Registros</h3>
          </div>
          <p className="mb-8 print:mb-4 text-muted-foreground print:text-gray-300">Registro visual das atividades realizadas, apresentações e impacto de público.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 print:grid-cols-5 gap-4 print:gap-1 mb-12 print:mb-4">
            {proofImages.map((img) => (
              <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border border-primary/20 break-inside-avoid print:border-gray-500">
                 <Image src={img.imageUrl} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>

          <h4 className={`font-bold text-xl mb-6 print:mb-3 print:text-white flex items-center gap-2`}>
            <Film className={type !== 'geral' ? "text-primary print:text-[#fbbf24]" : "text-primary"}/> Registros Videográficos
          </h4>
          <div className="grid md:grid-cols-2 print:grid-cols-3 gap-6 print:gap-2">
            {VideoAssets.map((video) => {
               const thumbnail = ImageAssets.find(img => img.id === video.thumbnailId);
               const url = video.source === 'youtube' ? `https://youtube.com/watch?v=${video.embedId}` : '#';
               
               return (
                 <Link key={video.id} href={url} target="_blank" rel="noopener noreferrer" className="block group break-inside-avoid">
                   <div className="flex gap-4 border border-primary/20 p-4 print:p-2 rounded-xl bg-card hover:border-primary transition print:border-gray-500 print:bg-[#1a202c]">
                      <div className="relative w-32 print:w-24 h-auto print:aspect-video shrink-0 bg-black rounded overflow-hidden border border-primary/30">
                         {thumbnail && <Image src={thumbnail.imageUrl} alt="" fill className="object-cover opacity-80" />}
                         <PlayCircle className="absolute inset-0 m-auto text-white w-8 h-8" />
                      </div>
                      <div className="flex flex-col justify-center">
                         <strong className="text-sm print:text-xs font-bold group-hover:text-primary print:text-white">{video.description}</strong>
                         <span className="text-xs print:text-[10px] text-muted-foreground flex items-center gap-1 mt-1 print:text-gray-400">
                           Assistir <ExternalLink size={10} />
                         </span>
                      </div>
                   </div>
                 </Link>
               )
            })}
          </div>
        </section>

        {/* =====================================================================================
            8. CONTATOS
        ===================================================================================== */}
        <section className="portfolio-section py-16 px-6 md:px-20 max-w-7xl mx-auto bg-primary/5 mt-8 border-t border-primary/20 print:bg-[#1a202c] print:border-gray-500 flex flex-col justify-center">
          <div className="mb-8 print:mb-4 flex items-center gap-2 text-primary print:text-white">
            <span className="text-4xl font-bold opacity-30">{type === 'geral' ? '07' : '08'}</span>
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: type !== 'geral' ? '#fbbf24' : undefined, printColorAdjust: 'exact' }}>Contatos</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 print:gap-6 text-lg print:text-base">
             <div className="break-inside-avoid">
               <p className="uppercase text-xs font-bold tracking-widest text-muted-foreground mb-1 print:text-gray-400">Direção Geral</p>
               <p className="font-bold mb-6 print:text-white">Geyzilane de Andrade Moreira</p>

               <p className="uppercase text-xs font-bold tracking-widest text-muted-foreground mb-1 print:text-gray-400">Email</p>
               <p className="font-bold mb-6 print:text-white">bandasinfonicanacional@gmail.com</p>
             </div>

             <div className="break-inside-avoid">
               <p className="uppercase text-xs font-bold tracking-widest text-muted-foreground mb-1 print:text-gray-400">Redes Sociais</p>
               <p className="font-bold mb-6 print:text-white">@bandasinfonicanacionalbr</p>
             </div>
          </div>

          <div className="mt-12 print:mt-6 pt-8 print:pt-4 border-t border-primary/20 text-center text-sm text-muted-foreground print:text-gray-500 print:border-gray-700">
            {type === 'rouanet' && (
              <p className="mb-4 font-bold text-white">Este portfólio foi elaborado em conformidade com a IN Nº 29 e a Portaria SEFIC/MINC Nº 819/2025.</p>
            )}
            
            <div className="mb-6 print:mb-3">
              <Link href="https://bandasinfonicanacional.com.br" target="_blank" className="font-semibold text-sm hover:text-primary transition-colors">
                www.bandasinfonicanacional.com.br
              </Link>
            </div>

            <p className="text-xs text-muted-foreground/70 print:text-gray-500">
              Desenvolvido por{' '}
              <Link href="https://www.linkedin.com/in/anniecrlarcher/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                Annie Larcher
              </Link>
            </p>
          </div>
        </section>

      </div>
      )}
    </>
  );
}
