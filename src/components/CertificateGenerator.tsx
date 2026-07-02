"use client";

import React, { useState, useEffect } from "react";
import { Award, Printer, RotateCcw, Sparkles, User, FileText, Calendar, Feather } from "lucide-react";

// BSN Brand Colors
const BSN_NAVY = "#031529";
const BSN_DARK_BLUE = "#020d1a";
const BSN_LIGHT_NAVY = "#0a2240";
const BSN_GOLD = "#e0a020";
const BSN_GOLD_LIGHT = "#f5c842";
const BSN_CREAM = "#f5ead8";
const BSN_LOGO = "https://i.ibb.co/RT04KgYz/BSN-logo-no-BG.png";

type CertificateCategory = "musico" | "apoiador" | "colaborador" | "fundacao" | "custom";
type CertificateTheme = "navy" | "saver";

interface CategoryPreset {
  title: string;
  defaultText: string;
}

const CATEGORY_PRESETS: Record<CertificateCategory, CategoryPreset> = {
  musico: {
    title: "Músico Homenageado",
    defaultText: "Em reconhecimento à sua valiosa contribuição artística como Músico da Banda Sinfônica Nacional e ao seu precioso trabalho voluntário prestado durante o processo de estruturação e fundação desta instituição, expressando nossa profunda gratidão pelo talento, virtuosismo e dedicação exemplar demonstrados ao longo deste primeiro ano de história e conquistas.",
  },
  apoiador: {
    title: "Apoiador Homenageado",
    defaultText: "Em reconhecimento ao seu valioso apoio e incentivo institucional e ao precioso trabalho voluntário prestado durante o processo de realização e fundação da Banda Sinfônica Nacional, expressando nossa sincera gratidão pela parceria fundamental que contribuiu para a viabilização, consolidação e sucesso das atividades culturais desta instituição em seu primeiro aniversário.",
  },
  colaborador: {
    title: "Colaborador Homenageado",
    defaultText: "Em reconhecimento à sua valiosa cooperação técnica e operacional e ao precioso trabalho voluntário prestado durante o processo de estruturação e fundação da Banda Sinfônica Nacional, expressando nossos sinceros agradecimentos pela parceria e dedicação que tornaram possíveis as realizações e os espetáculos desta instituição em seu primeiro aniversário.",
  },
  fundacao: {
    title: "Apoio na Fundação",
    defaultText: "Em reconhecimento e profunda gratidão pelo seu precioso trabalho voluntário prestado durante o processo de realização e estruturação que viabilizou o surgimento da Banda Sinfônica Nacional, expressando nossa sincera admiração pelo engajamento, dedicação e generosidade ofertados a este projeto musical.",
  },
  custom: {
    title: "Texto Customizado",
    defaultText: "Escreva aqui o texto de homenagem personalizado para o certificado da Banda Sinfônica Nacional...",
  }
};

export function CertificateGenerator() {
  const [recipientName, setRecipientName] = useState("Carolyn R. Luthier");
  const [category, setCategory] = useState<CertificateCategory>("musico");
  const [customText, setCustomText] = useState("");
  const [dateText, setDateText] = useState("Rio de Janeiro, 17 de julho de 2026");
  const [theme, setTheme] = useState<CertificateTheme>("saver"); // default to cream/papiro classic
  
  const [sig1Name, setSig1Name] = useState("Geyzi Moreira");
  const [sig1Role, setSig1Role] = useState("Diretora Artística");
  const [sig2Name, setSig2Name] = useState("Roberto Weingrill Jr.");
  const [sig2Role, setSig2Role] = useState("Presidente — Weril");

  // Prepress and layout controls
  const [isSingleSig, setIsSingleSig] = useState(true);
  const [isCropMarks, setIsCropMarks] = useState(false);
  const [aspectRatioMode, setAspectRatioMode] = useState<"a4" | "16_9">("a4");

  // Synchronize preset text when category changes
  useEffect(() => {
    if (category !== "custom") {
      setCustomText(CATEGORY_PRESETS[category].defaultText);
    }
  }, [category]);

  const handlePrint = () => {
    window.print();
  };

  const resetFields = () => {
    setRecipientName("Carolyn R. Luthier");
    setCategory("musico");
    setCustomText(CATEGORY_PRESETS.musico.defaultText);
    setDateText("Rio de Janeiro, 17 de julho de 2026");
    setTheme("saver");
    setSig1Name("Geyzi Moreira");
    setSig1Role("Diretora Artística");
    setSig2Name("Roberto Weingrill Jr.");
    setSig2Role("Presidente — Weril");
    setIsSingleSig(true);
    setIsCropMarks(false);
    setAspectRatioMode("a4");
  };

  const isNavy = theme === "navy";

  // Prepress dimensions (mm)
  const baseWidth = 297; // A4 width is 297mm
  const baseHeight = aspectRatioMode === "16_9" ? 167.06 : 210; // A4 height is 210mm, 16:9 height is 167mm
  const bleedVal = 3; // 3mm bleed margin
  
  const printWidth = isCropMarks ? baseWidth + (bleedVal * 2) : baseWidth;
  const printHeight = isCropMarks ? baseHeight + (bleedVal * 2) : baseHeight;

  // On-screen dimensions (px)
  const is169 = aspectRatioMode === "16_9";
  const canvasWidth = 840;
  const canvasHeight = is169 ? 472.5 : 594;
  const bleedPadding = isCropMarks ? 15 : 0;
  
  const outerWidth = canvasWidth + (bleedPadding * 2);
  const outerHeight = canvasHeight + (bleedPadding * 2);

  return (
    <div className="w-full min-h-screen flex bg-slate-950 text-slate-100 print:bg-transparent print:text-black">
      {/* 1. DYNAMIC HEAD IMPORT FOR FONTS & PRINT STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @media print {
          @page {
            size: ${printWidth}mm ${printHeight}mm landscape;
            margin: 0;
          }

          /* Tell the browser to preserve ALL colors globally — without this, 
             browsers override every color to black/white to save ink */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Force background color on entire printed page */
          html, body {
            width: ${printWidth}mm !important;
            height: ${printHeight}mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background-color: ${isNavy ? BSN_NAVY : "#faf6ee"} !important;
          }
          
          /* Hide all page wrappers */
          #__next, #root, main {
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            min-height: 0 !important;
          }

          /* Hide sidebar and everything except the canvas */
          .print-hidden-sidebar, .print-hide {
            display: none !important;
          }

          /* The flex wrapper around the canvas */
          .certificate-preview-area {
            padding: 0 !important;
            background: transparent !important;
            display: block !important;
            width: ${printWidth}mm !important;
            height: ${printHeight}mm !important;
          }

          /* The outermost canvas container fills the full page */
          .certificate-canvas-container {
            width: ${printWidth}mm !important;
            height: ${printHeight}mm !important;
            margin: 0 !important;
            padding: ${isCropMarks ? "3mm" : "0"} !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            background-color: ${isNavy ? BSN_NAVY : "#faf6ee"} !important;
          }
          
          /* The inner certificate canvas — force base text color so 
             elements using 'inherit' or no explicit color get the right value */
          .certificate-inner-canvas {
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            color: ${isNavy ? "#ffffff" : "#031529"} !important;
            background-color: ${isNavy ? BSN_NAVY : "#faf6ee"} !important;
          }

          /* All descendants must inherit and not get overridden to black */
          .certificate-inner-canvas * {
            color: inherit;
          }

          .certificate-canvas-content {
            padding: 18mm !important;
          }
        }
      `}} />

      {/* 2. CONTROL PANEL SIDEBAR (Hidden during print) */}
      <div className="w-[360px] bg-slate-900 border-r border-slate-800 flex flex-col p-6 shrink-0 print-hidden-sidebar z-20 overflow-y-auto max-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#e0a020]/20 text-[#f5c842]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase leading-none">BSN Certificados</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">1 Ano de Conexões Sinfônicas</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5 mt-2">
          
          {/* Theme selection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842]">Estilo de Fundo</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => setTheme("navy")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  isNavy 
                    ? "bg-[#031529] border-[#e0a020] text-[#f5c842] shadow" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Marinho Premium
              </button>
              <button
                onClick={() => setTheme("saver")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  !isNavy 
                    ? "bg-[#faf6ee] border-[#e0a020] text-slate-800 shadow" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Papiro Clássico
              </button>
            </div>
          </div>

          {/* Format selection (A4 vs 16:9) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842]">Formato do Papel</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => setAspectRatioMode("a4")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  aspectRatioMode === "a4"
                    ? "bg-[#e0a020] border-[#e0a020] text-slate-950 shadow" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                A4 Paisagem
              </button>
              <button
                onClick={() => setAspectRatioMode("16_9")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  aspectRatioMode === "16_9"
                    ? "bg-[#e0a020] border-[#e0a020] text-slate-950 shadow" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                Digital 16:9
              </button>
            </div>
          </div>

          {/* Prepress (Crop Marks and Bleed) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842]">Preparo Gráfico (Prepress)</span>
            <label className="flex items-center gap-2.5 mt-1 cursor-pointer bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-all select-none">
              <input
                type="checkbox"
                checked={isCropMarks}
                onChange={(e) => setIsCropMarks(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-[#e0a020] focus:ring-[#e0a020] bg-slate-900"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">Marcas de Corte & Sangria</span>
                <span className="text-[9px] text-slate-450 mt-0.5">Adiciona 3mm e guias de impressão</span>
              </div>
            </label>
          </div>

          {/* Recipient Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Nome do Homenageado
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e0a020] placeholder-slate-500"
              placeholder="Digite o nome completo..."
            />
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Categoria do Certificado
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CertificateCategory)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e0a020]"
            >
              <option value="musico" className="bg-slate-900 text-white">Músico Homenageado</option>
              <option value="apoiador" className="bg-slate-900 text-white">Apoiador Institucional</option>
              <option value="colaborador" className="bg-slate-900 text-white">Colaborador Técnico</option>
              <option value="fundacao" className="bg-slate-900 text-white">Apoio na Fundação</option>
              <option value="custom" className="bg-slate-900 text-white">Texto Customizado</option>
            </select>
          </div>

          {/* Description Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Texto da Homenagem
            </label>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e0a020] resize-none leading-relaxed placeholder-slate-500"
              placeholder="Descreva a razão da homenagem..."
            />
          </div>

          {/* Date Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Local e Data
            </label>
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e0a020]"
            />
          </div>

          {/* Signatures Settings */}
          <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5" /> Assinaturas
              </span>
              <div className="flex gap-1.5 bg-slate-950 p-1 rounded-md border border-slate-800">
                <button
                  onClick={() => setIsSingleSig(true)}
                  className={`px-2 py-0.5 text-[9px] font-extrabold rounded transition-all ${
                    isSingleSig ? "bg-[#e0a020] text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Única
                </button>
                <button
                  onClick={() => setIsSingleSig(false)}
                  className={`px-2 py-0.5 text-[9px] font-extrabold rounded transition-all ${
                    !isSingleSig ? "bg-[#e0a020] text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Duas
                </button>
              </div>
            </div>

            {/* Signature 1 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 font-bold">Assinatura 1</span>
                <input
                  type="text"
                  value={sig1Name}
                  onChange={(e) => setSig1Name(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#e0a020]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 font-bold">Cargo 1</span>
                <input
                  type="text"
                  value={sig1Role}
                  onChange={(e) => setSig1Role(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#e0a020]"
                />
              </div>
            </div>

            {/* Signature 2 (Only active if isSingleSig is false) */}
            {!isSingleSig && (
              <div className="grid grid-cols-2 gap-2 transition-all duration-300">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold">Assinatura 2</span>
                  <input
                    type="text"
                    value={sig2Name}
                    onChange={(e) => setSig2Name(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#e0a020]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold">Cargo 2</span>
                  <input
                    type="text"
                    value={sig2Role}
                    onChange={(e) => setSig2Role(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#e0a020]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handlePrint}
              className="w-full bg-[#e0a020] text-slate-950 font-extrabold hover:bg-[#f5c842] active:scale-95 transition-all py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#e0a020]/10"
            >
              <Printer className="w-4 h-4" /> Imprimir / Salvar A4
            </button>
            
            <button
              onClick={resetFields}
              className="w-full bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 transition-all py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões
            </button>
          </div>

        </div>

      {/* 3. CERTIFICATE CANVAS WRAPPER (Landscape Preview) */}
      <div className="certificate-preview-area flex-1 flex items-center justify-center p-8 bg-slate-950 overflow-auto print:p-0 print:bg-transparent">
        
        {/* Prepress Outer Wrapper with Crop Marks if active */}
        <div
          className="relative shrink-0 flex items-center justify-center certificate-canvas-container"
          style={{
            width: outerWidth,
            height: outerHeight,
            padding: bleedPadding,
            background: isCropMarks ? (isNavy ? BSN_DARK_BLUE : "#faf6ee") : "transparent",
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
              
              {/* Cut Line Visual Overlay (Red Dashed) - screen only */}
              <div className="absolute inset-[15px] border border-dashed border-red-500/30 pointer-events-none z-30 print:hidden" />
            </>
          )}

          {/* Actual Certificate Card Canvas */}
          <div
            className="certificate-inner-canvas relative overflow-hidden w-full h-full flex flex-col justify-between"
            style={{
              background: isNavy ? BSN_NAVY : "#faf6ee",
              border: isNavy ? `1px solid ${BSN_GOLD}33` : "1px solid #cfb53b55",
              boxShadow: isCropMarks ? "none" : "0 25px 65px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03)",
              color: isNavy ? "#ffffff" : "#031529",
              transition: "all 0.3s ease",
              padding: is169 ? "32px 48px" : "48px",
            }}
          >
          {/* Subtle watermark background lines */}
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
            style={{ opacity: isNavy ? 0.1 : 0.08 }}
          >
            <img src={BSN_LOGO} alt="Watermark BSN" className="w-[520px] h-[520px] object-contain" />
          </div>

          {/* ── BORDERS & MARGINS ── */}
          {/* Outer elegant gold border with corner flourishes */}
          <div 
            className="absolute inset-4 pointer-events-none border border-double"
            style={{
              borderColor: isNavy ? `${BSN_GOLD}aa` : "#b8860b",
              borderWidth: "3px",
            }}
          />
          {/* Inner thin gold accent border */}
          <div 
            className="absolute inset-7 pointer-events-none border opacity-60"
            style={{
              borderColor: isNavy ? BSN_GOLD_LIGHT : "#cfb53b",
              borderWidth: "1px",
            }}
          />

          {/* Corner flourish visual frames (Aesthetic vectors) */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: BSN_GOLD }} />

          {/* ── CERTIFICATE HEADER ── */}
          <div className="flex flex-col items-center text-center mt-1 z-10">
            <img
              src={BSN_LOGO}
              alt="BSN Logo"
              className="h-20 object-contain mb-2.5"
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

          {/* ── MAIN CONTENT LAYER ── */}
          <div className="flex flex-col items-center text-center my-auto py-2 z-10">
            
            {/* Main Certificate Title using Cinzel serif font */}
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

            {/* Recipient's Name - very large and premium */}
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

            {/* Certificate description text */}
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

          {/* ── FOOTER LAYER (Signatures, Date, Seal) ── */}
          <div className="grid grid-cols-3 items-end w-full z-10">
            {isSingleSig ? (
              <>
                {/* Left side: Date Text */}
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
                    className="h-10 text-[22px] font-normal leading-none mb-1 flex items-center justify-center select-none"
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

                {/* Right side: 1-Year Anniversary Gold Emblem */}
                <div className="flex flex-col items-center justify-center mb-1">
                  <div 
                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center border relative"
                    style={{
                      borderColor: isNavy ? BSN_GOLD : "#b8860b",
                      background: isNavy ? `radial-gradient(circle, ${BSN_LIGHT_NAVY} 0%, ${BSN_DARK_BLUE} 100%)` : "#faf6ee",
                      boxShadow: isNavy ? `0 4px 15px rgba(0,0,0,0.3), inset 0 0 8px ${BSN_GOLD}33` : "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="absolute inset-0.5 rounded-full border border-dashed opacity-40" style={{ borderColor: BSN_GOLD }} />
                    <span className="text-[5.5px] font-black uppercase tracking-widest" style={{ color: BSN_GOLD_LIGHT }}>
                      BSN
                    </span>
                    <span className="text-[12px] font-extrabold uppercase tracking-tighter leading-none" style={{ color: BSN_GOLD }}>
                      1º Ano
                    </span>
                    <span className="text-[5px] font-black tracking-widest uppercase leading-none mt-0.5" style={{ color: BSN_GOLD_LIGHT }}>
                      2025-2026
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left side: Signature 1 */}
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="h-10 text-[22px] font-normal leading-none mb-1 flex items-center justify-center select-none"
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

                {/* Center: Gold Emblem + Date */}
                <div className="flex flex-col items-center justify-center mb-1">
                  <div 
                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center border relative"
                    style={{
                      borderColor: isNavy ? BSN_GOLD : "#b8860b",
                      background: isNavy ? `radial-gradient(circle, ${BSN_LIGHT_NAVY} 0%, ${BSN_DARK_BLUE} 100%)` : "#faf6ee",
                      boxShadow: isNavy ? `0 4px 15px rgba(0,0,0,0.3), inset 0 0 8px ${BSN_GOLD}33` : "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div className="absolute inset-0.5 rounded-full border border-dashed opacity-40" style={{ borderColor: BSN_GOLD }} />
                    <span className="text-[5.5px] font-black uppercase tracking-widest" style={{ color: BSN_GOLD_LIGHT }}>
                      BSN
                    </span>
                    <span className="text-[12px] font-extrabold uppercase tracking-tighter leading-none" style={{ color: BSN_GOLD }}>
                      1º Ano
                    </span>
                    <span className="text-[5px] font-black tracking-widest uppercase leading-none mt-0.5" style={{ color: BSN_GOLD_LIGHT }}>
                      2025-2026
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-center mt-2.5" 
                        style={{ 
                          color: isNavy ? BSN_GOLD_LIGHT : "#5c4008",
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                    {dateText}
                  </span>
                </div>

                {/* Right side: Signature 2 */}
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="h-10 text-[22px] font-normal leading-none mb-1 flex items-center justify-center select-none"
                    style={{ 
                      fontFamily: "'Great Vibes', cursive", 
                      color: isNavy ? BSN_GOLD_LIGHT : "#1e293b",
                      opacity: 0.85
                    }}
                  >
                    {sig2Name}
                  </div>
                  <div className="w-[160px] h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
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

  </div>
  );
}
