'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Printer, Settings, Music, ShieldCheck, HeartHandshake, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import html2canvas from 'html2canvas';

export default function PortfolioGeyzi() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfHeight, setPdfHeight] = useState<number | null>(null);
  const [pdfMode, setPdfMode] = useState<'a4' | 'continuous'>('continuous');

  const handlePrintA4 = () => {
    setPdfMode('a4');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleDownloadContinuousPDF = async () => {
    const container = document.getElementById('portfolio-geyzi-container');
    if (!container) return;

    try {
      setIsGeneratingPdf(true);
      await document.fonts.ready;

      // Ensure all images are fully loaded
      const imgElements = Array.from(container.querySelectorAll('img'));
      await Promise.all(
        imgElements.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Allow DOM to settle
      await new Promise((resolve) => setTimeout(resolve, 400));

      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a',
        windowWidth: 1280,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210; // A4 mm
      const pageHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidth, pageHeight]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight);
      pdf.save('Portfolio_Geyzilane_Moreira.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF contínuo:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const images = {
    hero: '/Images/portfolio-geyzi/graduacao-3.jpeg',
    avatar: '/Images/geyzi-moreira.jpg',
    trio: '/Images/portfolio-geyzi/trio-som-de-madeira.jpeg',
    banda: 'https://i.ibb.co/r2WDTv36/Whats-App-Image-2026-01-31-at-17-53-14.jpg',
  };

  const galleryImages = [
    '/Images/portfolio-geyzi/CFN-1.jpeg',
    '/Images/portfolio-geyzi/CFN-2.jpeg',
    '/Images/portfolio-geyzi/cecilia-meirelles-1.jpeg',
    '/Images/portfolio-geyzi/cecilia-meirelles-2.jpeg',
    '/Images/portfolio-geyzi/graduacao.jpeg',
    '/Images/portfolio-geyzi/graduacao-2.jpeg',
    '/Images/portfolio-geyzi/graduacao-3.jpeg',
    '/Images/portfolio-geyzi/trio-som-de-madeira Clube-Naval-Piraque-15.07.2021.jpeg',
    '/Images/portfolio-geyzi/trio-som-de-madeira-2.jpeg',
    '/Images/portfolio-geyzi/trio-som-de-madeira-3.jpg',
    '/Images/portfolio-geyzi/WhatsApp Image 2026-07-11 at 09.10.29.jpeg',
    '/Images/portfolio-geyzi/WhatsApp Image 2026-07-11 at 09.10.29 (2).jpeg',
    '/Images/portfolio-geyzi/WhatsApp Image 2026-07-11 at 09.10.30 (3).jpeg',
    '/Images/portfolio-geyzi/WhatsApp Image 2026-07-11 at 09.10.30 (4).jpeg'
  ];

  const eventosTimeline = [
    {
      title: 'Apresentação - Trio Som de Madeira',
      location: 'Centro da Música Carioca Artur da Távola',
      date: '23 de Abril de 2019',
      description: 'Apresentação do projeto dedicado ao estudo, à pesquisa e à difusão do choro carioca.',
      image: '/Images/portfolio-geyzi/trio-som-de-madeira-2.jpeg'
    },
    {
      title: 'Apresentação Musical - Trio Som de Madeira',
      location: 'Clube Naval Piraquê',
      date: '15 de Julho de 2021',
      description: 'Performance de excelência focada na divulgação da música popular brasileira e instrumental.',
      image: '/Images/portfolio-geyzi/trio-som-de-madeira Clube-Naval-Piraque-15.07.2021.jpeg'
    },
    {
      title: 'Trio Som de Madeira c/ Sheila Zagury',
      location: 'Academia de Música Lorenzo Fernandez',
      date: '14 de Julho de 2021',
      description: 'Apresentação promovendo encontro e intercâmbio musical, contribuindo para a preservação da tradição do choro.',
      image: '/Images/portfolio-geyzi/trio-som-de-madeira-3.jpg'
    },
    {
      title: 'Apresentação Oficial - Banda Sinfônica Nacional',
      location: 'Teatro Carlos Gomes',
      date: '16 de Agosto de 2025',
      description: 'Concerto oficial com a Banda Sinfônica Nacional em um dos mais históricos e importantes teatros do Rio de Janeiro.',
      image: '/Images/portfolio-geyzi/bsn-16.8.25.png'
    },
    {
      title: 'Banda Sinfônica Nacional - Música no Museu',
      location: 'Museu Sesc Flamengo',
      date: '20 de Janeiro de 2026',
      description: 'Apresentação de concerto destacando repertório diversificado, levando a música instrumental a novos públicos.',
      image: '/Images/portfolio-geyzi/musica-no-museu.png'
    },
    {
      title: 'Concerto "Clássicos Mundiais" — Salão Assyrio',
      location: 'Theatro Municipal do Rio de Janeiro',
      date: '28 de Setembro de 2026',
      description: 'Concerto especial da Banda Sinfônica Nacional no prestigiado Salão Assyrio do Theatro Municipal do Rio de Janeiro com solistas convidados.',
      image: '/Images/bsn-hero.jpg'
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: ${pdfMode === 'continuous' ? `297mm ${pdfHeight ? pdfHeight + 'px' : '4000px'}` : 'A4 portrait'}; 
            margin: 0 !important; 
          }
          html, body {
            background-color: #0a0a0a !important;
            color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
          }
          /* Esconder controles de impressão */
          .print-hide { 
            display: none !important; 
          }
          /* Evitar que seções e cards fiquem cortados ao meio no modo A4 */
          ${pdfMode === 'a4' ? `
          section.portfolio-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            padding: 3rem 2rem !important;
            margin: 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          ` : `
          section.portfolio-section {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          `}
          /* Garantir que os grids mantenham 2 colunas na impressão */
          .grid {
            display: grid !important;
          }
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .columns-1.md\\:columns-2 {
            column-count: 2 !important;
          }
        }
      `}} />

      {/* Control Panel (Hidden on Print) */}
      <div className="print-hide fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-50 border-b border-border shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Settings className="w-5 h-5" />
          <span>Gerador de Portfólio (Geyzilane Moreira)</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleDownloadContinuousPDF} disabled={isGeneratingPdf} className="gap-2 font-bold bg-amber-500 text-black hover:bg-amber-400">
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {isGeneratingPdf ? 'Gerando PDF...' : 'Baixar PDF (Digital 1 Página)'}
          </Button>
          <Button onClick={handlePrintA4} variant="outline" className="gap-2 font-bold border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
            <Printer className="w-4 h-4" />
            Imprimir / PDF (A4 Paginado)
          </Button>
        </div>
      </div>

      {/* Padding to push content below fixed header */}
      <div className="h-20 print-hide bg-[#0a0a0a]"></div>

      <div id="portfolio-geyzi-container" className="bg-[#0a0a0a] text-zinc-100 font-sans min-h-screen">
        
        {/* 1. CAPA */}
        <section className="portfolio-section relative w-full flex flex-col items-center justify-center p-12 md:p-20 overflow-hidden bg-gradient-to-b from-[#121212] to-[#0a0a0a] text-center border-b border-white/10 min-h-[50vh]">
          <div className="relative z-20 flex flex-col items-center justify-center gap-8 w-full max-w-5xl mt-6 print:mt-4">
            <div className="space-y-6">
               <h1 className="text-5xl md:text-7xl print:text-5xl font-black tracking-tighter text-white uppercase leading-tight">
                  Geyzilane de Andrade<br/>Moreira
               </h1>
               <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full mt-8 mb-4 opacity-60"></div>
               <p className="text-xl md:text-2xl print:text-lg font-light text-zinc-400 tracking-[0.2em] uppercase">
                  Trajetória Profissional e Gestão Cultural
               </p>
            </div>
          </div>
        </section>

        {/* 2. APRESENTAÇÃO */}
        <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center gap-16 print:gap-8 border-b border-white/10">
           <div className="grid md:grid-cols-12 gap-16 print:gap-8 items-center">
              
              <div className="md:col-span-4 flex justify-center">
                 <div className="relative w-64 h-64 md:w-80 md:h-80 print:w-56 print:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-amber-500/30">
                     <img src={images.avatar} alt="Geyzilane de Andrade Moreira" className="object-cover w-full h-full transition-all duration-500" />
                 </div>
              </div>

              <div className="md:col-span-8 space-y-6">
                 <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight inline-flex items-center gap-3">
                   <span className="inline-block w-2 h-[0.9em] bg-amber-500 rounded-full shrink-0"></span>
                   <span>Liderança e Visão</span>
                 </h2>
                 <p className="text-xl print:text-lg text-zinc-300 leading-relaxed text-justify font-light">
                   Ao longo de sua trajetória dedicada à arte e à cultura, Geyzi destacou-se como uma importante incentivadora da música instrumental em sua região. Com visão, comprometimento e paixão pela educação musical, fundou a Banda Sinfônica Nacional, um projeto que tem contribuído significativamente para a formação artística de jovens e adultos.
                 </p>
                 <p className="text-xl print:text-lg text-zinc-300 leading-relaxed text-justify font-light">
                   Sua atuação demonstra o poder da cultura como instrumento de educação, transformação social e valorização da identidade cultural, deixando um legado que inspira novas gerações e fortalece o patrimônio artístico da região.
                 </p>
              </div>
           </div>
        </section>

        {/* 3. PROJETOS IDEALIZADOS */}
        <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center border-b border-white/10">
           <div className="mb-12 print:mb-8 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight mb-4">
                 Projetos Idealizados
              </h2>
              <p className="text-lg text-zinc-400 font-light">
                 Iniciativas criadas e geridas para fomentar a música de excelência e a democratização cultural.
              </p>
           </div>

           <div className="grid md:grid-cols-2 gap-12 print:gap-8">
              {/* BSN */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden break-inside-avoid shadow-2xl">
                 <div className="h-64 print:h-48 relative border-b border-white/10 bg-black/40">
                     <img src={images.banda} alt="Banda Sinfônica do Brasil" className="w-full h-full object-contain opacity-90" />
                 </div>
                 <div className="p-8 print:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                       <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Banda Sinfônica do Brasil</h3>
                       <span className="bg-amber-500 text-black text-[11px] font-black px-3.5 h-7 leading-7 rounded-full tracking-wider uppercase shadow-lg inline-block text-center shrink-0">Fundação: Abr/2024</span>
                    </div>
                    <p className="text-sm print:text-xs text-zinc-300 leading-relaxed text-justify font-light">
                       Desde sua criação, a banda vem desenvolvendo um trabalho de excelência, promovendo o acesso à cultura e valorizando a música como ferramenta de transformação social. Sob a liderança de sua fundadora, o grupo passou a participar ativamente de diversos editais públicos e privados de incentivo à cultura, conquistando recursos para a ampliação de suas atividades, a aquisição de instrumentos e a realização de ações educativas voltadas para a comunidade.
                       <br/><br/>
                       A Banda Sinfônica tem presença marcante em importantes eventos culturais, festivais e apresentações em teatros, levando ao público repertórios diversificados que incluem música erudita, popular brasileira, trilhas sonoras e obras contemporâneas. Suas apresentações têm sido reconhecidas pela qualidade artística, pelo profissionalismo e pelo compromisso com a democratização do acesso à cultura.
                    </p>
                 </div>
              </div>

              {/* Trio Som de Madeira */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden break-inside-avoid shadow-2xl">
                 <div className="h-64 print:h-48 relative border-b border-white/10 bg-black/40">
                     <img src={images.trio} alt="Trio Som de Madeira" className="w-full h-full object-contain opacity-90" />
                 </div>
                 <div className="p-8 print:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                       <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Trio Som de Madeira</h3>
                       <span className="bg-amber-500 text-black text-[11px] font-black px-3.5 h-7 leading-7 rounded-full tracking-wider uppercase shadow-lg inline-block text-center shrink-0">Fundação: Fev/2019</span>
                    </div>
                    <p className="text-sm print:text-xs text-zinc-300 leading-relaxed text-justify font-light">
                       Grupo idealizado para dedicar-se ao estudo, à pesquisa e à divulgação do choro e da música popular brasileira.
                       <br/><br/>
                       Para valorizar esse patrimônio cultural, idealizou também a série <strong>Choro na Academia Lorenzo Fernandez</strong>, projeto que promove encontros e recebe renomados instrumentistas para intercâmbios artísticos, contribuindo para a preservação da tradição do choro e o fortalecimento da cena musical brasileira.
                    </p>
                 </div>
              </div>

           </div>
        </section>

        {/* 4. IMPACTO SOCIAL */}
        <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center border-b border-white/10">
           <div className="mb-12 print:mb-8">
              <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight inline-flex items-center gap-3 mb-8">
                 <span className="inline-block w-2 h-[0.9em] bg-amber-500 rounded-full shrink-0"></span>
                 <span>Impacto e Ações Educativas</span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 print:gap-4 mt-8">
                  <div className="bg-white/5 p-8 print:p-6 rounded-2xl border border-white/10 text-center break-inside-avoid hover:border-amber-500/50 transition-colors">
                      <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-amber-500">
                          <Music className="w-12 h-12 opacity-80" />
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase mb-3">Oficinas e Intercâmbios</h4>
                      <p className="text-sm text-zinc-400 font-light leading-relaxed text-justify">
                         Além dos espetáculos musicais, o projeto promove oficinas, workshops e atividades formativas, fortalecendo o cenário cultural local e incentivando o surgimento de novos talentos.
                      </p>
                  </div>
                  <div className="bg-white/5 p-8 print:p-6 rounded-2xl border border-white/10 text-center break-inside-avoid hover:border-amber-500/50 transition-colors">
                      <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-amber-500">
                          <HeartHandshake className="w-12 h-12 opacity-80" />
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase mb-3">Cidadania e Inclusão</h4>
                      <p className="text-sm text-zinc-400 font-light leading-relaxed text-justify">
                         O trabalho tem gerado impacto social relevante, contribuindo para a inclusão, o desenvolvimento da disciplina, da cidadania e do senso de pertencimento entre os participantes.
                      </p>
                  </div>
                  <div className="bg-white/5 p-8 print:p-6 rounded-2xl border border-white/10 text-center break-inside-avoid hover:border-amber-500/50 transition-colors">
                      <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-amber-500">
                          <ShieldCheck className="w-12 h-12 opacity-80" />
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase mb-3">Herança Afro-brasileira</h4>
                      <p className="text-sm text-zinc-400 font-light leading-relaxed text-justify">
                         A banda contribui para a preservação desse patrimônio cultural por meio da execução de músicas de matriz afrodescendente, promovendo o respeito à diversidade e o fortalecimento da memória histórica.
                      </p>
                  </div>
              </div>
           </div>
        </section>

        {/* 5. LINHA DO TEMPO COMPROBATÓRIA */}
        <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center border-b border-white/10">
           <div className="mb-16 print:mb-8 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight mb-4">
                 Linha do Tempo
              </h2>
              <p className="text-lg text-zinc-400 font-light">
                 Histórico de apresentações e eventos realizados, atestando a atuação profissional continuada.
              </p>
           </div>
           
           <div className="space-y-8 print:space-y-6 relative border-l-2 border-amber-500/30 pl-8 ml-4 md:ml-12">
               {eventosTimeline.map((event, i) => (
                  <div key={i} className="relative break-inside-avoid">
                     {/* Bolinha da timeline alinhada no centro do card */}
                     <div className="absolute -left-[41px] top-8 w-5 h-5 rounded-full border-4 border-[#0a0a0a] bg-amber-500 z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                     
                     {/* Card Comprobatório */}
                     <div className="bg-white/5 border border-white/10 p-6 print:p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 items-center hover:border-amber-500/50 transition-colors">
                        
                        <div className="w-full md:w-1/3 h-48 md:h-full min-h-[180px] rounded-xl overflow-hidden shadow-md border border-white/10 shrink-0 bg-black/40 flex items-center justify-center">
                           <img src={event.image} alt={event.title} className="w-full h-full object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500" />
                        </div>
                        
                        <div className="w-full md:w-2/3 space-y-4">
                           <div className="inline-block bg-amber-500/10 text-amber-500 font-extrabold text-xs tracking-widest uppercase px-4 h-8 leading-8 rounded-full text-center shrink-0">{event.date}</div>
                           <h4 className="text-2xl print:text-xl font-bold text-white leading-tight">{event.title}</h4>
                           
                           <div className="flex items-center gap-2 text-sm text-zinc-300 font-light pl-2 border-l-2 border-amber-500/60">
                              <MapPin size={15} className="text-amber-500 shrink-0" />
                              <span>{event.location}</span>
                           </div>
                           
                           <p className="text-sm text-zinc-400 leading-relaxed font-light">{event.description}</p>
                        </div>

                     </div>
                  </div>
               ))}
           </div>
        </section>

        {/* 5B. GALERIA DE FOTOS */}
        <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center border-b border-white/10">
           <div className="mb-12 print:mb-8 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight mb-4">
                 Galeria de Registros
              </h2>
              <p className="text-lg text-zinc-400 font-light">
                 Momentos, apresentações e trajetória musical.
              </p>
           </div>
           
           <div className="columns-1 md:columns-2 print:columns-2 gap-8 print:gap-6 space-y-8 print:space-y-6">
               {galleryImages.map((src, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 break-inside-avoid shadow-lg hover:border-amber-500/50 transition-all inline-block w-full bg-black/40">
                     <img src={src} alt="Registro" className="w-full h-auto hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
               ))}
           </div>
        </section>

        {/* 6. CONTATOS */}
        <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
           <div className="text-center bg-white/5 border border-white/10 p-12 print:p-8 rounded-3xl break-inside-avoid shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              
              <h2 className="text-3xl print:text-2xl font-black text-white uppercase tracking-widest mb-4">Contato Profissional</h2>
              <p className="text-lg print:text-base text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                 Acompanhe meu trabalho, apoie nossos projetos culturais e junte-se à nossa missão de transformar a sociedade por meio da música e educação.
              </p>
              
              <div className="flex flex-col items-center gap-1 mb-10">
                 <p className="text-2xl print:text-xl text-white font-black uppercase">Geyzilane de Andrade Moreira</p>
                 <p className="text-amber-500 font-bold tracking-widest uppercase text-sm">Diretora e Produtora Cultural</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4 max-w-3xl mx-auto">
                 <Link href="mailto:bandasinfonicanacional@gmail.com" className="inline-flex items-center justify-center gap-3 px-6 h-14 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-amber-500 text-zinc-300 print:bg-transparent print:border-amber-500/30 print:text-amber-500">
                    <span className="flex items-center justify-center shrink-0"><Mail size={18} /></span>
                    <span className="font-bold text-center text-sm tracking-wide inline-block leading-none">bandasinfonicanacional@gmail.com</span>
                 </Link>
                 
                 <div className="inline-flex items-center justify-center gap-3 px-6 h-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 print:bg-transparent print:border-white/20 print:text-zinc-300">
                    <span className="flex items-center justify-center shrink-0"><MapPin size={18} /></span>
                    <span className="font-bold text-center text-sm tracking-wide inline-block leading-none">Rio de Janeiro, RJ - Brasil</span>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </>
  );
}
