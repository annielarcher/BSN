"use client";

/**
 * Arte — "Banda Sinfônica Nacional apresenta Clássicos Mundiais"
 * Grande Sala · Cidade das Artes · 19/11/2026 · 19h
 *
 * Mesma arte do concerto no Salão Assyrio (Theatro Municipal — Conceito B "Hero Full Bleed"),
 * alterando somente logos, local e data, e adaptada às 10 peças exigidas pelo
 * manual "Marketing Comunicação — Cidade das Artes (Agosto 2026)".
 *
 * Regras do manual aplicadas:
 *  - Classificação indicativa em todas as peças (Livre).
 *  - Logo 1 (Prefeitura Rio + Cultura + Cidade das Artes) com chancela "Apoio Institucional".
 *  - Logo 2 (Sympla) com chancela "Ingressos".
 *  - Exportação em JPG nas dimensões exatas, respeitando os limites de peso (KB).
 *  - Ingresso Sympla em preto e branco.
 */

import React, { useState, useRef, useEffect } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── DATA & CONSTANTS ────────────────────────────────────────────────────────
const GUESTS = [
  { name: "Bina\nGoldrajch",   role: "MEZZO SOPRANO", photo: "/Bina Goldrajch.jpeg" },
  { name: "Cíntia\nFortunato",     role: "SOPRANO",       photo: "/cintia-fortunato.jpg" },
  { name: "Wladimir\nCabanas", role: "TENOR",         photo: "/wladimir-cabanas.jpeg" },
  { name: "Brazilian\nPiper",  role: "BANDA",         photo: "/brazilian-piper.jpeg" },
];

const ORCHESTRA_IMG = "/Images/bsn-hero.jpg";

// Logos exigidas pelo manual da Cidade das Artes (salvar os arquivos nestes caminhos)
const LOGO_APOIO  = "/cidade-das-artes/apoio-prefeitura-cultura-cda.png"; // Logo 1 — Prefeitura Rio + Cultura + Cidade das Artes
const LOGO_SYMPLA = "/cidade-das-artes/sympla.png";                      // Logo 2 — Sympla

const EVENT = {
  weekday:   "QUI",
  dateShort: "19.11",
  dateLong:  "19 de Novembro",
  time:      "19h",
  venue:     "Grande Sala",
  place:     "Cidade das Artes",
  address:   "Av. das Américas, 5300 · Barra da Tijuca",
  rating:    "Livre",
  duration:  "80 min",
};

type Format =
  | "banner_sympla" | "ingresso" | "totem_sympla" | "banner_cda" | "tv_foyer"
  | "display" | "totem_cda" | "led" | "feed" | "stories";
type ColorPalette = "vermelho" | "obsidian_dourado";

type FormatSpec = { label: string; w: number; h: number; filename: string; maxKB?: number; bw?: boolean };

const FORMATS: Record<Format, FormatSpec> = {
  banner_sympla: { label: "01. Banner site Sympla (1128 × 635 · máx 500KB)",   w: 1128, h: 635,  filename: "01. BSN_CdA_banner_sympla_1128x635",   maxKB: 500 },
  ingresso:      { label: "02. Ingresso Sympla P&B (780 × 390 · máx 70KB)",    w: 780,  h: 390,  filename: "02. BSN_CdA_ingresso_sympla_780x390",  maxKB: 70, bw: true },
  totem_sympla:  { label: "03. Totem de Vendas Sympla (600 × 960 · máx 500KB)", w: 600,  h: 960,  filename: "03. BSN_CdA_totem_sympla_600x960",     maxKB: 500 },
  banner_cda:    { label: "04. Banner site Cidade das Artes (960 × 495)",      w: 960,  h: 495,  filename: "04. BSN_CdA_banner_site_960x495" },
  tv_foyer:      { label: "05. TV Foyer da Grande Sala (3175 × 1843)",         w: 3175, h: 1843, filename: "05. BSN_CdA_tv_foyer_3175x1843" },
  display:       { label: "06. Display Teatros GS/TC (2160 × 3840)",           w: 2160, h: 3840, filename: "06. BSN_CdA_display_teatros_2160x3840" },
  totem_cda:     { label: "07. Totem Cidade das Artes (2160 × 3840)",          w: 2160, h: 3840, filename: "07. BSN_CdA_totem_biblioteca_2160x3840" },
  led:           { label: "08. LED Painéis Digitais (960 × 384)",              w: 960,  h: 384,  filename: "08. BSN_CdA_led_960x384" },
  feed:          { label: "09. Feed Instagram (1080 × 1350)",                  w: 1080, h: 1350, filename: "09. BSN_CdA_feed_1080x1350" },
  stories:       { label: "10. Reels / Stories (1080 × 1920)",                 w: 1080, h: 1920, filename: "10. BSN_CdA_stories_1080x1920" },
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

async function loadHtmlToImage(): Promise<any> {
  try {
    const mod: any = await import("html-to-image");
    return mod.toCanvas ? mod : mod.default;
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
    return (window as any).htmlToImage;
  }
}

async function loadJSZip(): Promise<any> {
  try {
    const mod: any = await import("jszip");
    return mod.default || mod;
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
    return (window as any).JSZip;
  }
}

function dataUrlKB(dataUrl: string): number {
  const base64Len = dataUrl.length - dataUrl.indexOf(",") - 1;
  return (base64Len * 3) / 4 / 1024;
}

/** Renderiza o nó (em escala 1:1) para JPG nas dimensões exatas, aplicando P&B e limite de peso. */
async function renderNodeToJpeg(node: HTMLElement, spec: FormatSpec, bg: string, htmlToImage: any, fontEmbedCSS: string): Promise<{ dataUrl: string; kb: number }> {
  const raw: HTMLCanvasElement = await htmlToImage.toCanvas(node, {
    pixelRatio: 1,
    width: spec.w,
    height: spec.h,
    canvasWidth: spec.w,
    canvasHeight: spec.h,
    cacheBust: true,
    backgroundColor: bg,
    fontEmbedCSS,
  });

  const out = document.createElement("canvas");
  out.width = spec.w;
  out.height = spec.h;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, spec.w, spec.h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(raw, 0, 0, spec.w, spec.h);

  if (spec.bw) {
    const img = ctx.getImageData(0, 0, spec.w, spec.h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = y;
    }
    ctx.putImageData(img, 0, 0);
  }

  let quality = 0.95;
  let dataUrl = out.toDataURL("image/jpeg", quality);
  if (spec.maxKB) {
    while (dataUrlKB(dataUrl) > spec.maxKB && quality > 0.3) {
      quality -= 0.05;
      dataUrl = out.toDataURL("image/jpeg", quality);
    }
  }
  return { dataUrl, kb: Math.round(dataUrlKB(dataUrl)) };
}

// ─── LOGO (com fallback tipográfico enquanto o arquivo não existir) ──────────
function LogoImg({ src, alt, height, maxWidth, white, fallback }: {
  src: string; alt: string; height: number; maxWidth: number; white: boolean; fallback: (color: string) => React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <>{fallback(white ? "#ffffff" : "#111111")}</>;

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{
        height,
        maxWidth,
        width: "auto",
        objectFit: "contain",
        display: "block",
        filter: white ? "brightness(0) invert(1) drop-shadow(0 2px 6px rgba(0,0,0,0.35))" : "none",
      }}
    />
  );
}

// ─── CLASSIFICAÇÃO INDICATIVA (símbolo "L" — Livre) ──────────────────────────
function RatingBadge({ size }: { size: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: "#00A651",
      borderRadius: size * 0.16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: size * 0.68,
      lineHeight: 1,
      color: "#ffffff",
      flexShrink: 0,
      boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
    }}>L</div>
  );
}

export default function ArteCidadeDasArtesPage() {
  const [format, setFormat] = useState<Format>("feed");
  const [palette, setPalette] = useState<ColorPalette>("vermelho");
  const [whiteLogos, setWhiteLogos] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(700);
  const [exportFormat, setExportFormat] = useState<Format | null>(null);

  const previewBoxRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const spec = FORMATS[format];
  const bgColor = palette === "vermelho" ? "#A8081C" : "#080608";

  useEffect(() => {
    getFontEmbedCSS();
    const handleResize = () => {
      if (previewBoxRef.current) setContainerWidth(previewBoxRef.current.clientWidth - 48);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = Math.min((containerWidth > 0 ? containerWidth : 650) / spec.w, 820 / spec.h, 0.7);

  /** Monta a peça em tamanho real fora da tela e aguarda imagens/fallbacks. */
  const mountForExport = async (fmt: Format): Promise<HTMLElement> => {
    setExportFormat(fmt);
    await new Promise((r) => setTimeout(r, 150));
    for (let i = 0; i < 40 && exportRef.current?.dataset.format !== fmt; i++) {
      await new Promise((r) => setTimeout(r, 50));
    }
    const node = exportRef.current;
    if (!node) throw new Error("Nó de exportação não montado");
    const imgs = Array.from(node.querySelectorAll("img"));
    await Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : new Promise<void>((res) => {
      img.addEventListener("load", () => res(), { once: true });
      img.addEventListener("error", () => res(), { once: true });
    })));
    await new Promise((r) => setTimeout(r, 150));
    return exportRef.current || node;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setLastResult(null);
    try {
      if (document.fonts) await document.fonts.ready;
      const htmlToImage = await loadHtmlToImage();
      const fontEmbedCSS = await getFontEmbedCSS();
      const node = await mountForExport(format);
      const { dataUrl, kb } = await renderNodeToJpeg(node, spec, bgColor, htmlToImage, fontEmbedCSS);
      const link = document.createElement("a");
      link.download = `${spec.filename}.jpg`;
      link.href = dataUrl;
      link.click();
      setLastResult(`${spec.filename}.jpg — ${spec.w}×${spec.h}px · ${kb}KB`);
    } catch (err) {
      console.error("Erro ao exportar:", err);
    } finally {
      setExportFormat(null);
      setIsExporting(false);
    }
  };

  const handleBatchExport = async () => {
    setIsExporting(true);
    setLastResult(null);
    const keys = Object.keys(FORMATS) as Format[];
    setProgress(`Iniciando lote (0/${keys.length})...`);
    try {
      if (document.fonts) await document.fonts.ready;
      const htmlToImage = await loadHtmlToImage();
      const JSZip = await loadJSZip();
      const fontEmbedCSS = await getFontEmbedCSS();
      const zip = new JSZip();

      for (let i = 0; i < keys.length; i++) {
        const fmt = keys[i];
        const itemSpec = FORMATS[fmt];
        setProgress(`Gerando (${i + 1}/${keys.length}) ${itemSpec.filename}...`);
        const node = await mountForExport(fmt);
        const { dataUrl } = await renderNodeToJpeg(node, itemSpec, bgColor, htmlToImage, fontEmbedCSS);
        zip.file(`${itemSpec.filename}.jpg`, dataUrl.replace(/^data:image\/jpeg;base64,/, ""), { base64: true });
      }

      setProgress("Compactando ZIP...");
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "BSN_Classicos_Mundiais_Cidade_das_Artes_10_pecas.zip";
      link.click();
      setLastResult(`ZIP com ${keys.length} peças gerado.`);
    } catch (err) {
      console.error("Erro no download em lote:", err);
    } finally {
      setExportFormat(null);
      setIsExporting(false);
      setProgress(null);
    }
  };

  return (
    <div style={{ background: "#0a0b10", minHeight: "100vh", color: "#fff", fontFamily: "'Barlow', 'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:wght@600;700&family=Barlow:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Pinyon+Script&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#12141c]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-red-500 uppercase">
            Peças Cidade das Artes — Manual Mkt Ago/2026
          </p>
          <h1 className="text-base md:text-lg font-black text-white tracking-tight">
            Clássicos Mundiais — Grande Sala · Cidade das Artes · 19 Nov 2026
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <Button
            onClick={handleBatchExport}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl gap-2 flex-1 sm:flex-none"
          >
            <Download size={16} />
            {progress || "Baixar as 10 peças (ZIP)"}
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg gap-2 flex-1 sm:flex-none"
          >
            <Download size={16} />
            {isExporting && !progress ? "Gerando..." : "JPG Formato Atual"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-8 items-start">

        {/* CONTROLS */}
        <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-5">

          {/* Palette */}
          <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">Paleta de Cores</label>
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

          {/* Logos */}
          <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">Aplicação das Logos</label>
            <div className="flex flex-col gap-2">
              {([
                [true, "Negativo (branco) sobre a arte"],
                [false, "Cores originais dos arquivos"],
              ] as [boolean, string][]).map(([v, label]) => (
                <button key={String(v)} onClick={() => setWhiteLogos(v)} className={`px-4 py-2.5 rounded-lg border text-xs text-left font-medium transition-all ${
                  whiteLogos === v ? "border-red-600 bg-red-600/10 text-white font-bold" : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                }`}>
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 mt-3 leading-snug">
              Arquivos esperados em <code>public/cidade-das-artes/</code>: <code>apoio-prefeitura-cultura-cda.png</code> e <code>sympla.png</code>. Enquanto não existirem, aparece uma versão tipográfica provisória.
            </p>
          </div>

          {/* Format */}
          <div className="bg-[#12141c] border border-white/10 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-3">Peça (Manual Cidade das Artes)</label>
            <div className="flex flex-col gap-2">
              {(Object.entries(FORMATS) as [Format, FormatSpec][]).map(([f, meta]) => (
                <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2.5 rounded-lg border text-xs text-left transition-all ${
                  format === f ? "border-red-600 bg-red-600 text-white font-black" : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                }`}>
                  {meta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-[#0d1a12] border border-emerald-500/30 rounded-xl p-5 shadow-xl">
            <label className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase block mb-3">Checklist do Manual</label>
            <ul className="text-[11px] text-zinc-300 space-y-1.5 leading-snug">
              {[
                "Classificação indicativa (Livre) em todas as peças",
                "Logo 1 com chancela \"Apoio Institucional\"",
                "Logo 2 Sympla aplicada no rodapé",
                "JPG nas dimensões exatas + limite de KB",
                "Ingresso Sympla em preto e branco",
              ].map((item) => (
                <li key={item} className="flex gap-2"><CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-[1px]" />{item}</li>
              ))}
            </ul>
            <p className="text-[11px] text-amber-300/90 mt-3 leading-snug">
              ⚠️ Enviar todo o material para aprovação da Cidade das Artes antes do início da divulgação (e-mail ou Drive).
            </p>
            {lastResult && <p className="text-[11px] text-emerald-300 mt-3 font-mono break-all">✔ {lastResult}</p>}
          </div>
        </aside>

        {/* CANVAS PREVIEW */}
        <section className="flex-1 w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-zinc-400 uppercase tracking-widest font-mono">
            <span>{spec.label}</span>
            <span>Escala {Math.round(scale * 100)}%</span>
          </div>

          <div
            ref={previewBoxRef}
            className="w-full bg-[#050608] border border-white/10 rounded-2xl p-4 sm:p-8 flex items-center justify-center min-h-[500px] overflow-hidden shadow-2xl"
          >
            <div style={{
              width: spec.w * scale,
              height: spec.h * scale,
              flexShrink: 0,
              boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.2s ease-out",
              filter: spec.bw ? "grayscale(1)" : undefined,
            }}>
              <HeroFullBleedCanvas scale={scale} format={format} palette={palette} spec={spec} whiteLogos={whiteLogos} />
            </div>
          </div>
        </section>
      </main>

      {/* OFF-SCREEN 1:1 RENDER — usado apenas na exportação (dimensões exatas do manual) */}
      {exportFormat && (
        <div aria-hidden="true" style={{ position: "fixed", left: -100000, top: 0, pointerEvents: "none", zIndex: -1 }}>
          <div
            ref={exportRef}
            key={exportFormat}
            data-format={exportFormat}
            style={{ width: FORMATS[exportFormat].w, height: FORMATS[exportFormat].h, position: "relative", overflow: "hidden" }}
          >
            <HeroFullBleedCanvas scale={1} format={exportFormat} palette={palette} spec={FORMATS[exportFormat]} whiteLogos={whiteLogos} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEITO B — HERO FULL BLEED (mesma arte do Salão Assyrio / TMRJ)
// Foto a sangue no topo, título flutuante sobre transição, strip de convidados
// ─────────────────────────────────────────────────────────────────────────────
function HeroFullBleedCanvas({ scale, format, palette, spec, whiteLogos }: {
  scale: number; format: Format; palette: ColorPalette; spec: { w: number; h: number }; whiteLogos: boolean;
}) {
  const s  = (v: number) => Math.round(v * scale * 10) / 10;
  const isRed = palette === "vermelho";
  const bgColor     = isRed ? "#A8081C" : "#080608";
  const accentGold  = "#f4d9a6";

  const isLandscape  = spec.w > spec.h;
  const isSquare     = (spec.w === spec.h);
  const isUltraWide  = isLandscape && (spec.w / spec.h) >= 2.4;                   // LED 960×384
  const isTotem      = format === "totem_sympla";                                 // totem Sympla 600×960
  const isLegenda    = isUltraWide;                                               // alias
  const isStories    = !isLandscape && !isSquare && (spec.h / spec.w) >= 1.7;     // stories / displays 9:16
  const isStackedFooter = isTotem || isStories;
  const bsr          = isUltraWide ? Math.min(spec.h / 256, spec.w / 768)
                     : isLandscape ? spec.h / 756
                     : isSquare    ? spec.h / 900
                     :               spec.h / 1350;
  // Totem text scale: narrow canvas needs proportionally smaller fonts
  const tScale       = isTotem ? 0.82 : 1.0;
  // Format scale (mesmos ajustes da arte do TMRJ)
  const fScale       = isUltraWide ? 1.0
                     : isLandscape  ? 1.45
                     : isTotem      ? 1.12
                     : isStories    ? 1.15
                     : isSquare     ? 1.30
                     :                1.40;

  // ─── Vertical layout ─────────────────────────────────────────────────────
  const heroH     = spec.h * (isLandscape ? 1.0 : 0.66);
  const titleTop  = isUltraWide ? spec.h * 0.08
                  : isLandscape ? spec.h * 0.230
                  :               spec.h * 0.265;
  const guestTop  = isUltraWide ? spec.h * 0.90
                  : isLandscape ? spec.h * 0.555
                  :               spec.h * 0.595;
  const photoW    = isUltraWide ? 42 * bsr : (isLandscape ? 68 : 94) * bsr * fScale;
  const photoH    = isUltraWide ? 52 * bsr : (isLandscape ? 86 : 118) * bsr * fScale;

  // Footer logos
  const logoH       = (isUltraWide ? 26 : isLandscape ? 30 : 34) * bsr * fScale;
  const symplaLogoH = (isUltraWide ? 36 : isLandscape ? 42 : 48) * bsr * fScale;

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

  const chancelaStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: s(9 * bsr * tScale * fScale),
    letterSpacing: `${s(2)}px`,
    textTransform: "uppercase",
    opacity: 0.75,
    whiteSpace: "nowrap",
    marginBottom: s(3 * bsr),
  };

  return (
    <div style={{ width: "100%", height: "100%", background: bgColor, position: "relative", fontFamily: "'Barlow', sans-serif", color: "#fff", overflow: "hidden" }}>

      {/* HERO PHOTO */}
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
        {!isLegenda && (
          <div style={{ display: "flex", alignItems: "center", gap: s(10 * bsr) }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s((isTotem ? 16 : isLandscape ? 12 : 13.5) * bsr * fScale), lineHeight: 1.2, letterSpacing: `${s(0.4)}px`, textTransform: "uppercase", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>BANDA<br />SINFÔNICA<br />NACIONAL</div>
          </div>
        )}
        {!isLegenda && (
          <div style={{ background: "rgba(10,4,6,0.42)", border: "1px solid rgba(255,255,255,0.35)", padding: `${s((isLandscape ? 5 : 7) * bsr)}px ${s((isLandscape ? 10 : 14) * bsr)}px`, textAlign: "right", backdropFilter: "blur(2px)" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 9 : 10) * bsr * tScale * fScale), letterSpacing: `${s(2)}px`, textTransform: "uppercase", opacity: 0.9 }}>{EVENT.weekday}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s((isLandscape ? 15 : 18) * bsr * tScale * fScale), lineHeight: 1.05, letterSpacing: `${s(0.5)}px` }}>{EVENT.dateShort}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 9 : 10) * bsr * tScale * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase", opacity: 0.85 }}>{EVENT.time.toUpperCase()}</div>
          </div>
        )}
      </div>

      {/* TITLE BLOCK */}
      <div style={{ position: "absolute", top: s(titleTop), left: 0, right: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: `0 ${s(30 * bsr)}px` }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isUltraWide ? 18 : isLandscape ? 12 : 14) * bsr * fScale), letterSpacing: `${s(3.5)}px`, textTransform: "uppercase", color: accentGold, marginBottom: s((isLandscape ? 4 : 6) * bsr), textShadow: "0 2px 8px rgba(0,0,0,0.85)", whiteSpace: "nowrap" }}>Banda Sinfônica Nacional apresenta</div>
        <div style={{
          fontFamily: "'Pinyon Script', cursive",
          fontWeight: 400,
          fontSize: s((isUltraWide ? 60 : isLandscape ? 80 : isTotem ? 78 : 96) * bsr * fScale),
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
        {!isLegenda && (
          <div style={{ width: s((isLandscape ? 90 : 100) * bsr * fScale), height: s(2 * bsr), margin: `${s(isLandscape ? 10 : 14) * bsr}px 0 ${s(isLandscape ? 8 : 12) * bsr}px 0`, background: `linear-gradient(90deg, transparent, ${accentGold}, transparent)`, boxShadow: `0 0 ${s(12 * bsr)}px ${s(1 * bsr)}px rgba(244,217,166,0.5)` }} />
        )}
        {/* LED: data/hora logo abaixo do título (gabarito do manual) */}
        {isLegenda && (
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s(16 * bsr), letterSpacing: `${s(1)}px`, textTransform: "uppercase", marginTop: s(4 * bsr), textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}>
            {EVENT.dateShort} <span style={{ color: accentGold }}>|</span> {EVENT.time.toUpperCase()}
          </div>
        )}
      </div>

      {/* GUEST STRIP */}
      {!isLegenda && (
      <div style={{ position: "absolute", top: s(guestTop), left: s(50 * bsr), right: s(50 * bsr), zIndex: 5, display: "flex", justifyContent: "space-between" }}>
        {GUESTS.map((g, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1, padding: `0 ${s(4 * bsr)}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s((isLandscape ? 13 : 15) * bsr * fScale), lineHeight: 1.15, textTransform: "uppercase", letterSpacing: `${s(0.2)}px`, whiteSpace: "pre-line" }}>{g.name}</div>
            {g.role && <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 9 : 10) * bsr * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase", opacity: 0.88, marginTop: s(2 * bsr), color: accentGold }}>{g.role}</div>}

            {/* DARK BAROQUE FRAME */}
            <div style={{
              width: s(photoW),
              height: s(photoH),
              position: "relative",
              marginTop: s((isLandscape ? 6 : 8) * bsr),
              flexShrink: 0,
              background: "linear-gradient(145deg, #2a1f0e 0%, #1a1208 45%, #2e2010 100%)",
              padding: s((isLandscape ? 5 : 6) * bsr),
              borderRadius: s(2 * bsr),
              border: `${s(1 * bsr)}px solid #5c4210`,
              boxShadow: `0 ${s(6 * bsr)}px ${s(20 * bsr)}px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,160,60,0.12)`,
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                background: "#080405",
                padding: s((isLandscape ? 2 : 2.5) * bsr),
                borderRadius: s(1 * bsr),
                border: `${s(0.8 * bsr)}px solid rgba(160,110,30,0.55)`,
                position: "relative",
              }}>
                <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "1px" }}>
                  <img src={g.photo} alt={g.name.replace("\n", " ")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
              </div>

              {[
                { top: 0, left: 0, transform: "none" },
                { top: 0, right: 0, transform: "scaleX(-1)" },
                { bottom: 0, left: 0, transform: "scaleY(-1)" },
                { bottom: 0, right: 0, transform: "scale(-1,-1)" },
              ].map((pos, ci) => (
                <svg key={ci} width={s(8 * bsr)} height={s(8 * bsr)} viewBox="0 0 8 8" style={{ position: "absolute", pointerEvents: "none", ...pos }}>
                  <path d="M 0 6 L 0 0 L 6 0" fill="none" stroke="rgba(180,130,40,0.6)" strokeWidth="1" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* FOOTER — local/data/classificação à esquerda · logos Cidade das Artes à direita */}
      <div style={{ position: "absolute", left: s(isLandscape ? 60 * bsr : 44 * bsr), right: s(isLandscape ? 60 * bsr : 44 * bsr), bottom: s(isLandscape ? 20 * bsr : 28 * bsr), zIndex: 5, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: s(16 * bsr) }}>
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: s(4 * bsr), minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: s(10 * bsr), whiteSpace: "nowrap", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s((isLandscape ? 22 : 24) * bsr * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase" }}>{EVENT.venue}</span>
            <span style={{ opacity: 0.4, fontSize: s(14 * bsr * fScale) }}>·</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 14 : 15) * bsr * fScale), letterSpacing: `${s(1.5)}px`, textTransform: "uppercase", color: accentGold }}>{EVENT.dateLong} · {EVENT.time}</span>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 11.5 : 12.5) * bsr * fScale), letterSpacing: `${s(0.8)}px`, textTransform: "uppercase", opacity: 0.88, lineHeight: 1.25, whiteSpace: "nowrap" }}>
            {EVENT.place} <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: s((isLandscape ? 10 : 11) * bsr * fScale), textTransform: "none", letterSpacing: `${s(0.2)}px`, opacity: 0.75, fontWeight: 400 }}>· {EVENT.address}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: s(8 * bsr), marginTop: s(4 * bsr), whiteSpace: "nowrap" }}>
            <RatingBadge size={s(18 * bsr * fScale)} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: s((isLandscape ? 10.5 : 11.5) * bsr * fScale), letterSpacing: `${s(1.2)}px`, textTransform: "uppercase", opacity: 0.9 }}>
              Classificação {EVENT.rating} · {EVENT.duration}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN — LOGOS (manual: Logo 1 + Logo 2) */}
        <div style={{ display: "flex", flexDirection: isStackedFooter ? "column" : "row", alignItems: "flex-end", gap: s((isStackedFooter ? 8 : 16) * bsr), flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isStackedFooter ? "flex-end" : "flex-start" }}>
            <div style={chancelaStyle}>Apoio Institucional</div>
            <LogoImg
              src={LOGO_APOIO}
              alt="Prefeitura do Rio · Cultura · Cidade das Artes"
              height={s(logoH)}
              maxWidth={s(spec.w * (isStackedFooter ? 0.42 : 0.26))}
              white={whiteLogos}
              fallback={(c) => (
                <div style={{ height: s(logoH), display: "flex", alignItems: "center", gap: s(6 * bsr), color: c, whiteSpace: "nowrap", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: s(logoH * 0.36), letterSpacing: `${s(0.6)}px`, textTransform: "uppercase" }}>
                  <span>Prefeitura Rio</span><span style={{ opacity: 0.5 }}>|</span><span style={{ textTransform: "none" }}>Cultura</span><span style={{ opacity: 0.5 }}>|</span><span style={{ textTransform: "none" }}>Cidade das Artes</span>
                </div>
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isStackedFooter ? "flex-end" : "flex-start" }}>
            <LogoImg
              src={LOGO_SYMPLA}
              alt="Sympla"
              height={s(symplaLogoH)}
              maxWidth={s(spec.w * 0.24)}
              white={whiteLogos}
              fallback={(c) => (
                <div style={{ height: s(symplaLogoH), display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", color: c, lineHeight: 1 }}>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: s(symplaLogoH * 0.22), opacity: 0.9, marginBottom: s(2 * bsr) }}>Ingressos:</span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: s(symplaLogoH * 0.56), letterSpacing: `${s(0.3)}px` }}>sympla</span>
                </div>
              )}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
