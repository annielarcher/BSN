"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

// ─── DATA & CONSTANTS ────────────────────────────────────────────────────────
const GUESTS = [
  { name: "Bina\nGoldrajch",   role: "MEZZO SOPRANO", photo: "/Bina Goldrajch.jpeg" },
  { name: "Nadja\nDaltro",     role: "SOPRANO",        photo: "/nadja-daltro.jpeg"  },
  { name: "Wladimir\nCabanas", role: "TENOR",          photo: "/wladimir-cabanas.jpeg" },
  { name: "Brazilian\nPiper",  role: "BANDA",               photo: "/brazilian-piper.jpeg" },
];

const ORCHESTRA_IMG = "/Images/bsn-hero.jpg";
const TMRJ_LOGO     = "/TMRJ/Horizontal Dourado.png";

type Format = "feed" | "stories" | "theatro" | "sales" | "cartaz" | "totem" | "legenda" | "a4_street";
type ColorPalette = "vermelho" | "obsidian_dourado";
type PhotoVariant = "com_foto" | "sem_foto";
type Concept = "coluna" | "hero";

const FORMATS: Record<Format, { label: string; w: number; h: number; filename: string }> = {
  feed:      { label: "01. Feed Instagram (1080 × 1350)",  w: 1080, h: 1350, filename: "01. BSN_feed_1080x1350" },
  stories:   { label: "02. Stories / Reels (1080 × 1920)", w: 1080, h: 1920, filename: "02. BSN_stories_1080x1920" },
  theatro:   { label: "03. Site do Theatro (1024 × 717)",  w: 1024, h: 717,  filename: "03. BSN_hero_theatro_1024x717" },
  sales:     { label: "04. Site de Vendas (800 × 800)",    w: 800,  h: 800,  filename: "04. BSN_hero_vendas_800x800" },
  cartaz:    { label: "05. Cartaz de Pedra (59 × 98 cm)",  w: 590,  h: 980,  filename: "05. BSN_cartaz_59x98cm" },
  totem:     { label: "06. Totem Digital (533 × 1094)",    w: 533,  h: 1094, filename: "06. BSN_totem_533x1024" },
  legenda:   { label: "07. Legenda / Banner (768 × 256)",  w: 768,  h: 256,  filename: "07. BSN_legenda_768x256" },
  a4_street: { label: "08. Cartaz A4 Rua (21 × 29.7 cm)",  w: 1240, h: 1754, filename: "08. BSN_cartaz_A4_rua_1240x1754" },
};

let cachedFontEmbedCSS: string | null = null;

async function getFontEmbedCSS(): Promise<string> {
  if (typeof window === "undefined") return "";
  if (cachedFontEmbedCSS) return cachedFontEmbedCSS;
  try {
    const fontRes = await fetch("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:wght@600;700&family=Barlow:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Pinyon+Script&display=swap");
    let cssText = await fontRes.text();
    const matches = Array.from(cssText.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g));
    for (const m of matches) {
      const fontUrl = m[1];
      try {
        const fRes = await fetch(fontUrl);
        const blob = await fRes.blob();
        const base64 = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.readAsDataURL(blob);
        });
        cssText = cssText.replaceAll(fontUrl, base64);
      } catch {}
    }
    cachedFontEmbedCSS = cssText;
    return cssText;
  } catch {
    return "";
  }
}

export default function ArteAssyrioPage() {
  const [format, setFormat] = useState<Format>("feed");
  const [palette, setPalette] = useState<ColorPalette>("vermelho");
  const [variant, setVariant] = useState<PhotoVariant>("com_foto");
  const [concept, setConcept] = useState<Concept>("coluna");
  const [isExporting, setIsExporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(700);
  const [showSafeZone, setShowSafeZone] = useState(false);

  const previewBoxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const spec = FORMATS[format];

  useEffect(() => {
    // Pre-fetch Google Fonts in background on mount to avoid network delay during exports
    getFontEmbedCSS();

    const handleResize = () => {
      if (previewBoxRef.current) {
        setContainerWidth(previewBoxRef.current.clientWidth - 48);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = Math.min((containerWidth > 0 ? containerWidth : 650) / spec.w, 0.7);

  const handleExport = async (exportType: "png" | "pdf") => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      // Ensure all web fonts are fully loaded into browser memory
      if (document.fonts) {
        await document.fonts.ready;
      }

      let htmlToImage: any;
      try {
        htmlToImage = await import("html-to-image");
      } catch {
        if (!(window as any).htmlToImage) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        htmlToImage = (window as any).htmlToImage;
      }

      const renderFn = htmlToImage.toPng || (htmlToImage as any).default?.toPng;
      const renderJpegFn = htmlToImage.toJpeg || (htmlToImage as any).default?.toJpeg;
      // Target scale 1.5x gives crisp high-definition output while keeping file sizes lightweight (~1.5MB - 3MB)
      const targetMultiplier = 1.5;
      const targetPixelRatio = targetMultiplier / scale;

      // Use pre-cached Google Fonts CSS with base64 embedded woff2 fonts
      const fontEmbedCSS = await getFontEmbedCSS();

      const exportOptions = {
        pixelRatio: targetPixelRatio,
        canvasWidth: Math.round(spec.w * targetMultiplier),
        canvasHeight: Math.round(spec.h * targetMultiplier),
        cacheBust: true,
        backgroundColor: palette === "vermelho" ? "#A8081C" : "#0C0A07",
        fontEmbedCSS,
      };

      if (exportType === "png") {
        const dataUrl = await renderFn(canvasRef.current, exportOptions);
        const link = document.createElement("a");
        link.download = `${spec.filename}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const dataUrl = await renderJpegFn(canvasRef.current, { ...exportOptions, quality: 1.0 });
        const { jsPDF } = await import("jspdf");
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const pdf = new jsPDF({
          orientation: img.width > img.height ? "landscape" : "portrait",
          unit: "px",
          format: [img.width, img.height],
        });
        pdf.addImage(dataUrl, "JPEG", 0, 0, img.width, img.height);
        pdf.save(`${spec.filename}.pdf`);
      }
    } catch (err) {
      console.error("Erro ao exportar UHD:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBatchExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setBatchProgress("Iniciando lote (0/7)...");
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      let htmlToImage: any;
      try {
        htmlToImage = await import("html-to-image");
      } catch {
        if (!(window as any).htmlToImage) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        htmlToImage = (window as any).htmlToImage;
      }

      let JSZip: any;
      try {
        JSZip = (await import("jszip")).default || (await import("jszip"));
      } catch {
        if (!(window as any).JSZip) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        JSZip = (window as any).JSZip;
      }

      const renderFn = htmlToImage.toPng || (htmlToImage as any).default?.toPng;
      const fontEmbedCSS = await getFontEmbedCSS();

      const zip = new JSZip();
      const formatKeys = Object.keys(FORMATS) as Format[];

      for (let i = 0; i < formatKeys.length; i++) {
        const fmt = formatKeys[i];
        const itemSpec = FORMATS[fmt];
        setBatchProgress(`Gerando (${i + 1}/7) ${itemSpec.filename}...`);

        setFormat(fmt);
        await new Promise((r) => setTimeout(r, 160));

        const itemScale = Math.min((containerWidth > 0 ? containerWidth : 650) / itemSpec.w, 0.7);
        const targetMultiplier = 1.5;
        const targetPixelRatio = targetMultiplier / itemScale;

        const options = {
          pixelRatio: targetPixelRatio,
          canvasWidth: Math.round(itemSpec.w * targetMultiplier),
          canvasHeight: Math.round(itemSpec.h * targetMultiplier),
          cacheBust: true,
          backgroundColor: palette === "vermelho" ? "#A8081C" : "#0C0A07",
          fontEmbedCSS,
        };

        const dataUrl = await renderFn(canvasRef.current, options);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`${itemSpec.filename}.png`, base64Data, { base64: true });
      }

      setBatchProgress("Compactando ZIP...");
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `BSN_Classicos_Mundiais_Todos_Formatos_UHD.zip`;
      link.click();
    } catch (err) {
      console.error("Erro no download em lote:", err);
    } finally {
      setIsExporting(false);
      setBatchProgress(null);
    }
  };

  return (
    <div style={{
      background: "#0a0b10",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "'Barlow', 'Inter', sans-serif",
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:wght@600;700&family=Barlow:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Pinyon+Script&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#12141c]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-red-500 uppercase">
            {concept === "coluna" ? "Conceito A — Coluna Monumental" : "Conceito B — Hero Full Bleed"}
          </p>
          <h1 className="text-base md:text-lg font-black text-white tracking-tight">
            Clássicos Mundiais — Salão Assyrio TMRJ · 28 Set 2026
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <Button
            onClick={handleBatchExport}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl gap-2 flex-1 sm:flex-none"
          >
            <Download size={16} />
            {batchProgress || "Baixar Todos (ZIP)"}
          </Button>
          <Button
            onClick={() => handleExport("png")}
            disabled={isExporting}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold shadow-lg gap-2 flex-1 sm:flex-none border border-white/20"
          >
            <Download size={16} />
            {isExporting && !batchProgress ? "Gerando..." : "PNG Formato Atual"}
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg gap-2 flex-1 sm:flex-none"
          >
            <Download size={16} />
            {isExporting && !batchProgress ? "Gerando..." : "PDF Formato Atual"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-8 items-start">

        {/* CONTROLS */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-5">

          {/* Concept selector */}
          <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">
              Conceito Visual
            </label>
            <div className="flex flex-col gap-2">
              {([
                ["coluna", "A — Coluna Monumental", "Faixa branca vertical, data rotacionada, parede monocromática"],
                ["hero",   "B — Hero Full Bleed",   "Foto de palco a sangue, título flutuante, strip de convidados"],
              ] as [Concept, string, string][]).map(([c, label, desc]) => (
                <button key={c} onClick={() => setConcept(c)} className={`px-4 py-3 rounded-lg border text-left transition-all ${
                  concept === c ? "border-red-600 bg-red-600/10 text-white" : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                }`}>
                  <div className="text-xs font-bold mb-0.5">{label}</div>
                  <div className="text-[11px] opacity-60 leading-snug">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Palette */}
          <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">
              Paleta de Cores
            </label>
            <div className="flex flex-col gap-2">
              {([
                ["vermelho", "Vermelho Ópera (#B00A1E)"],
                ["obsidian_dourado", "Obsidian / Preto + Dourado (#0C0A07)"],
              ] as [ColorPalette, string][]).map(([p, label]) => (
                <button key={p} onClick={() => setPalette(p)} className={`px-4 py-2.5 rounded-lg border text-xs text-left font-medium transition-all ${
                  palette === p ? "border-red-600 bg-red-600/10 text-white font-bold" : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo (only for concept A) */}
          {concept === "coluna" && (
            <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">
                Placa / Foto (Conceito A)
              </label>
              <div className="flex flex-col gap-2">
                {([
                  ["com_foto", "Com Placa de Foto Enquadrada"],
                  ["sem_foto", "Sem Foto (Apenas Tipografia)"],
                ] as [PhotoVariant, string][]).map(([v, label]) => (
                  <button key={v} onClick={() => setVariant(v)} className={`px-4 py-2.5 rounded-lg border text-xs text-left font-medium transition-all ${
                    variant === v ? "border-red-600 bg-red-600/10 text-white font-bold" : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                  }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Format */}
          <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">
              Dimensão / Peça
            </label>
            <div className="flex flex-col gap-2">
              {(Object.entries(FORMATS) as [Format, typeof FORMATS[Format]][]).map(([f, meta]) => (
                <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2.5 rounded-lg border text-xs text-left transition-all ${
                  format === f ? "border-red-600 bg-red-600 text-white font-black" : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                }`}>
                  {meta.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <Button
                onClick={handleBatchExport}
                disabled={isExporting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg gap-2 py-2.5"
              >
                <Download size={14} />
                {batchProgress || "Baixar Todos (7 Artes em ZIP)"}
              </Button>
            </div>
          </div>

          {/* Safe Zone Warning — only for "sales" format */}
          {format === "sales" && (
            <div className="bg-[#0a1628] border border-blue-400/40 rounded-xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-sm bg-blue-400/60 shrink-0" />
                <label className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                  Zona Segura — Site de Vendas
                </label>
              </div>
              <ul className="text-[11px] text-zinc-300 space-y-1.5 mb-4 leading-snug">
                <li>✅ Resolução mínima: <strong>800 × 800 px</strong></li>
                <li>🚫 Não coloque textos/logos nas <strong>faixas azuis</strong> (topo, rodapé e lateral direita) — podem ficar ocultos ou cortados</li>
                <li>✅ Zona segura: área central branca (~14% a 54% de altura, até 72% da largura)</li>
              </ul>
              <button
                onClick={() => setShowSafeZone(v => !v)}
                className={`w-full px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                  showSafeZone
                    ? "border-blue-400 bg-blue-400/20 text-blue-200"
                    : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                }`}
              >
                {showSafeZone ? "🔵 Ocultar guia de zona segura" : "🔵 Exibir guia de zona segura"}
              </button>
            </div>
          )}

        </aside>

        {/* CANVAS */}
        <section className="flex-1 w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-zinc-400 uppercase tracking-widest font-mono">
            <span>{spec.label}</span>
            <span>Escala {Math.round(scale * 100)}%</span>
          </div>

          <div
            ref={previewBoxRef}
            className="w-full bg-[#050608] border border-white/10 rounded-2xl p-4 sm:p-8 flex items-center justify-center min-h-[500px] overflow-hidden shadow-2xl"
          >
            <div
              ref={canvasRef}
              style={{
                width: spec.w * scale,
                height: spec.h * scale,
                flexShrink: 0,
                boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.2s ease-out",
              }}
            >
              {concept === "coluna" ? (
                <MonumentalColumnCanvas scale={scale} format={format} palette={palette} variant={variant} spec={spec} />
              ) : (
                <HeroFullBleedCanvas scale={scale} format={format} palette={palette} spec={spec} />
              )}

              {/* SAFE ZONE OVERLAY — preview only, does NOT export */}
              {format === "sales" && showSafeZone && (
                <div style={{ position: "absolute", inset: 0, zIndex: 999, pointerEvents: "none" }}>
                  {/* Top unsafe band — 14% */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "14%", background: "rgba(100,149,237,0.45)", borderBottom: "1.5px dashed rgba(100,149,237,0.9)" }} />
                  {/* Bottom unsafe band — bottom 46% */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "46%", background: "rgba(100,149,237,0.45)", borderTop: "1.5px dashed rgba(100,149,237,0.9)" }} />
                  {/* Right unsafe notch — x > 72%, y 14–30% */}
                  <div style={{ position: "absolute", top: "14%", right: 0, width: "28%", height: "17%", background: "rgba(100,149,237,0.45)", borderLeft: "1.5px dashed rgba(100,149,237,0.9)", borderBottom: "1.5px dashed rgba(100,149,237,0.9)" }} />
                  {/* SAFE ZONE label */}
                  <div style={{ position: "absolute", top: "14%", left: 0, width: "72%", height: "26%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ border: "1.5px solid rgba(255,255,255,0.5)", padding: "4px 10px", fontSize: Math.max(9, spec.w * scale * 0.014), fontFamily: "monospace", color: "rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.35)", borderRadius: 3, letterSpacing: 1 }}>ZONA SEGURA</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEITO A — COLUNA MONUMENTAL
// ─────────────────────────────────────────────────────────────────────────────
function MonumentalColumnCanvas({ scale, format, palette, variant, spec }: {
  scale: number; format: Format; palette: ColorPalette; variant: PhotoVariant; spec: { w: number; h: number };
}) {
  const s = (v: number) => Math.round(v * scale * 10) / 10;
  const isRed = palette === "vermelho";
  const bgMainColor = isRed ? "#CE0C22" : "#0C0A07";
  const accentColor = isRed ? "#CE0C22" : "#B8860B";
  const isLandscape = spec.w > spec.h;
  const isSquare    = spec.w === spec.h;
  const isUltraWide = isLandscape && (spec.w / spec.h) > 2.5;
  const isTotem     = !isLandscape && !isSquare && (spec.w / spec.h) < 0.55;
  const isStories   = !isLandscape && !isSquare && spec.h >= 1800;
  const isCartaz    = format === "cartaz" || format === "a4_street";
  const leftWidthPct  = isLandscape ? "52%" : isSquare ? "48%" : "54%";
  const rightWidthPct = isLandscape ? "42%" : isSquare ? "46%" : "40%";
  const bsr = isUltraWide ? spec.h / 256
            : isLandscape ? spec.h / 756
            : isSquare    ? spec.h / 900
            :               spec.h / 1350;
  const tScale = isTotem ? 0.82 : 1.0;
  // Format scale: Second pass boost across all formats
  const fScale = isUltraWide ? 1.0
               : isLandscape  ? 1.45  // +45% boost for landscape
               : isTotem      ? 1.12  // +12% boost for totem
               : isStories    ? 1.15  // +15% boost for stories
               : isSquare     ? 1.30  // +30% boost for square
               :                1.40; // +40% boost for feed & cartaz

  return (
    <div style={{ width: "100%", height: "100%", background: bgMainColor, position: "relative", fontFamily: "'Barlow', sans-serif", color: "#fff", overflow: "hidden" }}>
      {/* TEXTURE */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 10%, rgba(255,255,255,0.05), transparent 40%), radial-gradient(circle at 90% 95%, rgba(0,0,0,0.18), transparent 45%)", pointerEvents: "none" }} />
      {/* SPOTLIGHT */}
      <div style={{ position: "absolute", top: 0, left: "10%", width: "45%", height: "75%", background: isRed ? "conic-gradient(from 260deg at 50% 0%, transparent 0deg, rgba(255,220,140,0.09) 18deg, rgba(255,200,80,0.04) 30deg, transparent 42deg)" : "conic-gradient(from 260deg at 50% 0%, transparent 0deg, rgba(228,193,86,0.12) 18deg, rgba(212,175,55,0.05) 30deg, transparent 42deg)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "-5%", left: "5%", width: "55%", height: "55%", background: isRed ? "radial-gradient(ellipse at 40% 0%, rgba(255,230,150,0.07) 0%, transparent 65%)" : "radial-gradient(ellipse at 40% 0%, rgba(228,193,86,0.10) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />
      {/* PARTICLES */}
      {[...Array(18)].map((_, i) => { const lp = 5 + (i * 29 + i * i * 3) % 50; const sz = s(1.5 + (i % 3) * 1.0); const op = 0.25 + (i % 4) * 0.12; return (<div key={i} style={{ position: "absolute", bottom: `${10 + (i * 13) % 60}%`, left: `${lp}%`, width: sz, height: sz, borderRadius: "50%", background: isRed ? "rgba(255,220,100,0.9)" : "rgba(228,193,86,0.9)", boxShadow: `0 0 ${sz * 2.5}px ${isRed ? "rgba(255,210,80,0.7)" : "rgba(212,175,55,0.7)"}`, pointerEvents: "none", zIndex: 2, opacity: op }}/>); })}
      {/* COLUMN GLOW */}
      <div style={{ position: "absolute", top: 0, right: 0, width: `calc(${rightWidthPct} + ${s(32)}px)`, height: "100%", background: isRed ? `linear-gradient(to right, rgba(255,200,80,0) 0%, rgba(255,200,80,0.14) ${s(20)}px, transparent ${s(40)}px)` : `linear-gradient(to right, rgba(212,175,55,0) 0%, rgba(212,175,55,0.20) ${s(20)}px, transparent ${s(40)}px)`, pointerEvents: "none", zIndex: 2, opacity: 0.7 }} />

      {/* LEFT ZONE */}
      <div style={{ position: "absolute", top: 0, left: 0, width: leftWidthPct, height: "100%", padding: `${s(46 * bsr)}px ${s(50 * bsr)}px`, display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 1 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s(24 * bsr * fScale), letterSpacing: `${s(2.5 * bsr)}px`, textTransform: "uppercase", lineHeight: 1.1, flexShrink: 0, opacity: 0.95 }}>BANDA<br />SINFÔNICA<br />NACIONAL</div>

        {variant === "com_foto" && (
          <div style={{ width: "92%", maxWidth: s(492 * bsr * fScale), margin: `${s(12)}px 0`, flexShrink: 0, zIndex: 2 }}>
            <div style={{ width: "100%", padding: s(12 * bsr), background: "#fff", boxShadow: `0 ${s(24 * bsr)}px ${s(50 * bsr)}px rgba(0,0,0,0.35)` }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", overflow: "hidden", outline: `${s(1.5 * bsr)}px solid ${accentColor}`, outlineOffset: `-${s(7 * bsr)}px` }}>
                <img src={ORCHESTRA_IMG} alt="BSN em concerto" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(1) contrast(1.08) brightness(1.10)", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "#0e2647", mixBlendMode: "multiply", opacity: 0.50 }} />
                <div style={{ position: "absolute", inset: 0, background: "#caa66a", mixBlendMode: "soft-light", opacity: 0.35 }} />
              </div>
            </div>
            <div style={{ marginTop: s(14 * bsr), background: "#fff", padding: `${s(12 * bsr)}px ${s(20 * bsr)}px`, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 ${s(12 * bsr)}px ${s(24 * bsr)}px rgba(0,0,0,0.28)` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: accentColor, fontSize: s(16 * bsr * fScale) }}>em concerto</div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", color: accentColor, fontSize: s(19 * bsr * fScale), letterSpacing: `${s(0.5)}px` }}>28.09 · 19H</div>
            </div>
          </div>
        )}

        <div style={{ position: "absolute", left: "10%", top: "45%", width: "80%", height: "40%", backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) ${s(2)}px, transparent ${s(2)}px, transparent ${s(32 * bsr)}px)`, WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)", pointerEvents: "none" }} />

        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s(19 * bsr * fScale), letterSpacing: `${s(0.5)}px`, textTransform: "uppercase", lineHeight: 1.3, opacity: 0.95, zIndex: 2 }}>
          Entrada pela Praça Floriano
          <span style={{ display: "block", fontFamily: "'Barlow', sans-serif", fontSize: s(14.5 * bsr * fScale), textTransform: "none", letterSpacing: `${s(0.2)}px`, opacity: 0.78, marginTop: s(4 * bsr), fontWeight: 400 }}>Lateral da Av. Treze de Maio</span>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ position: "absolute", top: `${s(96 * bsr)}px`, right: `${s(64 * bsr)}px`, width: rightWidthPct, height: `calc(100% - ${s(190 * bsr)}px)`, display: "flex", flexDirection: "column", zIndex: 3 }}>
        <div style={{ width: "100%", height: s(24 * bsr), background: "#fff", flexShrink: 0 }} />
        <div style={{ width: "100%", height: s(9 * bsr), background: "#fff", opacity: 0.55, marginTop: s(4), flexShrink: 0 }} />
        <div style={{ flex: 1, background: "#fff", backgroundImage: `repeating-linear-gradient(90deg, rgba(206,12,34,0.055) 0px, rgba(206,12,34,0.055) ${s(2)}px, transparent ${s(2)}px, transparent ${s(32 * bsr)}px)`, color: accentColor, marginTop: s(4), padding: `${s(46 * bsr)}px ${s(40 * bsr)}px ${s(32 * bsr)}px ${s(40 * bsr)}px`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s(19 * bsr * fScale), letterSpacing: `${s(2.5)}px`, textTransform: "uppercase", opacity: 0.75, marginBottom: s(8 * bsr), lineHeight: 1.2 }}>Banda Sinfônica Nacional apresenta</div>
          <div style={{ fontFamily: "'Pinyon Script', cursive", fontWeight: 400, fontSize: s((isCartaz ? 68 : 80) * bsr * fScale), lineHeight: 0.92, letterSpacing: `${s(0.5)}px`, marginBottom: s(12 * bsr), color: "#D4AF37", WebkitTextStroke: `${s(0.8 * bsr)}px #f4d9a6`, filter: `drop-shadow(0 ${s(2 * bsr)}px ${s(6 * bsr)}px rgba(0,0,0,0.7))` }}>
            <em style={{ fontStyle: "normal", display: "block" }}>Clássicos</em>
            <em style={{ fontStyle: "normal", display: "block" }}>Mundiais</em>
          </div>
          <div style={{ width: s(50 * bsr * fScale), height: s(3.5 * bsr), background: accentColor, opacity: 0.35, marginBottom: s(24 * bsr) }} />
          <div style={{ display: "flex", flexDirection: "column", gap: s(12 * bsr) }}>
            {GUESTS.map((g, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", borderLeft: `${s(3 * bsr)}px solid ${accentColor}`, paddingLeft: s(14 * bsr) }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s(22 * bsr * fScale), lineHeight: 1.05, textTransform: "uppercase", color: accentColor }}>{g.name.replace("\n", " ")}</div>
                {g.role && <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s(13 * bsr * fScale), letterSpacing: `${s(1.5)}px`, textTransform: "uppercase", opacity: 0.65, marginTop: s(2) }}>{g.role}</div>}
                {/* PHOTO BELOW NAME */}
                <div style={{ marginTop: s(8 * bsr), width: s(46 * bsr * fScale), height: s(46 * bsr * fScale), borderRadius: "50%", overflow: "hidden", border: `${s(1.5 * bsr)}px solid ${accentColor}`, flexShrink: 0, opacity: 0.9 }}>
                  <img src={g.photo} alt={g.name.replace("\n", " ")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", paddingTop: s(14 * bsr), borderTop: `${s(2)}px solid rgba(206,12,34,0.25)` }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s(20 * bsr * fScale), letterSpacing: `${s(1)}px`, textTransform: "uppercase", color: accentColor }}>Salão Assyrio</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s(13 * bsr * fScale), letterSpacing: `${s(1)}px`, textTransform: "uppercase", opacity: 0.7, marginTop: s(2) }}>28 de setembro · 19h</div>
            {/* TMRJ LOGO */}
            <img src={TMRJ_LOGO} alt="Theatro Municipal do Rio de Janeiro" style={{ marginTop: s(10 * bsr), height: s(Math.max(38, isTotem ? 38 : isLandscape ? 36 * bsr * fScale : 46 * bsr * fScale)), objectFit: "contain", display: "block", opacity: 0.85 }} />
            {format === "a4_street" && (
              <div style={{ marginTop: s(12 * bsr), padding: `${s(8 * bsr)}px ${s(10 * bsr)}px`, background: "#ffffff", border: `2px solid ${accentColor}`, borderRadius: s(8 * bsr), textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: `0 ${s(6 * bsr)}px ${s(18 * bsr)}px rgba(0,0,0,0.15)` }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s(11 * bsr * fScale), color: accentColor, marginBottom: s(4 * bsr), textTransform: "uppercase", letterSpacing: `${s(0.5)}px` }}>COMPRE SEU INGRESSO</div>
                <div style={{ padding: s(3 * bsr), background: "#ffffff", borderRadius: s(3 * bsr) }}>
                  <QRCode value="https://feverup.com/m/740535" size={Math.round(s(84 * bsr * fScale))} bgColor="#ffffff" fgColor="#000000" level="H" />
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s(10 * bsr * fScale), color: "#333", marginTop: s(4 * bsr), textTransform: "uppercase", letterSpacing: `${s(0.8)}px` }}>ESCANEIE O QR CODE</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: s(8.5 * bsr * fScale), color: accentColor }}>feverup.com/m/740535</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ width: "100%", height: s(9 * bsr), background: "#fff", opacity: 0.55, marginTop: s(4), flexShrink: 0 }} />
        <div style={{ width: "100%", height: s(24 * bsr), background: "#fff", marginTop: s(4), flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEITO B — HERO FULL BLEED
// Foto a sangue no topo, título flutuante sobre transição, strip de convidados
// ─────────────────────────────────────────────────────────────────────────────
function HeroFullBleedCanvas({ scale, format, palette, spec }: {
  scale: number; format: Format; palette: ColorPalette; spec: { w: number; h: number };
}) {
  const s  = (v: number) => Math.round(v * scale * 10) / 10;
  const isRed = palette === "vermelho";
  const bgColor     = isRed ? "#A8081C" : "#080608";
  const accentGold  = "#f4d9a6";
  const accentColor = isRed ? "#A8081C" : "#B8860B";

  const isLandscape  = spec.w > spec.h;
  const isSquare     = (spec.w === spec.h);
  const isUltraWide  = isLandscape && (spec.w / spec.h) > 2.5;   // legenda 768×256
  const isTotem      = !isLandscape && !isSquare && (spec.w / spec.h) < 0.55;  // totem 533×1094
  const isLegenda    = isUltraWide;                                              // alias
  const isStories    = !isLandscape && !isSquare && spec.h >= 1800;             // stories/reels — already large via bsr
  const isCartaz     = format === "cartaz" || format === "a4_street";
  const isA4         = format === "a4_street";
  const isStackedFooter = isTotem || isCartaz;
  const bsr          = isUltraWide ? spec.h / 256
                     : isLandscape ? spec.h / 756
                     : isSquare    ? spec.h / 900   // was /1080 — more generous base for Sales
                     :               spec.h / 1350;
  // Totem text scale: narrow canvas needs proportionally smaller fonts
  const tScale       = isTotem ? 0.82 : 1.0;
  // Format scale: Second pass boost across all formats
  const fScale       = isUltraWide ? 1.0
                     : isLandscape  ? 1.45  // +45% boost for landscape
                     : isTotem      ? 1.12  // +12% boost for totem
                     : isStories    ? 1.15  // +15% boost for stories
                     : isSquare     ? 1.30  // +30% boost for square
                     :                1.40; // +40% boost for feed & cartaz

  // ─── Vertical layout — precise values per format ratio ───────────────────
  const heroH     = spec.h * (isLandscape ? 1.0 : 0.66);
  const titleTop  = isUltraWide ? spec.h * 0.08
                  : isLandscape ? spec.h * 0.230
                  :               spec.h * 0.265;
  const guestTop  = isUltraWide ? spec.h * 0.90   // banner: guests hidden (below fold)
                  : isA4        ? spec.h * 0.575
                  : isLandscape ? spec.h * 0.570
                  :               spec.h * 0.605;
  const venueTop  = isLandscape ? spec.h * 0.798 : spec.h * 0.807;
  const photoW    = isUltraWide ? 42 * bsr : (isLandscape ? 68 : 94) * bsr * fScale;
  const photoH    = isUltraWide ? 52 * bsr : (isLandscape ? 86 : 118) * bsr * fScale;

  // Sparkle positions (% of spec dimensions, pre-calculated)
  const sparkles = [
    { x: 0.194, y: 0.443, sz: 22, op: 0.85 },
    { x: 0.769, y: 0.480, sz: 16, op: 0.70 },
    { x: 0.111, y: 0.523, sz: 12, op: 0.60 },
    { x: 0.833, y: 0.436, sz: 10, op: 0.55 },
    { x: 0.481, y: 0.044, sz:  9, op: 0.50 },
    { x: 0.889, y: 0.193, sz:  8, op: 0.45 },
  ];

  const bokeh = [
    { x: 0.139, y: 0.159, sz: 10, op: 0.75 },
    { x: 0.833, y: 0.363, sz:  7, op: 0.70 },
    { x: 0.065, y: 0.415, sz: 14, op: 0.60 },
    { x: 0.556, y: 0.089, sz:  6, op: 0.65 },
    { x: 0.889, y: 0.489, sz:  9, op: 0.55 },
  ];

  const SparkleIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }}>
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill={accentGold} />
    </svg>
  );

  return (
    <div style={{ width: "100%", height: "100%", background: bgColor, position: "relative", fontFamily: "'Barlow', sans-serif", color: "#fff", overflow: "hidden" }}>

      {/* HERO PHOTO — Higher photo visibility as requested */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: s(heroH), overflow: "hidden" }}>
        <img src={ORCHESTRA_IMG} alt="BSN em concerto" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "grayscale(1) contrast(1.10) brightness(1.12)", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: isRed ? "#A8081C" : "#4a0512", mixBlendMode: "multiply", opacity: 0.50 }} />
        <div style={{ position: "absolute", inset: 0, background: isRed ? "#FF1E40" : "#e2a95c", mixBlendMode: "soft-light", opacity: 0.18 }} />
        {isLandscape ? (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,2,4,0.55) 0%, rgba(10,2,4,0) 35%)" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,2,4,0.6) 0%, rgba(10,2,4,0) 32%)" }} />
        )}
        {/* FADE TO BG COLOR AT BOTTOM */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: isLandscape ? "66%" : s(280 * bsr), background: `linear-gradient(to bottom, ${bgColor}00 0%, ${bgColor} 92%)` }} />
      </div>

      {/* DUST GRAIN LAYER */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", backgroundImage: `radial-gradient(circle, rgba(244,217,166,0.55) 0.8px, transparent 1.1px)`, backgroundSize: `${s(40)}px ${s(40)}px`, opacity: 0.30, WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 55%)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />

      {/* GLOW BEHIND TITLE */}
      <div style={{ position: "absolute", top: s(titleTop - 40 * bsr), left: "50%", transform: "translateX(-50%)", width: s(760 * (spec.w / 1080)), height: s(340 * bsr), background: "radial-gradient(ellipse at center, rgba(244,217,166,0.22) 0%, rgba(244,217,166,0.08) 38%, rgba(244,217,166,0) 70%)", mixBlendMode: "screen", zIndex: 4, pointerEvents: "none" }} />

      {/* BOKEH DOTS */}
      {bokeh.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: s(b.x * spec.w), top: s(b.y * spec.h), width: s(b.sz * bsr * fScale), height: s(b.sz * bsr * fScale), borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(255,245,220,0.95), rgba(244,217,166,0.0) 72%)", boxShadow: `0 0 ${s(24 * bsr * fScale)}px ${s(6 * bsr * fScale)}px rgba(244,217,166,0.35)`, zIndex: 3, pointerEvents: "none", opacity: b.op }} />
      ))}

      {/* SPARKLES */}
      {sparkles.map((sp, i) => (
        <div key={i} style={{ position: "absolute", left: s(sp.x * spec.w), top: s(sp.y * spec.h), zIndex: 6, pointerEvents: "none", opacity: sp.op }}>
          <SparkleIcon size={s(sp.sz * bsr * fScale)} />
        </div>
      ))}

      {/* TOP ROW */}
      <div style={{ position: "absolute", top: s(isLandscape ? 30 * bsr : 38 * bsr), left: s(isLandscape ? 34 * bsr : 38 * bsr), right: s(isLandscape ? 34 * bsr : 38 * bsr), display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 5 }}>
        {/* BSN name — hidden on legenda (too crowded in banner format) */}
        {!isLegenda && (
          <div style={{ display: "flex", alignItems: "center", gap: s(10 * bsr) }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s((isTotem ? 16 : isLandscape ? 12 : 13.5) * bsr * fScale), lineHeight: 1.2, letterSpacing: `${s(0.4)}px`, textTransform: "uppercase", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>BANDA<br />SINFÔNICA<br />NACIONAL</div>
          </div>
        )}
        {/* Date box — hidden on legenda to avoid overlapping title */}
        {!isLegenda && (
          <div style={{ background: "rgba(10,4,6,0.42)", border: "1px solid rgba(255,255,255,0.35)", padding: `${s((isLandscape ? 5 : 7) * bsr)}px ${s((isLandscape ? 10 : 14) * bsr)}px`, textAlign: "right", backdropFilter: "blur(2px)" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 9 : 10) * bsr * tScale * fScale), letterSpacing: `${s(2)}px`, textTransform: "uppercase", opacity: 0.9 }}>SEG</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s((isLandscape ? 15 : 18) * bsr * tScale * fScale), lineHeight: 1.05, letterSpacing: `${s(0.5)}px` }}>28.09</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 9 : 10) * bsr * tScale * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase", opacity: 0.85 }}>19H</div>
          </div>
        )}
      </div>

      {/* TITLE BLOCK — Clean Floating Layout with Gold Outline (Option 4) */}
      <div style={{ position: "absolute", top: s(titleTop), left: 0, right: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: `0 ${s(30 * bsr)}px` }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isUltraWide ? 18 : isLandscape ? 12 : 14) * bsr * fScale), letterSpacing: `${s(3.5)}px`, textTransform: "uppercase", color: accentGold, marginBottom: s((isLandscape ? 4 : 6) * bsr), textShadow: "0 2px 8px rgba(0,0,0,0.85)", whiteSpace: "nowrap" }}>Banda Sinfônica Nacional apresenta</div>
        <div style={{
          fontFamily: "'Pinyon Script', cursive",
          fontWeight: 400,
          fontSize: s((isUltraWide ? 60 : isLandscape ? 80 : isTotem ? 78 : isCartaz ? 78 : 96) * bsr * fScale),
          lineHeight: 0.9,
          whiteSpace: "nowrap",
          background: "linear-gradient(180deg, #fdf1cf 0%, #f4d9a6 35%, #c99a4a 62%, #f4d9a6 85%, #fdf1cf 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: `${s(1.2 * bsr)}px rgba(244, 217, 166, 0.9)`,
          filter: `drop-shadow(0 ${s(3 * bsr)}px ${s(8 * bsr)}px rgba(0,0,0,0.98)) drop-shadow(0 ${s(10 * bsr)}px ${s(28 * bsr)}px rgba(0,0,0,0.95))`,
          paddingTop: s((isLandscape ? 6 : 14) * bsr),
          paddingBottom: s((isLandscape ? 3 : 5) * bsr)
        }}>
          Clássicos Mundiais
        </div>
        {/* GOLD RULE */}
        {!isLegenda && (
          <div style={{ width: s((isLandscape ? 90 : 100) * bsr * fScale), height: s(2 * bsr), margin: `${s(isLandscape ? 10 : 14) * bsr}px 0 ${s(isLandscape ? 8 : 12) * bsr}px 0`, background: `linear-gradient(90deg, transparent, ${accentGold}, transparent)`, boxShadow: `0 0 ${s(12 * bsr)}px ${s(1 * bsr)}px rgba(244,217,166,0.5)` }} />
        )}
      </div>

      {/* GUEST STRIP — hidden on legenda (not enough vertical space) */}
      {!isLegenda && (
      <div style={{ position: "absolute", top: s(guestTop), left: s(50 * bsr), right: s(50 * bsr), zIndex: 5, display: "flex", justifyContent: "space-between" }}>
        {GUESTS.map((g, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1, padding: `0 ${s(4 * bsr)}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Names hidden on legenda, shown on all other formats */}
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s((isLandscape ? 13 : 15) * bsr * fScale), lineHeight: 1.15, textTransform: "uppercase", letterSpacing: `${s(0.2)}px`, whiteSpace: "pre-line" }}>{g.name}</div>
            {g.role && <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 9 : 10) * bsr * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase", opacity: 0.88, marginTop: s(2 * bsr), color: accentGold }}>{g.role}</div>}

            {/* DARK BAROQUE FRAME — toned-down obsidian & dim gold */}
            <div style={{
              width: s(photoW),
              height: s(photoH),
              position: "relative",
              marginTop: s((isLandscape ? 6 : 8) * bsr),
              flexShrink: 0,
              /* Outer frame: very dark warm charcoal with faint gold sheen */
              background: "linear-gradient(145deg, #2a1f0e 0%, #1a1208 45%, #2e2010 100%)",
              padding: s((isLandscape ? 5 : 6) * bsr),
              borderRadius: s(2 * bsr),
              /* Single thin dim gold border */
              border: `${s(1 * bsr)}px solid #5c4210`,
              boxShadow: `0 ${s(6 * bsr)}px ${s(20 * bsr)}px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,160,60,0.12)`,
            }}>
              {/* Inner passe-partout: near-black with dim amber fillet */}
              <div style={{
                width: "100%",
                height: "100%",
                background: "#080405",
                padding: s((isLandscape ? 2 : 2.5) * bsr),
                borderRadius: s(1 * bsr),
                border: `${s(0.8 * bsr)}px solid rgba(160,110,30,0.55)`,
                position: "relative",
              }}>
                {/* Photo window — no bright border, just the image */}
                <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "1px" }}>
                  <img src={g.photo} alt={g.name.replace("\n", " ")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
              </div>

              {/* Subtle corner accents in dim gold — very understated */}
              {[
                { top: 0, left: 0, transform: "none" },
                { top: 0, right: 0, transform: "scaleX(-1)" },
                { bottom: 0, left: 0, transform: "scaleY(-1)" },
                { bottom: 0, right: 0, transform: "scale(-1,-1)" },
              ].map((pos, ci) => (
                <svg
                  key={ci}
                  width={s(8 * bsr)}
                  height={s(8 * bsr)}
                  viewBox="0 0 8 8"
                  style={{ position: "absolute", pointerEvents: "none", ...pos }}
                >
                  <path d="M 0 6 L 0 0 L 6 0" fill="none" stroke="rgba(180,130,40,0.6)" strokeWidth="1" />
                </svg>
              ))}
            </div>

          </div>
        ))}
      </div>
      )}

      {/* 2-COLUMN FOOTER FOR ALL FORMATS */}
      <div style={{ position: "absolute", left: s(isLandscape ? 60 * bsr : 44 * bsr), right: s(isLandscape ? 60 * bsr : 44 * bsr), bottom: s(isLandscape ? 20 * bsr : (isA4 ? 22 * bsr : 28 * bsr)), zIndex: 5, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {/* LEFT COLUMN: VENUE, DATE, ADDRESS & REALIZAÇÃO */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: s(4 * bsr) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: s(10 * bsr), whiteSpace: "nowrap", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s((isLandscape ? 22 : 24) * bsr * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase" }}>Salão Assyrio</span>
            <span style={{ opacity: 0.4, fontSize: s(14 * bsr * fScale) }}>·</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 14 : 15) * bsr * fScale), letterSpacing: `${s(1.5)}px`, textTransform: "uppercase", color: accentGold }}>28 de Setembro · 19h</span>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 11.5 : 12.5) * bsr * fScale), letterSpacing: `${s(0.8)}px`, textTransform: "uppercase", opacity: 0.88, lineHeight: 1.25, whiteSpace: "nowrap" }}>
            Entrada pela Praça Floriano <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: s((isLandscape ? 10 : 11) * bsr * fScale), textTransform: "none", letterSpacing: `${s(0.2)}px`, opacity: 0.75, fontWeight: 400 }}>· Lateral da Av. Treze de Maio</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: s(10 * bsr), marginTop: s(4 * bsr) }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s(9 * bsr * tScale * fScale), letterSpacing: `${s(2.5)}px`, textTransform: "uppercase", opacity: 0.65 }}>Realização</div>
            <img src={TMRJ_LOGO} alt="Theatro Municipal do Rio de Janeiro" style={{ height: s(Math.max(38, isTotem ? 38 : isLandscape ? 36 * bsr * fScale : 44 * bsr * fScale)), objectFit: "contain", display: "block", opacity: 0.95, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }} />
          </div>
        </div>

        {/* RIGHT COLUMN: QR CODE CARD (FOR A4 STREET) */}
        {isA4 ? (
          <div style={{
            background: "#ffffff",
            padding: `${s(10 * bsr)}px ${s(14 * bsr)}px`,
            borderRadius: s(10 * bsr),
            border: `${s(2 * bsr)}px solid #D4AF37`,
            boxShadow: `0 ${s(12 * bsr)}px ${s(35 * bsr)}px rgba(0,0,0,0.8), 0 0 ${s(20 * bsr)}px rgba(212,175,55,0.45)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#0c0a07",
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: s(11.5 * bsr * fScale),
              lineHeight: 1.1,
              textTransform: "uppercase",
              color: isRed ? "#A8081C" : "#0C0A07",
              marginBottom: s(5 * bsr),
              letterSpacing: `${s(0.5)}px`
            }}>
              COMPRE SEU INGRESSO
            </div>
            <div style={{
              background: "#ffffff",
              padding: s(5 * bsr),
              borderRadius: s(4 * bsr),
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
            }}>
              <QRCode
                value="https://feverup.com/m/740535"
                size={Math.round(s(92 * bsr * fScale))}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
              />
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: s(10.5 * bsr * fScale),
              letterSpacing: `${s(1)}px`,
              textTransform: "uppercase",
              color: "#333",
              marginTop: s(5 * bsr)
            }}>
              ESCANEIE O QR CODE
            </div>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: s(8.5 * bsr * fScale),
              color: isRed ? "#A8081C" : "#B8860B",
              marginTop: s(1 * bsr)
            }}>
              feverup.com/m/740535
            </div>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: isStackedFooter ? "column" : "row",
            alignItems: "center",
            gap: s(isStackedFooter ? 3 : 12) * bsr,
          }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s(9 * bsr * tScale * fScale), letterSpacing: `${s(2.5)}px`, textTransform: "uppercase", opacity: 0.65 }}>Realização</div>
            <img src={TMRJ_LOGO} alt="Theatro Municipal do Rio de Janeiro" style={{ height: s(Math.max(38, isTotem ? 38 : isLandscape ? 36 * bsr * fScale : 46 * bsr * fScale)), objectFit: "contain", display: "block", opacity: 0.95, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }} />
          </div>
        )}
      </div>

    </div>
  );
}
