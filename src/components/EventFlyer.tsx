"use client";

import React from "react";
import { Calendar, Clock, Mic2, Wrench, ChevronRight, Navigation } from "lucide-react";

// BSN Brand Colors
const BSN_NAVY = "#031529";      // Primary Deep Navy
const BSN_DARK_BLUE = "#020d1a";  // Darker shade for gradient depths
const BSN_LIGHT_NAVY = "#0a2240"; // Lighter shade for bottom split
const BSN_GOLD = "#e0a020";       // Gold Accent
const BSN_GOLD_LIGHT = "#f5c842"; // Lighter Gold Accent
const BSN_CREAM = "#f5ead8";      // Cream for off-white text readability

const BSN_LOGO = "https://i.ibb.co/RT04KgYz/BSN-logo-no-BG.png";

// Static Guest Data (Clean and easily editable)
const MAESTRO_ALEXANDRE = {
  name: "Alexandre Rocha",
  role: "Maestro",
  imageUrl: "https://i.ibb.co/3y59L7mb/Whats-App-Image-2026-01-29-at-19-04-21.jpg"
};

const MAESTRO_EDUARDO = {
  name: "Eduardo Lagreca Fan",
  role: "Maestro",
  imageUrl: "/Images/Eduardo-lagreca-fan.jpeg.jpeg"
};

const LUTHIER_REGINALDO = {
  name: "Reginaldo de Jesus",
  role: "Oficina Luthieria",
  imageUrl: "/Images/Reginaldo-Jesus.jpeg"
};

const CONVIDADO_ROBERTO = {
  name: "Roberto Weingrill Jr.",
  role: "Amostra Weril",
  imageUrl: "/Images/Roberto-Weingrill.jpeg"
};

const DIRETORA_GEYZI = {
  name: "Geyzi Moreira",
  role: "Dir. Artística",
  imageUrl: "https://i.ibb.co/Jw1wR0n7/Whats-App-Image-2026-01-30-at-18-58-42.jpg"
};

export function SinfonicaEventFlyer() {
  const [format, setFormat] = React.useState<"a6" | "instagram">("a6");
  const isInsta = format === "instagram";

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 print:py-0 print:px-0 print-wrapper"
      style={{ background: "#04050a", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Import Inter font dynamically and configure professional A6 print layout */}
      <style dangerouslySetInnerHTML={{__html: `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
  
  @media print {
    @page {
      size: 105mm 148mm;
      margin: 0;
    }
    
    /* Zera a página inteira e bloqueia barras de rolagem */
    html, body, #__next, #root {
      width: 105mm !important;
      height: 148mm !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #031529 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      overflow: hidden !important;
    }
    
    /* O pulo do gato: quebra o Flexbox e fixa o wrapper no topo esquerdo da folha */
    .print-wrapper {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 105mm !important;
      height: 148mm !important;
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #031529 !important;
      z-index: 9999 !important;
    }
    
    /* Força o card a esticar 100% e anula os estilos inline de borda redonda e sombra */
    .flyer-card {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 105mm !important;
      height: 148mm !important;
      max-width: none !important;
      margin: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      transform: none !important;
    }
    
    /* Garante o padding interno da arte na versão impressa */
    .flyer-card-content {
      padding: 20px !important;
    }
  }
`}} />

      {/* Switcher Bar - hidden during print */}
      <div className="flex gap-2.5 mb-5 justify-center print:hidden z-30 relative">
        <button
          onClick={() => setFormat("a6")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg border ${
            format === "a6"
              ? "bg-[#e0a020] text-[#031529] border-[#e0a020]"
              : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
          }`}
        >
          A6 Impressão
        </button>
        <button
          onClick={() => setFormat("instagram")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg border ${
            format === "instagram"
              ? "bg-[#e0a020] text-[#031529] border-[#e0a020]"
              : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
          }`}
        >
          Instagram (1080x1350)
        </button>
      </div>

      {/* Flyer container — A4-ish proportion matching the target design */}
      <div
        className="relative w-full overflow-hidden print:shadow-none print:max-w-none print:rounded-none flyer-card transition-all duration-300"
        style={{
          maxWidth: 480,
          aspectRatio: isInsta ? "4 / 5" : "5 / 6.8",
          background: BSN_NAVY,
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(245,200,66,0.1)",
        }}
      >
        {/* Subtle background textured pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, transparent 60%, rgba(0,0,0,0.6) 100%), 
                              repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
            backgroundSize: "10px 10px",
          }}
        />

        {/* ── SPLIT DIAGONAL WAVE (Lighter bottom-left section) ── */}
        <div
          className="absolute bottom-0 left-0 w-full h-[55%] pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${BSN_LIGHT_NAVY} 0%, ${BSN_DARK_BLUE} 100%)`,
            clipPath: "polygon(0 30%, 100% 85%, 100% 100%, 0 100%)",
          }}
        />

        {/* ── SPLIT CURVED CONTRAST DIAGONAL ── */}
        <div
          className="absolute bottom-0 left-0 w-full h-[58%] pointer-events-none opacity-20"
          style={{
            background: BSN_GOLD_LIGHT,
            clipPath: "polygon(0 28%, 100% 83%, 100% 85%, 0 32%)",
          }}
        />

        {/* ── CONTENT LAYER ── */}
        <div className={`absolute inset-0 flex flex-col justify-between z-10 text-white flyer-card-content transition-all duration-300 ${isInsta ? "p-5 pb-4" : "p-6"}`}>
          
          {/* 1. HEADER ROW */}
          <div className="flex flex-col gap-1 items-start w-full">            
            <div className="flex justify-between items-center w-full mt-1">
              <div className="flex items-center gap-2">
                <img
                  src={BSN_LOGO}
                  alt="BSN Logo"
                  className="h-10 object-contain"
                  style={{ filter: `drop-shadow(0 0 4px ${BSN_GOLD}55)` }}
                />
                <div className="h-6 w-px bg-white/20" />
                <span className="text-[8px] font-bold tracking-wider leading-none" style={{ color: BSN_CREAM }}>
                  BANDA SINFÔNICA<br/>NACIONAL
                </span>
              </div>
              <div className="text-right">        
                <span className="block text-[10px] font-light tracking-[0.25em] uppercase text-white/90 leading-none">
                  <span className="font">série</span> I<br/>
                  <span className="font-bold">2026</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. MAIN TITLE BLOCK & GUESTS COLLAGE OVERLAY */}
          <div className="relative my-auto py-4 flex items-center justify-between">
            
            {/* Títulos na Esquerda (Escala Ajustada para A6) */}
            <div className="w-full max-w-[48%] z-20 flex flex-col items-start">
              <h1 className="text-[20px] font-black leading-[0.95] tracking-tight uppercase" style={{ color: BSN_CREAM }}>
                I PAINEL<br/>
                SINFÔNICO
              </h1>
              <div className="h-1.5"></div>
              
              <h2 className="text-[22px] font-black leading-none uppercase tracking-tight px-2 py-1 inline-block rounded-md shadow-md"
                  style={{ background: BSN_GOLD_LIGHT, color: BSN_NAVY }}>
                Diálogos 
              </h2>
              <p className="text-[12px] font-semibold italic text-white/70 my-0.5 leading-tight ml-1">
                &
              </p>
              <h2 className="text-[22px] font-black leading-none uppercase tracking-tight px-2 py-1 inline-block rounded-md shadow-md"
                  style={{ background: BSN_GOLD_LIGHT, color: BSN_NAVY }}>
                sons
              </h2>
            </div>

            {/* Círculo da Direita */}
            <div className={`w-[210px] h-[210px] absolute shrink-0 z-10 transition-all duration-300 ${isInsta ? "right-[4px] top-[4px]" : "right-[-8px] top-[-5px]"}`}>
              <div 
                className="w-full h-full rounded-full flex flex-col items-center justify-center border-2 relative"
                style={{
                  borderColor: BSN_GOLD,
                  background: "radial-gradient(circle at center, #102d54 0%, #031529 70%, #010811 100%)",
                  boxShadow: `0 15px 45px rgba(0,0,0,0.85), 0 0 25px rgba(245,200,66,0.3), inset 0 0 30px rgba(245,200,66,0.15)`
                }}
              >
                {/* Anéis Internos Ajustados */}
                <div className="w-[186px] h-[186px] border border-[#f5c842]/15 rounded-full absolute pointer-events-none z-10" style={{ top: "10px", left: "10px" }} />
                <div className="w-[162px] h-[162px] border border-dashed border-[#f5c842]/10 rounded-full absolute pointer-events-none z-10" style={{ top: "22px", left: "22px" }} />
                <div className="w-[138px] h-[138px] border border-[#f5c842]/5 rounded-full absolute pointer-events-none z-10" style={{ top: "34px", left: "34px" }} />

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 z-20 mt-1">
                  
                  {/* Alexandre */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[68px] h-[52px] border border-[#f5c842]/50 rounded overflow-hidden bg-[#020d1a]">
                      <img src={MAESTRO_ALEXANDRE.imageUrl} alt={MAESTRO_ALEXANDRE.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[4.5px] font-black tracking-wider text-[#f5c842] uppercase mt-1 leading-none">MAESTRO</span>
                    <span className="text-[4.5px] font-bold text-white/95 uppercase leading-none mt-0.5">ALEXANDRE ROCHA</span>
                  </div>

                  {/* Eduardo */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[68px] h-[52px] border border-[#f5c842]/50 rounded overflow-hidden bg-[#020d1a]">
                      <img src={MAESTRO_EDUARDO.imageUrl} alt={MAESTRO_EDUARDO.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[4.5px] font-black tracking-wider text-[#f5c842] uppercase mt-1 leading-none">MAESTRO</span>
                    <span className="text-[4.5px] font-bold text-white/95 uppercase leading-none mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap w-[68px]">EDUARDO LAGRECA</span>
                  </div>

                  {/* Roberto */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[68px] h-[52px] border border-[#f5c842]/50 rounded overflow-hidden bg-[#020d1a]">
                      <img src={CONVIDADO_ROBERTO.imageUrl} alt={CONVIDADO_ROBERTO.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[4.5px] font-black tracking-wider text-[#f5c842] uppercase mt-1 leading-none text-ellipsis overflow-hidden whitespace-nowrap w-[68px]">ROBERTO WEINGRILL</span>
                    <span className="text-[4px] font-bold text-white/70 uppercase leading-none mt-0.5">(WERIL)</span>
                  </div>

                  {/* Reginaldo */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[68px] h-[52px] border border-[#f5c842]/50 rounded overflow-hidden bg-[#020d1a]">
                      <img src={LUTHIER_REGINALDO.imageUrl} alt={LUTHIER_REGINALDO.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[4.5px] font-black tracking-wider text-[#f5c842] uppercase mt-1 leading-none text-ellipsis overflow-hidden whitespace-nowrap w-[68px]">REGINALDO DE JESUS</span>
                    <span className="text-[4px] font-bold text-white/70 uppercase leading-none mt-0.5">(LUTHIER)</span>
                  </div>

                </div>
                {/* Overlay dourado sutil */}
                <div className="absolute inset-0 mix-blend-color pointer-events-none rounded-full" style={{ background: `rgba(224, 160, 32, 0.12)` }} />
              </div>
            </div>
          </div>

          {/* 3. PROGRAM DETAILS & DATE */}
          <div className="grid grid-cols-12 gap-3 items-end mt-auto pt-2">
            
            {/* Bottom-left: Activities & Participants (Blue section) */}
            <div className="col-span-7 flex flex-col gap-2 z-20 text-left">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-white/90 border-b border-white/20 pb-0.5 w-[80%]">
                  Programação
                </span>
                
                {/* Roda de Conversa */}
                <div className="flex flex-col">
                  <span className="text-[7.5px] font-extrabold uppercase text-[#f5c842] tracking-wider mb-0.5">
                    Roda de Conversa
                  </span>
                  <div className="flex items-center gap-1.5">                    
                    <div className="flex flex-col">
                      <p className="text-[8.5px] font-bold text-white leading-tight">
                        "Perspectivas para Banda Sinfônica"
                      </p>
                      <p className="text-[7px] font-semibold text-white/70 leading-tight mt-0.5">
                        Com os Maestros {MAESTRO_ALEXANDRE.name} & {MAESTRO_EDUARDO.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Oficina Luthieria */}
                <div className="flex flex-col">
                  <span className="text-[7.5px] font-extrabold uppercase text-[#f5c842] tracking-wider mb-0.5">
                    Oficina de Luthieria
                  </span>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[8.5px] font-medium text-white/90 leading-tight">
                      Com {LUTHIER_REGINALDO.name}
                    </p>
                  </div>
                </div>

                {/* Amostra Weril */}
                <div className="flex flex-col">
                  <span className="text-[7.5px] font-extrabold uppercase text-[#f5c842] tracking-wider mb-0.5">
                    Mostra de Instrumentos
                  </span>
                  <div className="flex items-center gap-1.5">                  
                    <p className="text-[8.5px] font-medium text-white/90 leading-tight">
                      Exposição Weril com {CONVIDADO_ROBERTO.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-right: Date, Time & Location Display styled like the reference */}
            <div className="col-span-5 text-right z-20 flex flex-col items-end justify-end">
              <div className="flex items-center gap-1.5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-2.5"
                   style={{ background: `${BSN_LIGHT_NAVY}cc` }}>
                <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: BSN_GOLD_LIGHT }}>
                  Entrada Franca
                </span>
              </div>
              
              {/* Date | Time | Day Row */}
              <div className="flex items-center gap-1.5 text-[14px] font-black uppercase tracking-wider text-white">
                <span>17 JUL</span>
                <span className="text-white/30 font-light">|</span>
                <span>18H30</span>
                <span className="text-white/30 font-light">|</span>
                <span style={{ color: BSN_GOLD_LIGHT }}>SEX</span>
              </div>
              
              {/* Location Name Row */}
              <p className="text-[9px] font-black uppercase tracking-wider text-white mt-2 leading-tight">
                Catedral Presbiteriana
              </p>
              {/* Address Row */}
              <p className="text-[7.5px] text-white/60 tracking-normal leading-tight mt-0.5">
                R. Silva Jardim, 23 - Centro
              </p>
            </div>

          </div>

          {/* 4. FOOTER & SPONSORS */}
          <div className="border-t border-white/10 mt-3 pt-3 flex items-center justify-between z-20">
            <div className="flex flex-col gap-1 items-start">
              <span className="text-[6.5px] font-bold text-white/40 uppercase tracking-widest leading-none mb-0.5">
                Apoio & Incentivo
              </span>
              <div className="flex gap-3.5 items-center">
                {/* Partner Logo 1 (Weril) */}
                <div className="h-10 flex items-center">
                  <img
                    src="/parceiros/weril.webp"
                    alt="Weril"
                    className="h-8 object-contain brightness-0 invert opacity-70"
                  />
                </div>
                {/* Partner Logo 2 (RJF Luthier) */}
                <div className="h-6 flex items-center">
                  <img
                    src="/parceiros/rjf-luthier.png"
                    alt="RJF Luthier"
                    className="h-10 rounded object-contain opacity-80"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                {/* Partner Logo 3 (Lei Rouanet) */}
                <div className="h-6 flex items-center">
                  <img
                    src="https://www.gov.br/cultura/pt-br/centrais-de-conteudo/marcas-e-logotipos/marcas-rouanet/LogoLeiRouanet_colorida.png"
                    alt="Lei de Incentivo à Cultura - Lei Rouanet"
                    className="h-3.5 object-contain brightness-0 invert opacity-70"
                  />
                </div>
                {/* Partner Logo 4 (Catedral Presbiteriana)*/}
                <div className="h-6 flex items-center">
                  <img
                      src="/parceiros/catedral-presbiteriana.png"
                      alt="Catedral Presbiteriana"
                      className="h-6 rounded object-contain opacity-80"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                </div>
              </div>

            <div className="flex items-center gap-2">
              <div className="text-right flex flex-col justify-center">
                <span className="text-[7px] font-semibold text-white/50 uppercase leading-none">
                  Direção Artística
                </span>
                <span className="text-[8.5px] font-extrabold uppercase leading-tight mt-0.5" style={{ color: BSN_GOLD_LIGHT }}>
                  {DIRETORA_GEYZI.name}
                </span>
              </div>
              {DIRETORA_GEYZI.imageUrl && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#f5c842] shrink-0 relative bg-[#020d1a]">
                  <img
                    src={DIRETORA_GEYZI.imageUrl}
                    alt={DIRETORA_GEYZI.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
