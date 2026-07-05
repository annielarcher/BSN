"use client";

import React, { useState, useEffect } from "react";
import { Award, Printer, RotateCcw, Sparkles, User, FileText, Calendar, Feather, Download } from "lucide-react";
import { jsPDF } from "jspdf";

// BSN Brand Colors
const BSN_NAVY = "#031529";
const BSN_DARK_BLUE = "#020d1a";
const BSN_LIGHT_NAVY = "#0a2240";
const BSN_GOLD = "#e0a020";
const BSN_GOLD_LIGHT = "#f5c842";
const BSN_CREAM = "#f5ead8";
const BSN_LOGO = "https://i.ibb.co/RT04KgYz/BSN-logo-no-BG.png";

// Helper to load image as HTMLImageElement for PDF generation
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

// Helper to render transparent PNG on client canvas for PDF watermark
const getTransparentLogoBase64 = (img: HTMLImageElement, opacity: number): string => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, 0, 0);
  }
  return canvas.toDataURL("image/png");
};

// Helper aprimorado: carrega e converte a fonte TTF em Base64 de forma direta e ultra-confiável
const fetchFontBase64 = async (url: string): Promise<string> => {
  const resp = await fetch(url);
  
  // TRAVA DE SEGURANÇA: Se o arquivo não existir, aborta e mostra o erro
  if (!resp.ok) {
    throw new Error(`Arquivo não encontrado (Erro ${resp.status}): Verifique se o caminho ${url} está exato (maiúsculas e minúsculas importam).`);
  }
  
  const buffer = await resp.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
};

type CertificateCategory = "musico" | "apoiador" | "colaborador" | "custom";
type CertificateTheme = "navy" | "saver";

interface CategoryPreset {
  title: string;
  defaultText: string;
}

const CATEGORY_PRESETS: Record<CertificateCategory, CategoryPreset> = {
  musico: {
    title: "Músico Homenageado",
    defaultText: "Em reconhecimento à sua valiosa contribuição artística como Músico da Banda Sinfônica Nacional, expressando nossa profunda gratidão pelo seu talento, virtuosismo e dedicação exemplar apresentados no decorrer deste primeiro ano de história e conquistas.",
  },
  apoiador: {
    title: "Apoiador Homenageado",
    defaultText: "Em reconhecimento ao seu valioso apoio e incentivo institucional, expressando nossa sincera gratidão pela parceria fundamental que contribuiu para a viabilização, consolidação e sucesso das atividades culturais da Banda Sinfônica Nacional em seu primeiro aniversário de fundação.",
  },
  colaborador: {
    title: "Colaborador Homenageado",
    defaultText: "Em reconhecimento à sua valiosa cooperação técnica e operacional, expressando nossos sinceros agradecimentos pela parceria e dedicação que tornaram possíveis as realizações e os espetáculos da Banda Sinfônica Nacional no ano de seu primeiro aniversário.",
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

  const [isExporting, setIsExporting] = useState(false);

  const drawEmblemSeal = (doc: jsPDF, sx: number, sy: number, size: number) => {
    const setDrawCMYK = (c: number, m: number, y: number, k: number) => {
      doc.setDrawColor(c / 100, m / 100, y / 100, k / 100);
    };
    const setFillCMYK = (c: number, m: number, y: number, k: number) => {
      doc.setFillColor(c / 100, m / 100, y / 100, k / 100);
    };
    const setTextCMYK = (c: number, m: number, y: number, k: number) => {
      doc.setTextColor(c / 100, m / 100, y / 100, k / 100);
    };

    const cx = sx + size / 2;
    const cy = sy + size / 2;
    const r = size / 2;

    // Solid Gold background circle for the seal
    setFillCMYK(0, 29, 86, 12); // BSN Gold CMYK
    doc.ellipse(cx, cy, r, r, "F");

    // Gold Light outer border of the seal
    setDrawCMYK(0, 18, 73, 4); // BSN Gold Light CMYK
    doc.setLineWidth(0.4);
    doc.ellipse(cx, cy, r, r, "S");

    // Inner thin border
    doc.ellipse(cx, cy, r - 0.8, r - 0.8, "S");

    doc.setFont("Cinzel", "bold");
    
    // BSN text inside seal
    doc.setFontSize(6.5);
    setTextCMYK(93, 49, 0, 84); // BSN Deep Navy (high contrast on gold)
    doc.text("BSN", cx, cy - 2.5, { align: "center" });

    // 1º ANO text
    doc.setFontSize(9.5);
    setTextCMYK(93, 49, 0, 84);
    doc.text("1º Ano", cx, cy + 1, { align: "center" });

    // 2025-2026 text
    doc.setFontSize(5.5);
    setTextCMYK(93, 49, 0, 84);
    doc.text("2025-2026", cx, cy + 4, { align: "center" });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [printWidth, printHeight]
      });

      // --- INJEÇÃO DINÂMICA DE FONTES ---
      const fontsToLoad = [
        { url: "/fonts/Cinzel-Regular.ttf", vfs: "Cinzel-normal.ttf", name: "Cinzel", style: "normal" },
        { url: "/fonts/Cinzel-Bold.ttf", vfs: "Cinzel-bold.ttf", name: "Cinzel", style: "bold" },
        { url: "/fonts/CormorantGaramond-Regular.ttf", vfs: "Garamond-normal.ttf", name: "Garamond", style: "normal" },
        { url: "/fonts/CormorantGaramond-Italic.ttf", vfs: "Garamond-italic.ttf", name: "Garamond", style: "italic" },
        { url: "/fonts/GreatVibes-Regular.ttf", vfs: "GreatVibes-normal.ttf", name: "GreatVibes", style: "normal" }
      ];

      for (const font of fontsToLoad) {
        try {
          const base64 = await fetchFontBase64(font.url);
          doc.addFileToVFS(font.vfs, base64);
          doc.addFont(font.vfs, font.name, font.style);
          if (font.name === "Garamond") {
            doc.addFont(font.vfs, "Cormorant Garamond", font.style);
            doc.addFont(font.vfs, "CormorantGaramond", font.style);
          }
        } catch (err) {
          console.error(`Falha ao carregar a fonte ${font.name}:`, err);
        }
      }
      // ----------------------------------------

      const setFillColorCMYK = (c: number, m: number, y: number, k: number) => {
        doc.setFillColor(c / 100, m / 100, y / 100, k / 100);
      };

      const setTextColorCMYK = (c: number, m: number, y: number, k: number) => {
        doc.setTextColor(c / 100, m / 100, y / 100, k / 100);
      };

      const setDrawColorCMYK = (c: number, m: number, y: number, k: number) => {
        doc.setDrawColor(c / 100, m / 100, y / 100, k / 100);
      };

      const fontCinzel = "Cinzel";
      const fontCinzelStyle = "normal";
      const fontCinzelBoldStyle = "bold";

      const fontGaramond = "Garamond";
      const fontGaramondStyle = "normal";

      const fontGaramondItalic = "Garamond";
      const fontGaramondItalicStyle = "italic";

      const fontGreatVibes = "GreatVibes";
      const fontGreatVibesStyle = "normal";

      const xOffset = isCropMarks ? 3 : 0;
      const yOffset = isCropMarks ? 3 : 0;

      // 1. Background
      if (isNavy) {
        setFillColorCMYK(93, 49, 0, 84); // Rich BSN Navy CMYK
      } else {
        setFillColorCMYK(0, 4, 11, 4); // Elegant Cream CMYK
      }
      doc.rect(0, 0, printWidth, printHeight, "F");

      // 2. Watermark Logo
      try {
        const logoImg = await loadImage(BSN_LOGO);
        const transparentLogoDataUrl = getTransparentLogoBase64(logoImg, isNavy ? 0.035 : 0.025);
        const watermarkSize = 180;
        const wx = xOffset + (baseWidth - watermarkSize) / 2;
        const wy = yOffset + (baseHeight - watermarkSize) / 2;
        doc.addImage(transparentLogoDataUrl, "PNG", wx, wy, watermarkSize, watermarkSize);
      } catch (err) {
        console.warn("Could not draw watermark logo in PDF:", err);
      }

      // 3. Borders & Margins
      if (isNavy) {
        setDrawColorCMYK(0, 29, 86, 12); // BSN Gold
      } else {
        setDrawColorCMYK(0, 45, 90, 45); // Darker Amber Gold
      }
      doc.setLineWidth(1.2);
      doc.rect(xOffset + 4, yOffset + 4, baseWidth - 8, baseHeight - 8, "S");
      doc.setLineWidth(0.4);
      doc.rect(xOffset + 5.5, yOffset + 5.5, baseWidth - 11, baseHeight - 11, "S");

      if (isNavy) {
        setDrawColorCMYK(0, 18, 73, 4); // BSN Gold Light
      } else {
        setDrawColorCMYK(0, 35, 90, 25); // Amber Gold
      }
      doc.setLineWidth(0.3);
      doc.rect(xOffset + 7.5, yOffset + 7.5, baseWidth - 15, baseHeight - 15, "S");

      const flOffset = 8.5;
      const flSize = 6;
      doc.setLineWidth(0.8);
      // Top-Left
      doc.line(xOffset + flOffset, yOffset + flOffset, xOffset + flOffset + flSize, yOffset + flOffset);
      doc.line(xOffset + flOffset, yOffset + flOffset, xOffset + flOffset, yOffset + flOffset + flSize);
      // Top-Right
      doc.line(xOffset + baseWidth - flOffset, yOffset + flOffset, xOffset + baseWidth - flOffset - flSize, yOffset + flOffset);
      doc.line(xOffset + baseWidth - flOffset, yOffset + flOffset, xOffset + baseWidth - flOffset, yOffset + flOffset + flSize);
      // Bottom-Left
      doc.line(xOffset + flOffset, yOffset + baseHeight - flOffset, xOffset + flOffset + flSize, yOffset + baseHeight - flOffset);
      doc.line(xOffset + flOffset, yOffset + baseHeight - flOffset, xOffset + flOffset, yOffset + baseHeight - flOffset - flSize);
      // Bottom-Right
      doc.line(xOffset + baseWidth - flOffset, yOffset + baseHeight - flOffset, xOffset + baseWidth - flOffset - flSize, yOffset + baseHeight - flOffset);
      doc.line(xOffset + baseWidth - flOffset, yOffset + baseHeight - flOffset, xOffset + baseWidth - flOffset, yOffset + baseHeight - flOffset - flSize);

      // 4. Header Logo
      try {
        const logoImg = await loadImage(BSN_LOGO);
        const logoSize = 38;
        const lx = xOffset + (baseWidth - logoSize) / 2;
        const ly = yOffset + 12;
        doc.addImage(logoImg, "PNG", lx, ly, logoSize, logoSize);
      } catch (err) {
        console.warn("Could not draw header logo in PDF:", err);
      }

      doc.setFont(fontCinzel, fontCinzelBoldStyle);
      doc.setFontSize(10);
      if (isNavy) {
        setTextColorCMYK(0, 4, 11, 4);
      } else {
        setTextColorCMYK(93, 49, 0, 84);
      }
      doc.text("BANDA SINFÔNICA NACIONAL", xOffset + baseWidth / 2, yOffset + 50, { align: "center" });

      if (isNavy) {
        setDrawColorCMYK(0, 29, 86, 12);
      } else {
        setDrawColorCMYK(0, 35, 90, 45);
      }
      doc.setLineWidth(0.4);
      doc.line(xOffset + baseWidth / 2 - 25, yOffset + 54, xOffset + baseWidth / 2 + 25, yOffset + 54);

      // 5. Titles & Content
      doc.setFont(fontCinzel, fontCinzelBoldStyle);
      doc.setFontSize(36);
      if (isNavy) {
        setTextColorCMYK(0, 18, 73, 4);
      } else {
        setTextColorCMYK(0, 35, 90, 45);
      }
      doc.text("CERTIFICADO", xOffset + baseWidth / 2, yOffset + 71, { align: "center" });

      doc.setFont(fontCinzel, fontCinzelStyle);
      doc.setFontSize(10);
      if (isNavy) {
        setTextColorCMYK(0, 29, 86, 12);
      } else {
        setTextColorCMYK(0, 45, 90, 45);
      }
      doc.text("Homenagem Comemorativa de 1º Ano", xOffset + baseWidth / 2, yOffset + 78.5, { align: "center" });

      doc.setFont(fontGaramondItalic, fontGaramondItalicStyle);
      doc.setFontSize(14);
      if (isNavy) {
        setTextColorCMYK(0, 4, 11, 20); // Dim Cream
      } else {
        setTextColorCMYK(0, 0, 0, 70); // Slate Gray
      }
      doc.text("Este certificado é concedido com honra a:", xOffset + baseWidth / 2, yOffset + 97.5, { align: "center" });

      doc.setFont(fontCinzel, fontCinzelBoldStyle);
      doc.setFontSize(32);
      if (isNavy) {
        setTextColorCMYK(0, 0, 0, 0); // Pure unprinted white paper color
      } else {
        setTextColorCMYK(93, 49, 0, 84); // BSN Deep Navy
      }
      doc.text(recipientName || "Nome do Homenageado", xOffset + baseWidth / 2, yOffset + 116, { align: "center" });

      if (isNavy) {
        setDrawColorCMYK(0, 29, 86, 25);
      } else {
        setDrawColorCMYK(0, 35, 90, 45);
      }
      doc.setLineWidth(0.3);
      doc.line(xOffset + baseWidth / 2 - 80, yOffset + 122.5, xOffset + baseWidth / 2 + 80, yOffset + 122.5);

      doc.setFont(fontGaramondItalic, fontGaramondItalicStyle);
      doc.setFontSize(13.5);
      if (isNavy) {
        setTextColorCMYK(0, 4, 11, 4);
      } else {
        setTextColorCMYK(0, 0, 0, 85);
      }
      const wrappedTextLines = doc.splitTextToSize(customText, 230);
      let descY = yOffset + 134;
      wrappedTextLines.forEach((line: string) => {
        doc.text(line, xOffset + baseWidth / 2, descY, { align: "center" });
        descY += 7;
      });

      // 6. Signatures Footer
      const footerY = yOffset + baseHeight - 43.5;

      if (isSingleSig) {
        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(10);
        if (isNavy) {
          setTextColorCMYK(0, 18, 73, 4);
        } else {
          setTextColorCMYK(0, 35, 90, 45);
        }
        doc.text(dateText, xOffset + 40, footerY + 14.5, { align: "center" });

        doc.setFont(fontGreatVibes, fontGreatVibesStyle);
        doc.setFontSize(22);
        if (isNavy) {
          setTextColorCMYK(0, 18, 73, 4);
        } else {
          setTextColorCMYK(0, 0, 0, 85);
        }
        doc.text(sig1Name, xOffset + baseWidth / 2, footerY + 5, { align: "center" });

        if (isNavy) {
          setDrawColorCMYK(0, 0, 0, 0);
        } else {
          setDrawColorCMYK(93, 49, 0, 84);
        }
        doc.setLineWidth(0.25);
        doc.line(xOffset + baseWidth / 2 - 30, footerY + 7, xOffset + baseWidth / 2 + 30, footerY + 7);

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(9);
        if (isNavy) {
          setTextColorCMYK(0, 0, 0, 0);
        } else {
          setTextColorCMYK(93, 49, 0, 84);
        }
        doc.text(sig1Name, xOffset + baseWidth / 2, footerY + 11, { align: "center" });

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(7.5);
        if (isNavy) {
          setTextColorCMYK(0, 0, 0, 40);
        } else {
          setTextColorCMYK(0, 0, 0, 60);
        }
        doc.text(sig1Role, xOffset + baseWidth / 2, footerY + 14.5, { align: "center" });

        drawEmblemSeal(doc, xOffset + baseWidth - 40 - 22, footerY + 1.5, 22);
      } else {
        doc.setFont(fontGreatVibes, fontGreatVibesStyle);
        doc.setFontSize(22);
        if (isNavy) {
          setTextColorCMYK(0, 18, 73, 4);
        } else {
          setTextColorCMYK(0, 0, 0, 85);
        }
        doc.text(sig1Name, xOffset + 55, footerY + 5, { align: "center" });

        if (isNavy) {
          setDrawColorCMYK(0, 0, 0, 0);
        } else {
          setDrawColorCMYK(93, 49, 0, 84);
        }
        doc.setLineWidth(0.25);
        doc.line(xOffset + 25, footerY + 7, xOffset + 85, footerY + 7);

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(9);
        if (isNavy) {
          setTextColorCMYK(0, 0, 0, 0);
        } else {
          setTextColorCMYK(93, 49, 0, 84);
        }
        doc.text(sig1Name, xOffset + 55, footerY + 11, { align: "center" });

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(7.5);
        if (isNavy) {
          setTextColorCMYK(0, 0, 0, 40);
        } else {
          setTextColorCMYK(0, 0, 0, 60);
        }
        doc.text(sig1Role, xOffset + 55, footerY + 14.5, { align: "center" });

        drawEmblemSeal(doc, xOffset + (baseWidth - 22) / 2, footerY + 1.5, 22);

        doc.setFont(fontGreatVibes, fontGreatVibesStyle);
        doc.setFontSize(22);
        if (isNavy) {
          setTextColorCMYK(0, 18, 73, 4);
        } else {
          setTextColorCMYK(0, 0, 0, 85);
        }
        doc.text(sig2Name, xOffset + baseWidth - 55, footerY + 5, { align: "center" });

        if (isNavy) {
          setDrawColorCMYK(0, 0, 0, 0);
        } else {
          setDrawColorCMYK(93, 49, 0, 84);
        }
        doc.setLineWidth(0.25);
        doc.line(xOffset + baseWidth - 85, footerY + 7, xOffset + baseWidth - 25, footerY + 7);

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(9);
        if (isNavy) {
          setTextColorCMYK(0, 0, 0, 0);
        } else {
          setTextColorCMYK(93, 49, 0, 84);
        }
        doc.text(sig2Name, xOffset + baseWidth - 55, footerY + 11, { align: "center" });

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(7.5);
        if (isNavy) {
          setTextColorCMYK(0, 0, 0, 40);
        } else {
          setTextColorCMYK(0, 0, 0, 60);
        }
        doc.text(sig2Role, xOffset + baseWidth - 55, footerY + 14.5, { align: "center" });

        doc.setFont(fontGaramond, fontGaramondStyle);
        doc.setFontSize(10);
        if (isNavy) {
          setTextColorCMYK(0, 18, 73, 4);
        } else {
          setTextColorCMYK(0, 35, 90, 45);
        }
        doc.text(dateText, xOffset + baseWidth / 2, footerY + 22, { align: "center" });
      }

      // 7. Crop Marks
      if (isCropMarks) {
        setDrawColorCMYK(0, 0, 0, 100);
        doc.setLineWidth(0.15);
        const lLen = 6;
        
        doc.line(0, 3, lLen, 3);
        doc.line(3, 0, 3, lLen);
        doc.line(printWidth, 3, printWidth - lLen, 3);
        doc.line(printWidth - 3, 0, printWidth - 3, lLen);
        doc.line(0, printHeight - 3, lLen, printHeight - 3);
        doc.line(3, printHeight, 3, printHeight - lLen);
        doc.line(printWidth, printHeight - 3, printWidth - lLen, printHeight - 3);
        doc.line(printWidth - 3, printHeight, printWidth - 3, printHeight - lLen);
      }

      doc.save(`certificado-${recipientName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Error generating CMYK PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
            size: ${printWidth}mm ${printHeight}mm;
            margin: 0;
          }
          
          /* Full page print dimensions */
          html, body, #__next, #root {
            width: ${printWidth}mm !important;
            height: ${printHeight}mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: ${isNavy ? BSN_NAVY : "#faf6ee"} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide app layout wrappers and keep only certificate canvas */
          main {
            min-height: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }
          
          .print-hidden-sidebar {
            display: none !important;
          }
          
          .certificate-canvas-container {
            width: ${printWidth}mm !important;
            height: ${printHeight}mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 9999 !important;
            background: ${isNavy ? BSN_NAVY : "#faf6ee"} !important;
          }
          
          .certificate-canvas-content {
            padding: 24mm !important;
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
              onClick={handleExportPDF}
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
              onClick={resetFields}
              className="w-full bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 transition-all py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões
            </button>

            <p className="text-[9px] text-slate-450 mt-2 leading-relaxed text-center px-1">
              💡 <strong>Dica Gráfica:</strong> O botão azul gera um arquivo PDF configurado nativamente no padrão <strong>CMYK de alta resolução</strong> (ideal para fidelidade de cores na impressão).
            </p>
          </div>

        </div>

      {/* 3. CERTIFICATE CANVAS WRAPPER (Landscape Preview) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 overflow-auto print:p-0 print:bg-transparent">
        
        {/* Prepress Outer Wrapper with Crop Marks if active */}
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
              
              {/* Cut Line Visual Overlay (Red Dashed) - screen only */}
              <div className="absolute inset-[15px] border border-dashed border-red-500/30 pointer-events-none z-30 print:hidden" />
            </>
          )}

          {/* Actual Certificate Card Canvas */}
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
            style={{ opacity: isNavy ? 0.035 : 0.025 }}
          >
            <img src={BSN_LOGO} alt="Watermark BSN" className="w-[580px] h-[580px] object-contain" />
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

                {/* Right side: 1-Year Anniversary Gold Emblem */}
                <div className="flex flex-col items-center justify-center mb-1">
                  <div 
                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center border relative"
                    style={{
                      borderColor: isNavy ? BSN_GOLD : "#b8860b",
                      background: isNavy ? `radial-gradient(circle, ${BSN_LIGHT_NAVY} 0%, ${BSN_DARK_BLUE} 100%)` : BSN_CREAM,
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
                    className="h-13 text-[22px] font-normal leading-none mb-0 flex items-center justify-center select-none"
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
                      background: isNavy ? `radial-gradient(circle, ${BSN_LIGHT_NAVY} 0%, ${BSN_DARK_BLUE} 100%)` : BSN_CREAM,
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
                    className="h-13 text-[22px] font-normal leading-none mb-0 flex items-center justify-center select-none"
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
