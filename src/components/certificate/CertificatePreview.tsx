import React from "react";
import { BSN_CREAM, BSN_DARK_BLUE, BSN_GOLD, BSN_GOLD_LIGHT, BSN_LOGO, BSN_NAVY, CertificateTheme } from "./types";

interface CertificatePreviewProps {
  recipientName: string;
  customText: string;
  dateText: string;
  theme: CertificateTheme;
  sig1Name: string;
  sig1Role: string;
  sig2Name: string;
  sig2Role: string;
  isSingleSig: boolean;
  isCropMarks: boolean;
  aspectRatioMode: "a4" | "16_9";
  outerWidth: number;
  outerHeight: number;
  bleedPadding: number;
}

export function CertificatePreview({
  recipientName,
  customText,
  dateText,
  theme,
  sig1Name,
  sig1Role,
  sig2Name,
  sig2Role,
  isSingleSig,
  isCropMarks,
  aspectRatioMode,
  outerWidth,
  outerHeight,
  bleedPadding,
}: CertificatePreviewProps) {
  const isNavy = theme === "navy";
  const is169 = aspectRatioMode === "16_9";

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 overflow-auto print:p-0 print:bg-transparent">
      {/* Outer Wrapper for Prepress Crop Marks */}
      <div
        className="relative shrink-0 flex items-center justify-center certificate-canvas-container"
        style={{
          width: outerWidth,
          height: outerHeight,
          padding: bleedPadding,
          background: isCropMarks ? (isNavy ? BSN_DARK_BLUE : BSN_CREAM) : "transparent",
          boxShadow: isCropMarks ? "0 25px 65px rgba(0,0,0,0.65)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Crop marks lines (Prepress markers) */}
        {isCropMarks && (
          <>
            {/* Top-Left */}
            <div className="absolute top-0 left-[15px] w-[0.5px] h-[10px] bg-slate-500 print:bg-black" />
            <div className="absolute top-[15px] left-0 w-[10px] h-[0.5px] bg-slate-500 print:bg-black" />
            {/* Top-Right */}
            <div className="absolute top-0 right-[15px] w-[0.5px] h-[10px] bg-slate-500 print:bg-black" />
            <div className="absolute top-[15px] right-0 w-[10px] h-[0.5px] bg-slate-500 print:bg-black" />
            {/* Bottom-Left */}
            <div className="absolute bottom-0 left-[15px] w-[0.5px] h-[10px] bg-slate-500 print:bg-black" />
            <div className="absolute bottom-[15px] left-0 w-[10px] h-[0.5px] bg-slate-500 print:bg-black" />
            {/* Bottom-Right */}
            <div className="absolute bottom-0 right-[15px] w-[0.5px] h-[10px] bg-slate-500 print:bg-black" />
            <div className="absolute bottom-[15px] right-0 w-[10px] h-[0.5px] bg-slate-500 print:bg-black" />
            
            {/* Cut Line Visual Overlay */}
            <div className="absolute inset-[15px] border border-dashed border-red-500/30 pointer-events-none z-30 print:hidden" />
          </>
        )}

        {/* Certificate Preview Card */}
        <div
          className="relative overflow-hidden w-full h-full flex flex-col justify-between"
          style={{
            background: isNavy ? BSN_NAVY : BSN_CREAM,
            border: isNavy ? `1px solid ${BSN_GOLD}33` : "1px solid #cfb53b55",
            boxShadow: isCropMarks ? "none" : "0 25px 65px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03)",
            color: isNavy ? "#ffffff" : "#031529",
            transition: "all 0.3s ease",
            padding: is169 ? "32px 48px" : "48px",
          }}
        >
          {/* Subtle watermark background pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, transparent 40%, ${BSN_GOLD} 100%), 
                                repeating-linear-gradient(135deg, #000 0, #000 1px, transparent 0, transparent 4px)`,
              filter: isNavy ? "none" : "invert(1) opacity(0.5)",
            }}
          />

          {/* Centered faint watermark BSN logo */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ opacity: isNavy ? 0.035 : 0.025 }}
          >
            <img src={BSN_LOGO} alt="Watermark BSN" className="w-[580px] h-[580px] object-contain" />
          </div>

          {/* Borders & Margins */}
          <div 
            className="absolute inset-4 pointer-events-none border border-double"
            style={{
              borderColor: isNavy ? `${BSN_GOLD}aa` : "#b8860b",
              borderWidth: "3px",
            }}
          />
          <div 
            className="absolute inset-7 pointer-events-none border opacity-60"
            style={{
              borderColor: isNavy ? BSN_GOLD_LIGHT : "#cfb53b",
              borderWidth: "1px",
            }}
          />

          {/* Corner flourishes */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />

          {/* Header Section */}
          <div className="flex flex-col items-center text-center mt-2 z-10">
            <img
              src={BSN_LOGO}
              alt="BSN Logo"
              className="h-28 object-contain mb-1"
              style={{ filter: isNavy ? `drop-shadow(0 0 5px ${BSN_GOLD}55)` : `drop-shadow(0 2px 4px rgba(0,0,0,0.15))` }}
            />
            <span 
              className="text-[10px] font-black tracking-[0.3em] uppercase leading-none"
              style={{ color: isNavy ? BSN_CREAM : "#0a2240" }}
            >
              BANDA SINFÔNICA NACIONAL
            </span>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#e0a020] to-transparent mt-2" />
          </div>

          {/* Main Content Layer */}
          <div className="flex flex-col items-center text-center my-auto py-2 z-10">
            <h2 
              className="text-[36px] font-black tracking-[0.25em] uppercase font-serif"
              style={{ 
                color: isNavy ? BSN_GOLD_LIGHT : "#8b6508",
                fontFamily: "'Cinzel', serif"
              }}
            >
              CERTIFICADO
            </h2>
            
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-1.5"
               style={{ 
                 color: isNavy ? BSN_GOLD : "#5c4008",
                 fontFamily: "'Cinzel', serif"
               }}>
              Homenagem Comemorativa de 1º Ano
            </p>

            <span className="text-[14px] font-medium italic mt-5 block"
                  style={{ 
                    color: isNavy ? "rgba(255,255,255,0.7)" : "#475569",
                    fontFamily: "'Cormorant Garamond', serif"
                  }}>
              Este certificado é concedido com honra a:
            </span>

            <h3 
              className="text-[32px] font-black tracking-wide my-2.5 font-serif border-b border-[#e0a020]/25 pb-1.5 max-w-[80%] inline-block"
              style={{ 
                color: isNavy ? "#ffffff" : "#031529",
                borderColor: BSN_GOLD,
                fontFamily: "'Cinzel', serif",
                textShadow: isNavy ? `0 0 10px ${BSN_GOLD}22` : "none"
              }}
            >
              {recipientName || "Nome do Homenageado"}
            </h3>

            <p 
              className="text-[13.5px] font-medium leading-relaxed max-w-[82%] mx-auto mt-3 font-serif"
              style={{ 
                color: isNavy ? BSN_CREAM : "#1e293b",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic"
              }}
            >
              {customText}
            </p>
          </div>

          {/* Footer Layer (Signatures & Seal) */}
          <div className="grid grid-cols-3 items-end w-full z-10">
            {isSingleSig ? (
              <>
                {/* Left: Date */}
                <div className="flex flex-col items-center justify-center pb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-center" 
                        style={{ 
                          color: isNavy ? BSN_GOLD_LIGHT : "#5c4008",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {dateText}
                  </span>
                </div>

                {/* Center: Signature 1 */}
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="h-5 text-[22px] font-normal leading-none mb-0 flex items-center justify-center select-none"
                    style={{ 
                      fontFamily: "'Great Vibes', cursive", 
                      color: isNavy ? BSN_GOLD_LIGHT : "#1e293b",
                      opacity: 0.85 
                    }}
                  >
                    {sig1Name}
                  </div>
                  <div className="w-[160px] h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30" 
                       style={{ color: isNavy ? "#ffffff" : "#031529" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-1"
                        style={{ 
                          color: isNavy ? "#ffffff" : "#031529",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {sig1Name}
                  </span>
                  <span className="text-[7.5px] font-semibold text-white/50 uppercase tracking-widest mt-0.5"
                        style={{ 
                          color: isNavy ? "rgba(255,255,255,0.4)" : "#64748b",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {sig1Role}
                  </span>
                </div>

                {/* Right: Emblem Seal */}
                <div className="flex justify-center pb-1">
                  <div className="w-12 h-12 rounded-full bg-[#e0a020] border-2 border-[#f5c842] flex flex-col items-center justify-center text-slate-950 font-bold text-[7px] leading-tight shadow-md select-none transform hover:scale-105 transition-transform">
                    <span className="font-extrabold tracking-widest text-[6px]">BSN</span>
                    <span className="text-[9px] font-black my-[-1px]">1º Ano</span>
                    <span className="text-[5px] opacity-75">2025-2026</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left: Signature 1 */}
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="h-5 text-[22px] font-normal leading-none mb-0 flex items-center justify-center select-none"
                    style={{ 
                      fontFamily: "'Great Vibes', cursive", 
                      color: isNavy ? BSN_GOLD_LIGHT : "#1e293b",
                      opacity: 0.85 
                    }}
                  >
                    {sig1Name}
                  </div>
                  <div className="w-[140px] h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30" 
                       style={{ color: isNavy ? "#ffffff" : "#031529" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-1"
                        style={{ 
                          color: isNavy ? "#ffffff" : "#031529",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {sig1Name}
                  </span>
                  <span className="text-[7.5px] font-semibold text-white/50 uppercase tracking-widest mt-0.5"
                        style={{ 
                          color: isNavy ? "rgba(255,255,255,0.4)" : "#64748b",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {sig1Role}
                  </span>
                </div>

                {/* Center: Emblem Seal & Date */}
                <div className="flex flex-col items-center justify-end">
                  <div className="w-11 h-11 rounded-full bg-[#e0a020] border-2 border-[#f5c842] flex flex-col items-center justify-center text-slate-950 font-bold text-[6.5px] leading-tight shadow-md select-none">
                    <span className="font-extrabold tracking-widest text-[5.5px]">BSN</span>
                    <span className="text-[8px] font-black my-[-1px]">1º Ano</span>
                    <span className="text-[4.5px] opacity-75">2025-2026</span>
                  </div>
                  <span className="text-[8.5px] font-bold tracking-wider uppercase text-center mt-2" 
                        style={{ 
                          color: isNavy ? BSN_GOLD_LIGHT : "#5c4008",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {dateText}
                  </span>
                </div>

                {/* Right: Signature 2 */}
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="h-5 text-[22px] font-normal leading-none mb-0 flex items-center justify-center select-none"
                    style={{ 
                      fontFamily: "'Great Vibes', cursive", 
                      color: isNavy ? BSN_GOLD_LIGHT : "#1e293b",
                      opacity: 0.85 
                    }}
                  >
                    {sig2Name}
                  </div>
                  <div className="w-[140px] h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30" 
                       style={{ color: isNavy ? "#ffffff" : "#031529" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-1"
                        style={{ 
                          color: isNavy ? "#ffffff" : "#031529",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {sig2Name}
                  </span>
                  <span className="text-[7.5px] font-semibold text-white/50 uppercase tracking-widest mt-0.5"
                        style={{ 
                          color: isNavy ? "rgba(255,255,255,0.4)" : "#64748b",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {sig2Role}
                  </span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
