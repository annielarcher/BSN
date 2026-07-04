import React from "react";
import { Award, Calendar, Download, Feather, FileText, RotateCcw, User } from "lucide-react";
import { CertificateCategory, CertificateTheme, CATEGORY_PRESETS } from "./types";

interface CertificateSidebarProps {
  recipientName: string;
  setRecipientName: (val: string) => void;
  category: CertificateCategory;
  setCategory: (val: CertificateCategory) => void;
  customText: string;
  setCustomText: (val: string) => void;
  dateText: string;
  setDateText: (val: string) => void;
  theme: CertificateTheme;
  setTheme: (val: CertificateTheme) => void;
  sig1Name: string;
  setSig1Name: (val: string) => void;
  sig1Role: string;
  setSig1Role: (val: string) => void;
  sig2Name: string;
  setSig2Name: (val: string) => void;
  sig2Role: string;
  setSig2Role: (val: string) => void;
  isSingleSig: boolean;
  setIsSingleSig: (val: boolean) => void;
  aspectRatioMode: "a4" | "16_9";
  setAspectRatioMode: (val: "a4" | "16_9") => void;
  setIsCropMarks: (val: boolean) => void;
  isExporting: boolean;
  onExportPDF: () => void;
  onResetFields: () => void;
}

export function CertificateSidebar({
  recipientName,
  setRecipientName,
  category,
  setCategory,
  customText,
  setCustomText,
  dateText,
  setDateText,
  theme,
  setTheme,
  sig1Name,
  setSig1Name,
  sig1Role,
  setSig1Role,
  sig2Name,
  setSig2Name,
  sig2Role,
  setSig2Role,
  isSingleSig,
  setIsSingleSig,
  aspectRatioMode,
  setAspectRatioMode,
  setIsCropMarks,
  isExporting,
  onExportPDF,
  onResetFields,
}: CertificateSidebarProps) {
  const isNavy = theme === "navy";

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-900/60 p-5 flex flex-col gap-6 overflow-y-auto shrink-0 print:hidden text-slate-200">
      
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#e0a020]" />
          <h1 className="font-extrabold text-sm tracking-wide text-slate-100">Gerador de Certificados</h1>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        
        {/* Style Selection (Navy vs Cream) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842]">Estilo de Fundo</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
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
              type="button"
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

        {/* Paper Format Selection (A4 vs 16:9) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842]">Formato do Papel</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                setAspectRatioMode("a4");
                setIsCropMarks(true);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                aspectRatioMode === "a4"
                  ? "bg-[#e0a020] border-[#e0a020] text-slate-950 shadow" 
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              PDF Gráfica (A4)
            </button>
            <button
              type="button"
              onClick={() => {
                setAspectRatioMode("16_9");
                setIsCropMarks(false);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                aspectRatioMode === "16_9"
                  ? "bg-[#e0a020] border-[#e0a020] text-slate-950 shadow" 
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              Modo Digital (16:9)
            </button>
          </div>
        </div>

        {/* Input: Recipient Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
            <User className="w-3 h-3" /> Nome do Homenageado
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Ex: Carolyn R. Luthier"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020] transition-colors"
          />
        </div>

        {/* Input: Category Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Categoria do Certificado
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CertificateCategory)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020] transition-colors"
          >
            {(Object.keys(CATEGORY_PRESETS) as CertificateCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_PRESETS[cat].title}
              </option>
            ))}
          </select>
        </div>

        {/* Input: Custom Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Texto da Homenagem
          </label>
          <textarea
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020] transition-colors leading-relaxed resize-none"
          />
        </div>

        {/* Input: Date and Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Local e Data
          </label>
          <input
            type="text"
            value={dateText}
            onChange={(e) => setDateText(e.target.value)}
            placeholder="Ex: Rio de Janeiro, 17 de julho de 2026"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020] transition-colors"
          />
        </div>

        {/* Signatures Settings */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c842] flex items-center gap-1.5">
              <Feather className="w-3 h-3" /> Assinaturas
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setIsSingleSig(true)}
                className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                  isSingleSig ? "bg-[#e0a020] text-slate-950" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Única
              </button>
              <button
                type="button"
                onClick={() => setIsSingleSig(false)}
                className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                  !isSingleSig ? "bg-[#e0a020] text-slate-950" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Duas
              </button>
            </div>
          </div>

          {/* Signature 1 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8.5px] font-bold text-slate-400 block mb-1">Assinatura 1</label>
              <input
                type="text"
                value={sig1Name}
                onChange={(e) => setSig1Name(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020]"
              />
            </div>
            <div>
              <label className="text-[8.5px] font-bold text-slate-400 block mb-1">Cargo 1</label>
              <input
                type="text"
                value={sig1Role}
                onChange={(e) => setSig1Role(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020]"
              />
            </div>
          </div>

          {/* Signature 2 (if active) */}
          {!isSingleSig && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label className="text-[8.5px] font-bold text-slate-400 block mb-1">Assinatura 2</label>
                <input
                  type="text"
                  value={sig2Name}
                  onChange={(e) => setSig2Name(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020]"
                />
              </div>
              <div>
                <label className="text-[8.5px] font-bold text-slate-400 block mb-1">Cargo 2</label>
                <input
                  type="text"
                  value={sig2Role}
                  onChange={(e) => setSig2Role(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#e0a020]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={onExportPDF}
            disabled={isExporting}
            className="w-full bg-blue-600 text-white font-extrabold hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 active:scale-95 transition-all py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/10"
          >
            {isExporting ? (
              <>Gerando PDF CMYK...</>
            ) : (
              <>
                <Download className="w-4 h-4" /> Baixar PDF Gráfica (CMYK)
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onResetFields}
            className="w-full bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white active:scale-95 transition-all py-2 rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões
          </button>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
          💡 <strong>Dica Gráfica:</strong> O botão azul gera um arquivo PDF configurado com margens CMYK e fontes tipográficas embarcadas para impressão profissional.
        </div>

      </div>
    </div>
  );
}
