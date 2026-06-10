import Image from 'next/image';
import Link from 'next/link';
import { Star, PlayCircle, ExternalLink, MapPin, Quote, Handshake, Instagram, Youtube, Mail, Globe } from 'lucide-react';
import { lideranca, testimonials, musicos, parceiros } from '@/lib/institutional-data';
import { ImageAssets, VideoAssets } from '@/lib/placeholder-images';
import eventosData from '@/lib/eventos.json';

export default function NovoPortfolio() {
  const heroImage = ImageAssets.find((img) => img.id === 'institutional-hero');
  const logoImage = ImageAssets.find((img) => img.id === 'bsn-logo');

  const pastEvents = eventosData.events.slice(0, 6).map(e => {
    const dateParts = e.date.split(' de ');
    const shortDate = dateParts.length === 3 
      ? `${dateParts[1].substring(0, 3).toUpperCase()} ${dateParts[2]}`
      : e.date;
    return { year: shortDate, title: e.title, description: e.description, location: e.location };
  });

  return (
    <div className="bg-[#0a0a0a] text-zinc-100 font-sans min-h-screen">
      
      {/* 1. CAPA */}
      <section className="portfolio-section relative w-full flex flex-col items-center justify-center p-8 overflow-hidden bg-black text-center border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-40">
          {heroImage && <Image src={heroImage.imageUrl} alt="" fill className="object-cover grayscale mix-blend-overlay" priority />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
        
        <div className="relative z-20 flex flex-col items-center justify-center gap-12 w-full max-w-4xl mt-20 print:mt-10">
          {logoImage && (
             <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
               <Image src={logoImage.imageUrl} alt="Logo" width={600} height={300} className="w-80 md:w-[500px] h-auto print:w-96" />
             </div>
          )}
          
          <div className="space-y-4">
             <h1 className="text-6xl md:text-8xl print:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 uppercase">
                Apresentação
             </h1>
             <p className="text-2xl md:text-3xl print:text-xl font-light text-zinc-400 tracking-[0.3em] uppercase">
                Banda Sinfônica Nacional
             </p>
          </div>
        </div>
      </section>

      {/* 2. A BANDA E DEPOIMENTOS */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center gap-16 print:gap-8">
         <div className="grid md:grid-cols-2 gap-16 print:gap-8 items-center">
            <div className="space-y-6">
               <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight border-l-4 border-amber-500 pl-6">
                 Nossa Essência
               </h2>
               <p className="text-xl print:text-lg text-zinc-300 leading-relaxed text-justify font-light">
                 A Banda Sinfônica Nacional (BSN) é um organismo vivo, que respira e pulsa ao ritmo da diversidade cultural do nosso país. Composta por mestres e doutores de alta qualificação, nosso propósito é explorar novos horizontes, dar voz a novos compositores e levar a excelência da música sinfônica a todos os palcos.
               </p>
            </div>
            
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {heroImage && (
                   <Image src={heroImage.imageUrl} alt="" fill className="object-cover" />
                )}
            </div>
         </div>

         <div className="space-y-8 print:space-y-4">
            <h3 className="text-2xl font-bold uppercase tracking-widest text-zinc-500 text-center">O Que Dizem Sobre Nós</h3>
            <div className="grid md:grid-cols-3 gap-8 print:gap-4">
               {testimonials.map(t => (
                  <div key={t.id} className="bg-white/5 border border-white/10 p-8 print:p-4 rounded-2xl break-inside-avoid">
                     <Quote className="text-amber-500 w-8 h-8 mb-4 print:w-6 print:h-6 print:mb-2 opacity-50" />
                     <p className="italic text-zinc-300 mb-6 print:mb-3 text-sm print:text-xs text-justify">"{t.quote}"</p>
                     <div className="flex items-center gap-4">
                        {ImageAssets.find(img => img.id === t.avatarId) && (
                           <Image src={ImageAssets.find(img => img.id === t.avatarId)!.imageUrl} alt={t.name} width={40} height={40} className="rounded-full print:w-8 print:h-8" />
                        )}
                        <div>
                           <strong className="block text-white text-sm print:text-xs">{t.name}</strong>
                           <span className="text-amber-500 text-xs uppercase tracking-wider">{t.title}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 3. LIDERANÇA E CORPO MUSICAL */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
         <div className="mb-12 print:mb-6">
            <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight border-l-4 border-amber-500 pl-6 mb-8">
               Liderança Artística
            </h2>
            <div className="grid md:grid-cols-2 gap-8 print:gap-4">
               {lideranca.map(lider => {
                  const img = ImageAssets.find(i => i.id === lider.id);
                  return (
                     <div key={lider.id} className="flex gap-6 print:gap-4 bg-white/5 border border-white/10 p-6 print:p-4 rounded-2xl break-inside-avoid">
                        {img && (
                           <div className="shrink-0 w-24 h-24 print:w-16 print:h-16 relative rounded-full overflow-hidden border-2 border-amber-500/50">
                              <Image src={img.imageUrl} alt={lider.nome} fill className="object-cover" priority />
                           </div>
                        )}
                        <div>
                           <h3 className="text-2xl print:text-lg font-bold text-white">{lider.nome}</h3>
                           <p className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-3 print:mb-1">{lider.cargo}</p>
                           <p className="text-sm print:text-xs text-zinc-400 text-justify leading-relaxed">{lider.bio}</p>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>
      </section>

      {/* 3B. CORPO MUSICAL */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
         <div>
            <h3 className="text-2xl print:text-xl font-bold text-white mb-8 print:mb-6 border-b border-white/10 pb-4">Corpo Musical</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-x-12 gap-y-8 text-base print:text-sm">
               
               {/* Coluna 1: Madeiras */}
               <div className="break-inside-avoid space-y-6">
                  <div>
                     <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-3 print:mb-2 border-b border-white/10 pb-2">Madeiras</h4>
                     <ul className="space-y-1.5 text-zinc-300 font-light">
                        {musicos.madeiras.map(m => <li key={m.nome}>{m.nome}</li>)}
                     </ul>
                  </div>
               </div>

               {/* Coluna 2: Metais + Cordas */}
               <div className="break-inside-avoid space-y-8">
                  <div>
                     <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-3 print:mb-2 border-b border-white/10 pb-2">Metais</h4>
                     <ul className="space-y-1.5 text-zinc-300 font-light">
                        {musicos.metais.map(m => <li key={m.nome}>{m.nome}</li>)}
                     </ul>
                  </div>
                  <div>
                     <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-3 print:mb-2 border-b border-white/10 pb-2">Cordas</h4>
                     <ul className="space-y-1.5 text-zinc-300 font-light">
                        {musicos.cordas.map(m => <li key={m.nome}>{m.nome}</li>)}
                     </ul>
                  </div>
               </div>

               {/* Coluna 3: Percussão + Equipe Técnica */}
               <div className="break-inside-avoid space-y-8">
                  <div>
                     <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-3 print:mb-2 border-b border-white/10 pb-2">Percussão</h4>
                     <ul className="space-y-1.5 text-zinc-300 font-light">
                        {musicos.percussao.map(m => <li key={m.nome}>{m.nome}</li>)}
                     </ul>
                  </div>
                  <div>
                     <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-3 print:mb-2 border-b border-white/10 pb-2">Equipe Técnica</h4>
                     <ul className="space-y-1.5 text-zinc-300 font-light">
                        {musicos.equipe.map(m => <li key={m.nome}>{m.nome}</li>)}
                     </ul>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 4. EVENTOS E PARCEIROS */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
         <div className="mb-16 print:mb-8">
            <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight border-l-4 border-amber-500 pl-6 mb-8 print:mb-4">
               Agenda & Projetos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6 print:gap-3">
               {pastEvents.map(event => (
                  <div key={event.title} className="bg-white/5 border border-white/10 p-6 print:p-4 rounded-xl break-inside-avoid">
                     <span className="text-amber-500 font-bold text-sm print:text-xs tracking-widest mb-2 block">{event.year}</span>
                     <h4 className="text-lg print:text-sm font-bold text-white mb-2 leading-tight">{event.title}</h4>
                     <p className="text-sm print:text-xs text-zinc-400 mb-4 print:mb-2 line-clamp-3">{event.description}</p>
                     <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase">
                        <MapPin size={12} /> {event.location}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4B. PARCEIROS */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
         <div>
            <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight border-l-4 border-amber-500 pl-6 mb-8 print:mb-4">
               Nossos Parceiros
            </h2>
            <div className="flex flex-wrap gap-6 print:gap-4 items-center justify-start">
               {parceiros.map(p => {
                  const img = ImageAssets.find(i => i.id === p.imageId);
                  return (
                     <div key={p.id} className="flex flex-col items-center gap-4 break-inside-avoid">
                        <div className="h-32 w-32 print:h-28 print:w-28 rounded-full bg-white border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl transition-all">
                           {img ? (
                              <Image src={img.imageUrl} alt={p.name} width={128} height={128} className="object-cover w-full h-full print:opacity-100 print:grayscale-0 opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all" priority />
                           ) : (
                              <Handshake className="h-12 w-12 text-zinc-400 print:text-zinc-400" />
                           )}
                        </div>
                        <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider text-center">{p.name}</span>
                     </div>
                  )
               })}
            </div>
         </div>
      </section>

      {/* 5. VÍDEOS E CONTATO */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
         <div className="mb-16 print:mb-8">
            <h2 className="text-4xl print:text-3xl font-black text-white uppercase tracking-tight border-l-4 border-amber-500 pl-6 mb-8 print:mb-4">
               Registros em Vídeo
            </h2>
            <div className="grid md:grid-cols-2 print:grid-cols-2 gap-8 print:gap-4">
               {VideoAssets.map(video => {
                  const thumbnail = ImageAssets.find(img => img.id === video.thumbnailId);
                  const url = video.source === 'youtube' ? `https://youtube.com/watch?v=${video.embedId}` : '#';
                  return (
                     <Link key={video.id} href={url} target="_blank" className="group break-inside-avoid">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-xl group-hover:border-amber-500 transition-all">
                           {thumbnail && <Image src={thumbnail.imageUrl} alt="" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 group-hover:bg-black/10 transition-colors">
                              <PlayCircle className="text-white/80 w-16 h-16 print:w-12 print:h-12 group-hover:scale-110 transition-transform" />
                              <div className="bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm text-center">
                                 <strong className="text-white text-sm print:text-xs block">{video.description}</strong>
                                 <span className="text-amber-500 text-xs flex items-center justify-center gap-1 mt-1 underline underline-offset-4 decoration-amber-500/50"><ExternalLink size={12}/> Assistir (Link)</span>
                              </div>
                           </div>
                        </div>
                     </Link>
                  )
               })}
            </div>
         </div>
      </section>

      {/* 6. CONTATOS */}
      <section className="portfolio-section py-20 px-8 md:px-24 max-w-7xl mx-auto flex flex-col justify-center">
         <div className="text-center bg-white/5 border border-white/10 p-12 print:p-8 rounded-3xl break-inside-avoid">
            <h2 className="text-3xl print:text-2xl font-black text-white uppercase tracking-widest mb-4">Acompanhe Nosso Trabalho</h2>
            <p className="text-lg print:text-base text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
               Convidamos você a conhecer de perto a excelência da Banda Sinfônica Nacional. Siga nossas redes, assista às nossas apresentações e junte-se a nós nesta jornada musical.
            </p>
            
            <div className="flex flex-col items-center gap-1 mb-8">
               <p className="text-xl print:text-lg text-white font-bold">Geyzilane de Andrade Moreira</p>
               <p className="text-amber-500 font-bold tracking-wider uppercase text-sm">Diretora Executiva</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-4 max-w-4xl mx-auto">
               <Link href="https://www.instagram.com/bandasinfonicanacionalbr" target="_blank" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-amber-500 text-zinc-300 print:bg-transparent print:border-amber-500/30 print:text-amber-500">
                  <Instagram size={20} className="shrink-0" />
                  <span className="font-bold text-sm tracking-wide">@bandasinfonicanacionalbr</span>
               </Link>
               
               <Link href="https://www.youtube.com/results?search_query=banda+sinfonica+nacional" target="_blank" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-amber-500 text-zinc-300 print:bg-transparent print:border-amber-500/30 print:text-amber-500">
                  <Youtube size={20} className="shrink-0" />
                  <span className="font-bold text-sm tracking-wide">Banda Sinfônica Nacional</span>
               </Link>

               <Link href="mailto:bandasinfonicanacional@gmail.com" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-amber-500 text-zinc-300 print:bg-transparent print:border-amber-500/30 print:text-amber-500">
                  <Mail size={20} className="shrink-0" />
                  <span className="font-bold text-sm tracking-wide">bandasinfonicanacional@gmail.com</span>
               </Link>

               <Link href="https://www.bandasinfonicanacional.com.br" target="_blank" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-black transition-all border border-white/10 hover:border-amber-500 text-zinc-300 print:bg-transparent print:border-amber-500/30 print:text-amber-500">
                  <Globe size={20} className="shrink-0" />
                  <span className="font-bold text-sm tracking-wide">www.bandasinfonicanacional.com.br</span>
               </Link>
            </div>
         </div>

         <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-zinc-600 print:text-gray-500">
            <p>
              Design e Desenvolvimento Web por{' '}
              <Link href="https://www.linkedin.com/in/anniecrlarcher/" target="_blank" className="inline-flex items-center gap-1 font-bold text-zinc-400 hover:text-amber-500 underline underline-offset-4 decoration-zinc-600 hover:decoration-amber-500 transition-colors">
                Annie Larcher <ExternalLink size={14} />
              </Link>
            </p>
         </div>
      </section>

    </div>
  );
}
