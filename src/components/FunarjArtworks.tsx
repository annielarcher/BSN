"use client";

import React, { useRef } from "react";
import html2canvas from 'html2canvas';
import { MapPin } from 'lucide-react';

// Swiss Design Palette & Brazilian Flag Colors
const BSN_NAVY = "#002776";      // Deep Blue (Flag)
const BSN_YELLOW = "#fce300";    // Vibrant Yellow (Flag)
const BSN_GREEN = "#006b3f";     // Deep Green (Flag)
const BSN_CREAM = "#f4f1ea";     // Warm Off-white Canvas

const GUESTS = [
  { name: "Bina Goldrajch", role: "Mezzo Soprano", initial: "BG", imageUrl: "/Bina Goldrajch.jpeg", bg: BSN_NAVY, text: BSN_YELLOW },
  { name: "Brazilian Piper", role: "Convidado Especial", initial: "BP", imageUrl: "/brazilian-piper.jpeg", bg: BSN_YELLOW, text: BSN_NAVY },
  { name: "Wladimir Cabanas", role: "Tenor", initial: "WC", imageUrl: "/wladimir-cabanas.jpeg", bg: BSN_GREEN, text: BSN_CREAM },
  { name: "Mônica Maciel", role: "Soprano", initial: "MM", imageUrl: "/monica-maciel.jpeg", bg: BSN_CREAM, text: BSN_NAVY },
];

export function FunarjArtworks() {
  const DateBadge = ({ text, width, height, fontSize, yOffset }: { text: string, width: number, height: number, fontSize: number, yOffset: number }) => (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0" xmlns="http://www.w3.org/2000/svg">
      <rect width={width} height={height} fill={BSN_YELLOW} />
      <text x={width / 2} y={yOffset} fill={BSN_NAVY} fontSize={fontSize} fontWeight="900" fontFamily="'Inter', sans-serif" textAnchor="middle">{text}</text>
    </svg>
  );

  const SvgText = ({ text, width, height, fontSize, yOffset, opacity = 1 }: { text: string, width: number, height: number, fontSize: number, yOffset: number, opacity?: number }) => (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <text x={width / 2} y={yOffset} fill={BSN_NAVY} fontSize={fontSize} fontWeight="900" fontFamily="'Inter', sans-serif" textAnchor="middle">{text}</text>
    </svg>
  );

  const GuestPhoto = ({ url, size, borderColor, borderWidth, className = "" }: { url: string, size: number, borderColor: string, borderWidth: number, className?: string }) => {
    const scale = 4; // Supersampling multiplier for html2canvas hi-res
    return (
      <div 
        className={`shrink-0 bg-white overflow-hidden flex items-center justify-center ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        <div 
          style={{ 
            width: size * scale, 
            height: size * scale, 
            minWidth: size * scale, 
            minHeight: size * scale, 
            border: `${borderWidth * scale}px solid ${borderColor}`,
            backgroundImage: `url('${url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            transform: `scale(${1 / scale})`,
            transformOrigin: 'center center'
          }} 
        />
      </div>
    );
  };

  const BandPhoto = ({ className = "" }: { className?: string }) => {
    const scale = 4; // Supersampling multiplier for html2canvas hi-res
    return (
      <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
        <div 
          className="absolute top-0 left-0 origin-top-left filter contrast-125"
          style={{ 
            width: `${100 * scale}%`, 
            height: `${100 * scale}%`, 
            backgroundImage: `url('https://i.ibb.co/r2WDTv36/Whats-App-Image-2026-01-31-at-17-53-14.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: `scale(${1 / scale})`
          }} 
        />
        <div className="absolute inset-0 bg-[#002776] opacity-20 mix-blend-multiply pointer-events-none" />
      </div>
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (id: string, filename: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Ensure custom fonts are fully loaded before rendering
    await document.fonts.ready;

    try {
      const canvas = await html2canvas(element, {
        scale: 3, // High quality PNG
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const SponsorBar = ({ height }: { height: number }) => (
    <div 
      className="absolute bottom-0 left-0 w-full bg-white flex items-center justify-center border-t-4 z-50" 
      style={{ height: `${height}px`, borderColor: BSN_NAVY }}
    >
      <img 
        src="/funarj/barra de logos_jc_colorida.png" 
        alt="Sponsors" 
        className="h-[80%] w-auto object-contain mix-blend-multiply" 
        onError={(e) => { 
          e.currentTarget.style.display = 'none'; 
          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block'; 
        }} 
      />
      <span className="hidden text-[#002776] font-bold tracking-widest text-[10px] uppercase">
        BARRA DE LOGOS (FUNARJ / GOV RJ)
      </span>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex flex-col items-center py-12 px-4 gap-16 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Oswald:wght@500;700&display=swap');
      `}} />

      {/* HEADER */}
      <div className="text-center mb-8 text-white">
        <h1 className="text-3xl font-black mb-2 text-[#fce300]">Painel de Artes - FUNARJ</h1>
        <p className="text-white/60 text-sm">Site de Vendas: Estilo Swiss / Bandeira do Brasil</p>
      </div>

      <div className="flex flex-col gap-24 items-center w-full" ref={containerRef}>
        
        {/* ========================================================= */}
        {/* ART 1: 860x490 (Banner Principal) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-white/50 text-sm font-bold tracking-widest uppercase">Banner Principal (860x490)</span>
            <button onClick={() => handleDownload('art-1', 'Funarj_860x490')} className="px-4 py-1.5 bg-[#fce300] text-[#002776] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer rounded-sm border border-[#002776] shadow-sm">
              ⬇ Baixar
            </button>
          </div>
          <div 
            id="art-1"
            className="relative overflow-hidden shrink-0 flex"
            style={{ width: 860, height: 490, background: BSN_CREAM, fontFamily: "'Inter', sans-serif" }}
          >
            {/* Left Sidebar: Guests (30% width) */}
            <div className="w-[260px] h-[420px] flex flex-col border-r-4 border-[#002776]">
              {GUESTS.map((guest, idx) => (
                <div key={idx} className="h-[105px] flex flex-col p-4 border-b-2 justify-center relative overflow-hidden shrink-0" style={{ background: guest.bg, borderColor: BSN_NAVY }}>
                  {/* Subtle Geometric Graphic in Background of Guest */}
                  {idx === 0 && <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-4 opacity-30" style={{ borderColor: guest.text }} />}
                  {idx === 1 && <div className="absolute right-2 top-2 w-8 h-8 rotate-45 opacity-20" style={{ background: guest.text }} />}
                  {idx === 2 && <div className="absolute -left-6 top-0 w-16 h-full opacity-20" style={{ background: guest.text }} />}

                  <div className="flex items-center gap-4 z-10">
                    <GuestPhoto url={guest.imageUrl} size={72} borderColor={guest.text} borderWidth={3} className="shadow-lg" />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black uppercase leading-tight tracking-tight" style={{ color: guest.text }}>{guest.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-90" style={{ color: guest.text }}>{guest.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Main Content (600px width) */}
            <div className="w-[600px] h-[420px] flex flex-col relative shrink-0">
              
              {/* TOP HERO TYPOGRAPHY & BRAZILIAN SHAPES */}
              <div className="h-[200px] w-full flex items-stretch border-b-4 shrink-0" style={{ borderColor: BSN_NAVY }}>
                
                {/* "B" Box */}
                <div className="w-[200px] h-[200px] border-r-4 shrink-0 relative" style={{ background: BSN_CREAM, borderColor: BSN_NAVY }}>
                  <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="160" textAnchor="middle" fontSize="180" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>B</text></svg>
                </div>
                
                {/* "S" Box */}
                <div className="w-[200px] h-[200px] border-r-4 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_GREEN, borderColor: BSN_NAVY }}>
                  <div className="absolute w-[140px] h-[140px] rotate-45" style={{ background: BSN_YELLOW }} />
                  <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="160" textAnchor="middle" fontSize="180" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>S</text></svg>
                </div>

                {/* "N" Box */}
                <div className="w-[200px] h-[200px] relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_YELLOW }}>
                  <div className="absolute w-[150px] h-[150px] rounded-full" style={{ background: BSN_NAVY }} />
                  <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="160" textAnchor="middle" fontSize="180" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_CREAM}>N</text></svg>
                </div>

              </div>

              {/* MIDDLE / BOTTOM: TITLE & DETAILS */}
              <div className="h-[220px] flex p-6 gap-6 shrink-0 w-full">
                
                {/* Left Side of Bottom (Orchestra Photo) */}
                <div className="w-[45%] h-full">
                  <div className="w-full h-full border-4 relative overflow-hidden p-1 bg-white" style={{ borderColor: BSN_NAVY }}>
                    <BandPhoto />
                  </div>
                </div>

                {/* Right Side of Bottom (Text) */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-full border-t-[3px] border-b-[3px] py-3 mb-4 flex flex-col gap-1" style={{ borderColor: BSN_NAVY }}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BSN_NAVY }}>Banda Sinfônica Nacional apresenta</span>
                    <h2 className="text-[34px] font-black uppercase leading-[1.1] tracking-tighter" style={{ color: BSN_NAVY }}>
                      CLÁSSICOS<br/>MUNDIAIS
                    </h2>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5" style={{ color: BSN_NAVY }}>
                      <MapPin size={14} strokeWidth={2.5} />
                      <span className="text-[13px] font-black uppercase tracking-[0.2em]">Teatro João Caetano</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <DateBadge text="24 JUL" width={64} height={22} fontSize={16} yOffset={17} />
                      <SvgText text="|" width={10} height={22} fontSize={14} yOffset={16} opacity={0.3} />
                      <DateBadge text="SEX" width={40} height={22} fontSize={16} yOffset={17} />
                      <SvgText text="|" width={10} height={22} fontSize={14} yOffset={16} opacity={0.3} />
                      <SvgText text="19H" width={32} height={22} fontSize={16} yOffset={17} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <SponsorBar height={70} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* ART 2: 500x330 (Miniatura Larga) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-white/50 text-sm font-bold tracking-widest uppercase">Miniatura (500x330)</span>
            <button onClick={() => handleDownload('art-2', 'Funarj_500x330')} className="px-4 py-1.5 bg-[#fce300] text-[#002776] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer rounded-sm border border-[#002776] shadow-sm">
              ⬇ Baixar
            </button>
          </div>
          <div 
            id="art-2"
            className="relative overflow-hidden shrink-0 flex"
            style={{ width: 500, height: 330, background: BSN_CREAM, fontFamily: "'Inter', sans-serif" }}
          >
            {/* Left Sidebar: Guests (30% width) */}
            <div className="w-[140px] h-[280px] flex flex-col border-r-2 border-[#002776]">
              {GUESTS.map((guest, idx) => (
                <div key={idx} className="h-[70px] flex flex-col p-2.5 border-b-2 justify-center relative overflow-hidden shrink-0" style={{ background: guest.bg, borderColor: BSN_NAVY }}>
                  {/* Subtle Geometric Graphic */}
                  {idx === 0 && <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full border-2 opacity-30" style={{ borderColor: guest.text }} />}
                  {idx === 1 && <div className="absolute right-1 top-1 w-5 h-5 rotate-45 opacity-20" style={{ background: guest.text }} />}
                  {idx === 2 && <div className="absolute -left-3 top-0 w-8 h-full opacity-20" style={{ background: guest.text }} />}

                  <div className="flex items-center gap-3 z-10">
                    <GuestPhoto url={guest.imageUrl} size={48} borderColor={guest.text} borderWidth={2} className="shadow-md" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase leading-tight tracking-tight" style={{ color: guest.text }}>{guest.name}</span>
                      <span className="text-[6px] font-bold uppercase tracking-widest mt-0.5 opacity-90" style={{ color: guest.text }}>{guest.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Main Content (360px width) */}
            <div className="w-[360px] h-[280px] flex flex-col relative shrink-0">
              
              {/* TOP HERO TYPOGRAPHY */}
              <div className="h-[120px] w-full flex items-stretch border-b-2 shrink-0" style={{ borderColor: BSN_NAVY }}>
                
                <div className="w-[120px] h-[120px] border-r-2 shrink-0 relative" style={{ background: BSN_CREAM, borderColor: BSN_NAVY }}>
                  <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="95" textAnchor="middle" fontSize="100" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>B</text></svg>
                </div>
                
                <div className="w-[120px] h-[120px] border-r-2 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_GREEN, borderColor: BSN_NAVY }}>
                  <div className="absolute w-[80px] h-[80px] rotate-45" style={{ background: BSN_YELLOW }} />
                  <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="95" textAnchor="middle" fontSize="100" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>S</text></svg>
                </div>

                <div className="w-[120px] h-[120px] relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_YELLOW }}>
                  <div className="absolute w-[90px] h-[90px] rounded-full" style={{ background: BSN_NAVY }} />
                  <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="95" textAnchor="middle" fontSize="100" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_CREAM}>N</text></svg>
                </div>

              </div>

              {/* MIDDLE / BOTTOM: TITLE & DETAILS */}
              <div className="h-[160px] w-full flex p-4 gap-4 shrink-0">
                
                <div className="w-[45%] h-full">
                  <div className="w-full h-full border-2 relative overflow-hidden p-[2px] bg-white" style={{ borderColor: BSN_NAVY }}>
                    <BandPhoto />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-full border-t-2 border-b-2 py-1.5 mb-2 flex flex-col gap-0.5" style={{ borderColor: BSN_NAVY }}>
                    <span className="text-[6px] font-bold uppercase tracking-[0.2em]" style={{ color: BSN_NAVY }}>Banda Sinfônica Nacional apresenta</span>
                    <h2 className="text-[18px] font-black uppercase leading-[1.1] tracking-tighter" style={{ color: BSN_NAVY }}>
                      CLÁSSICOS<br/>MUNDIAIS
                    </h2>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1" style={{ color: BSN_NAVY }}>
                      <MapPin size={10} strokeWidth={2.5} />
                      <span className="text-[9px] font-black uppercase tracking-[0.1em]">Teatro João Caetano</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1">
                      <DateBadge text="24 JUL" width={42} height={14} fontSize={10} yOffset={11} />
                      <SvgText text="|" width={6} height={14} fontSize={9} yOffset={11} opacity={0.3} />
                      <DateBadge text="SEX" width={26} height={14} fontSize={10} yOffset={11} />
                      <SvgText text="|" width={6} height={14} fontSize={9} yOffset={11} opacity={0.3} />
                      <SvgText text="19H" width={22} height={14} fontSize={10} yOffset={11} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <SponsorBar height={50} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* ART 3: 330x330 (Card Quadrado) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-white/50 text-sm font-bold tracking-widest uppercase">Card Quadrado (330x330)</span>
            <button onClick={() => handleDownload('art-3', 'Funarj_330x330')} className="px-4 py-1.5 bg-[#fce300] text-[#002776] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer rounded-sm border border-[#002776] shadow-sm">
              ⬇ Baixar
            </button>
          </div>
          <div 
            id="art-3"
            className="relative overflow-hidden shrink-0 flex flex-col"
            style={{ width: 330, height: 330, background: BSN_CREAM, fontFamily: "'Inter', sans-serif" }}
          >
            {/* Top Typography (30% height) */}
            <div className="h-[90px] w-full flex items-stretch border-b-2 shrink-0" style={{ borderColor: BSN_NAVY }}>
              <div className="w-[110px] h-[90px] border-r-2 shrink-0 relative" style={{ background: BSN_CREAM, borderColor: BSN_NAVY }}>
                <svg viewBox="0 0 110 90" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="75" textAnchor="middle" fontSize="80" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>B</text></svg>
              </div>
              <div className="w-[110px] h-[90px] border-r-2 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_GREEN, borderColor: BSN_NAVY }}>
                <div className="absolute w-[60px] h-[60px] rotate-45" style={{ background: BSN_YELLOW }} />
                <svg viewBox="0 0 110 90" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="75" textAnchor="middle" fontSize="80" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>S</text></svg>
              </div>
              <div className="w-[110px] h-[90px] relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_YELLOW }}>
                <div className="absolute w-[70px] h-[70px] rounded-full" style={{ background: BSN_NAVY }} />
                <svg viewBox="0 0 110 90" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="75" textAnchor="middle" fontSize="80" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_CREAM}>N</text></svg>
              </div>
            </div>

            {/* Middle Content (Guests Grid + Details) */}
            <div className="w-full h-[200px] flex p-4 pb-12 gap-3 shrink-0">
              
              {/* Left Side: 2x2 Grid of Guests (using flex wrap to fix html2canvas grid bugs) */}
              <div className="w-[145px] h-full flex flex-wrap gap-1.5 shrink-0">
                {GUESTS.map((guest, idx) => (
                  <div key={idx} className="w-[calc(50%-3px)] h-[calc(50%-3px)] flex flex-col p-1.5 justify-center items-center text-center relative overflow-hidden border border-[#002776]/20" style={{ background: guest.bg }}>
                    <GuestPhoto url={guest.imageUrl} size={40} borderColor={guest.text} borderWidth={1.5} className="shadow-sm mb-1" />
                    <span className="text-[6px] font-black uppercase leading-[1.1] tracking-tight" style={{ color: guest.text }}>{guest.name}</span>
                  </div>
                ))}
              </div>

              {/* Right Side: Titles and Image */}
              <div className="w-[140px] h-full flex flex-col justify-between shrink-0">
                <div className="w-full border-t-[1.5px] border-b-[1.5px] py-1 flex flex-col gap-[1px]" style={{ borderColor: BSN_NAVY }}>
                  <span className="text-[4px] font-bold uppercase tracking-[0.2em] text-center" style={{ color: BSN_NAVY }}>Banda Sinfônica Nacional apresenta</span>
                  <h2 className="text-[14px] font-black uppercase leading-tight tracking-tighter text-center" style={{ color: BSN_NAVY }}>
                    CLÁSSICOS<br/>MUNDIAIS
                  </h2>
                </div>

                <div className="w-full flex-1 border-2 relative overflow-hidden p-[2px] bg-white my-2" style={{ borderColor: BSN_NAVY }}>
                  <BandPhoto />
                </div>

                <div className="flex flex-col items-center text-center gap-0.5">
                  <div className="flex items-center justify-center gap-1" style={{ color: BSN_NAVY }}>
                    <MapPin size={9} strokeWidth={2.5} />
                    <span className="text-[8px] font-black uppercase tracking-[0.1em]">Teatro João Caetano</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-center gap-1">
                    <DateBadge text="24 JUL" width={32} height={11} fontSize={8} yOffset={9} />
                    <SvgText text="|" width={6} height={11} fontSize={7} yOffset={9} opacity={0.3} />
                    <DateBadge text="SEX" width={20} height={11} fontSize={8} yOffset={9} />
                    <SvgText text="|" width={6} height={11} fontSize={7} yOffset={9} opacity={0.3} />
                    <SvgText text="19H" width={18} height={11} fontSize={8} yOffset={9} />
                  </div>
                </div>
              </div>

            </div>

            <SponsorBar height={40} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* ART 4: 480x600 (Instagram Portrait 4:5) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-white/50 text-sm font-bold tracking-widest uppercase">Banner Inst. Portrait (480x600)</span>
            <button onClick={() => handleDownload('art-4', 'Funarj_Instagram_480x600')} className="px-4 py-1.5 bg-[#fce300] text-[#002776] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer rounded-sm border border-[#002776] shadow-sm">
              ⬇ Baixar
            </button>
          </div>
          <div 
            id="art-4"
            className="relative overflow-hidden shrink-0 flex flex-col"
            style={{ width: 480, height: 600, background: BSN_CREAM, fontFamily: "'Inter', sans-serif" }}
          >
             {/* TOP HERO (BSN) - 140px tall */}
             <div className="h-[140px] w-full flex items-stretch border-b-4 shrink-0" style={{ borderColor: BSN_NAVY }}>
                <div className="w-[160px] h-full border-r-4 shrink-0 relative flex items-center justify-center" style={{ background: BSN_CREAM, borderColor: BSN_NAVY }}>
                  <svg viewBox="0 0 160 140" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="110" textAnchor="middle" fontSize="130" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>B</text></svg>
                </div>
                <div className="w-[160px] h-full border-r-4 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_GREEN, borderColor: BSN_NAVY }}>
                  <div className="absolute w-[100px] h-[100px] rotate-45" style={{ background: BSN_YELLOW }} />
                  <svg viewBox="0 0 160 140" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="110" textAnchor="middle" fontSize="130" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>S</text></svg>
                </div>
                <div className="w-[160px] h-full relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_YELLOW }}>
                  <div className="absolute w-[110px] h-[110px] rounded-full" style={{ background: BSN_NAVY }} />
                  <svg viewBox="0 0 160 140" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="110" textAnchor="middle" fontSize="130" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_CREAM}>N</text></svg>
                </div>
             </div>

             {/* MIDDLE: BAND PHOTO & TITLE (240px tall) */}
             <div className="h-[240px] w-full flex p-5 gap-5 shrink-0">
               {/* Left: Band Photo */}
               <div className="w-[50%] h-full border-4 relative overflow-hidden p-1 bg-white shrink-0" style={{ borderColor: BSN_NAVY }}>
                 <BandPhoto />
               </div>
               {/* Right: Title & Date */}
               <div className="w-[50%] flex flex-col justify-center shrink-0 pr-4">
                  <div className="w-full border-t-[3px] border-b-[3px] py-2 mb-3 flex flex-col gap-1" style={{ borderColor: BSN_NAVY }}>
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: BSN_NAVY }}>Banda Sinfônica Nacional apresenta</span>
                    <h2 className="text-[26px] font-black uppercase leading-[1.1] tracking-tighter" style={{ color: BSN_NAVY }}>
                      CLÁSSICOS<br/>MUNDIAIS
                    </h2>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5" style={{ color: BSN_NAVY }}>
                      <MapPin size={12} strokeWidth={2.5} />
                      <span className="text-[11px] font-black uppercase tracking-[0.1em]">Teatro João Caetano</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <DateBadge text="24 JUL" width={48} height={16} fontSize={12} yOffset={12} />
                      <SvgText text="|" width={8} height={16} fontSize={11} yOffset={12} opacity={0.3} />
                      <DateBadge text="SEX" width={28} height={16} fontSize={12} yOffset={12} />
                      <SvgText text="|" width={8} height={16} fontSize={11} yOffset={12} opacity={0.3} />
                      <SvgText text="19H" width={26} height={16} fontSize={12} yOffset={12} />
                    </div>
                  </div>
               </div>
             </div>

             {/* BOTTOM: GUESTS (160px tall) */}
             <div className="w-full h-[160px] flex px-4 gap-3 pb-2 shrink-0">
               {GUESTS.map((guest, idx) => (
                 <div key={idx} className="flex-1 h-full border-2 p-2 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0" style={{ background: guest.bg, borderColor: BSN_NAVY }}>
                    {idx === 0 && <div className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full border-2 opacity-30" style={{ borderColor: guest.text }} />}
                    {idx === 1 && <div className="absolute right-1 top-1 w-6 h-6 rotate-45 opacity-20" style={{ background: guest.text }} />}
                    {idx === 2 && <div className="absolute -left-2 top-0 w-10 h-full opacity-20" style={{ background: guest.text }} />}
                    
                    <GuestPhoto url={guest.imageUrl} size={50} borderColor={guest.text} borderWidth={2} className="shadow-sm mb-2 z-10" />
                    <span className="text-[9px] font-black uppercase leading-[1.1] tracking-tight z-10" style={{ color: guest.text }}>{guest.name}</span>
                    <span className="text-[6.5px] font-bold uppercase tracking-widest mt-1 opacity-90 z-10" style={{ color: guest.text }}>{guest.role}</span>
                 </div>
               ))}
             </div>
             
             <SponsorBar height={60} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* ART 5: 420x594 (Cartaz A4) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-white/50 text-sm font-bold tracking-widest uppercase">Cartaz de Impressão A4 (420x594)</span>
            <button onClick={() => handleDownload('art-5', 'Funarj_Cartaz_420x594')} className="px-4 py-1.5 bg-[#fce300] text-[#002776] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer rounded-sm border border-[#002776] shadow-sm">
              ⬇ Baixar
            </button>
          </div>
          <div 
            id="art-5"
            className="relative overflow-hidden shrink-0 flex"
            style={{ width: 420, height: 594, background: BSN_CREAM, fontFamily: "'Inter', sans-serif" }}
          >
             {/* LEFT SIDE: Vertical B S N (100px wide, spans 544px height before sponsor) */}
             <div className="w-[100px] h-[544px] flex flex-col border-r-4 shrink-0" style={{ borderColor: BSN_NAVY }}>
                <div className="w-full h-[180px] border-b-4 relative shrink-0" style={{ background: BSN_CREAM, borderColor: BSN_NAVY }}>
                  <svg viewBox="0 0 100 180" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="130" textAnchor="middle" fontSize="130" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>B</text></svg>
                </div>
                <div className="w-full h-[182px] border-b-4 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_GREEN, borderColor: BSN_NAVY }}>
                  <div className="absolute w-[80px] h-[80px] rotate-45" style={{ background: BSN_YELLOW }} />
                  <svg viewBox="0 0 100 182" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="130" textAnchor="middle" fontSize="130" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_NAVY}>S</text></svg>
                </div>
                <div className="w-full flex-1 relative overflow-hidden shrink-0 flex items-center justify-center" style={{ background: BSN_YELLOW }}>
                  <div className="absolute w-[80px] h-[80px] rounded-full" style={{ background: BSN_NAVY }} />
                  <svg viewBox="0 0 100 182" className="absolute inset-0 w-full h-full z-10"><text x="50%" y="130" textAnchor="middle" fontSize="130" fontWeight="900" fontFamily="'Oswald', sans-serif" fill={BSN_CREAM}>N</text></svg>
                </div>
             </div>

             {/* RIGHT SIDE: Main Content (320px wide) */}
             <div className="w-[320px] h-[544px] flex flex-col shrink-0">
               {/* BAND PHOTO (180px height) */}
               <div className="h-[180px] w-full p-4 shrink-0 border-b-4" style={{ borderColor: BSN_NAVY }}>
                 <div className="w-full h-full border-4 relative overflow-hidden p-1 bg-white" style={{ borderColor: BSN_NAVY }}>
                    <BandPhoto />
                 </div>
               </div>

               {/* TITLE & DETAILS (140px height) */}
               <div className="h-[140px] w-full px-5 flex flex-col justify-center border-b-4 shrink-0" style={{ borderColor: BSN_NAVY }}>
                  <div className="w-full py-1 mb-2 flex flex-col gap-1 border-t-2 border-b-2" style={{ borderColor: BSN_NAVY }}>
                    <span className="text-[7px] font-bold uppercase tracking-[0.2em]" style={{ color: BSN_NAVY }}>Banda Sinfônica Nacional apresenta</span>
                    <div className="flex flex-col text-[24px] font-black uppercase tracking-tighter pb-1" style={{ color: BSN_NAVY, lineHeight: '24px' }}>
                      <span>CLÁSSICOS</span>
                      <span>MUNDIAIS</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1" style={{ color: BSN_NAVY }}>
                      <MapPin size={11} strokeWidth={2.5} />
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] translate-y-[0.5px]">Teatro João Caetano</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <DateBadge text="24 JUL" width={42} height={14} fontSize={10} yOffset={11} />
                      <SvgText text="|" width={8} height={14} fontSize={10} yOffset={11} opacity={0.3} />
                      <DateBadge text="SEX" width={24} height={14} fontSize={10} yOffset={11} />
                      <SvgText text="|" width={8} height={14} fontSize={10} yOffset={11} opacity={0.3} />
                      <SvgText text="19H" width={22} height={14} fontSize={10} yOffset={11} />
                    </div>
                  </div>
               </div>

               {/* GUESTS LIST (224px height) */}
               <div className="h-[224px] w-full flex flex-col shrink-0">
                 {GUESTS.map((guest, idx) => (
                   <div key={idx} className="flex-1 w-full border-b-[1px] px-5 flex items-center gap-4 relative overflow-hidden shrink-0" style={{ background: guest.bg, borderColor: 'rgba(0,39,118,0.2)' }}>
                      {idx === 0 && <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-4 opacity-30" style={{ borderColor: guest.text }} />}
                      {idx === 1 && <div className="absolute right-3 top-2 w-8 h-8 rotate-45 opacity-20" style={{ background: guest.text }} />}
                      {idx === 2 && <div className="absolute -left-2 top-0 w-8 h-full opacity-20" style={{ background: guest.text }} />}
                      
                      <GuestPhoto url={guest.imageUrl} size={36} borderColor={guest.text} borderWidth={1.5} className="shadow-sm z-10 shrink-0" />
                      <div className="flex flex-col z-10 shrink-0">
                        <span className="text-[11px] font-black uppercase leading-tight tracking-tight" style={{ color: guest.text }}>{guest.name}</span>
                        <span className="text-[7.5px] font-bold uppercase tracking-widest mt-0.5 opacity-90" style={{ color: guest.text }}>{guest.role}</span>
                      </div>
                   </div>
                 ))}
               </div>
             </div>

             <SponsorBar height={50} />
          </div>
        </div>

      </div>
    </div>
  );
}
