import { jsPDF } from "jspdf";
import { BSN_LOGO, CertificateTheme } from "./types";

// Helper to fetch custom fonts and convert to base64
const fetchFontBase64 = async (url: string): Promise<string> => {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch font at ${url}: status ${resp.status}`);
  }
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64 = base64data.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper to load image as HTMLImageElement
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

// Helper to render transparent PNG for PDF watermark
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

interface ExportPDFParams {
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
}

export const generateCertificatePDF = async (params: ExportPDFParams): Promise<void> => {
  const {
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
    aspectRatioMode
  } = params;

  const isNavy = theme === "navy";
  const baseWidth = 297;
  const baseHeight = aspectRatioMode === "16_9" ? 167.06 : 210;
  const bleedVal = 3;
  const printWidth = isCropMarks ? baseWidth + bleedVal * 2 : baseWidth;
  const printHeight = isCropMarks ? baseHeight + bleedVal * 2 : baseHeight;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [printWidth, printHeight]
  });

  const setFillColorCMYK = (c: number, m: number, y: number, k: number) => {
    doc.setFillColor(c / 100, m / 100, y / 100, k / 100);
  };

  const setTextColorCMYK = (c: number, m: number, y: number, k: number) => {
    doc.setTextColor(c / 100, m / 100, y / 100, k / 100);
  };

  const setDrawColorCMYK = (c: number, m: number, y: number, k: number) => {
    doc.setDrawColor(c / 100, m / 100, y / 100, k / 100);
  };

  // Setup custom fonts
  let hasCustomFonts = false;
  try {
    const [cinzelData, garamondData, garamondItalicData, greatVibesData] = await Promise.all([
      fetchFontBase64("/fonts/Cinzel.ttf"),
      fetchFontBase64("/fonts/Garamond.ttf"),
      fetchFontBase64("/fonts/Garamond-Italic.ttf"),
      fetchFontBase64("/fonts/GreatVibes.ttf")
    ]);

    doc.addFileToVFS("Cinzel.ttf", cinzelData);
    doc.addFont("Cinzel.ttf", "Cinzel", "normal");

    doc.addFileToVFS("Garamond.ttf", garamondData);
    doc.addFont("Garamond.ttf", "Garamond", "normal");

    doc.addFileToVFS("Garamond-Italic.ttf", garamondItalicData);
    doc.addFont("Garamond-Italic.ttf", "Garamond", "italic");

    doc.addFileToVFS("GreatVibes.ttf", greatVibesData);
    doc.addFont("GreatVibes.ttf", "GreatVibes", "normal");

    hasCustomFonts = true;
  } catch (err) {
    console.warn("Failed to load Google Fonts into jsPDF, falling back to standard fonts:", err);
  }

  const fontCinzel = hasCustomFonts ? "Cinzel" : "times";
  const fontGaramond = hasCustomFonts ? "Garamond" : "times";
  const fontGreatVibes = hasCustomFonts ? "GreatVibes" : "times";

  const xOffset = isCropMarks ? 3 : 0;
  const yOffset = isCropMarks ? 3 : 0;

  // 1. Background
  if (isNavy) {
    setFillColorCMYK(93, 49, 0, 84); // Rich BSN Navy
  } else {
    setFillColorCMYK(0, 4, 11, 4); // Elegant Cream
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
    setDrawColorCMYK(0, 29, 86, 12);
  } else {
    setDrawColorCMYK(0, 45, 90, 45);
  }
  doc.setLineWidth(1.2);
  doc.rect(xOffset + 4, yOffset + 4, baseWidth - 8, baseHeight - 8, "S");
  doc.setLineWidth(0.4);
  doc.rect(xOffset + 5.5, yOffset + 5.5, baseWidth - 11, baseHeight - 11, "S");

  if (isNavy) {
    setDrawColorCMYK(0, 18, 73, 4);
  } else {
    setDrawColorCMYK(0, 35, 90, 25);
  }
  doc.setLineWidth(0.3);
  doc.rect(xOffset + 7.5, yOffset + 7.5, baseWidth - 15, baseHeight - 15, "S");

  const flOffset = 8.5;
  const flSize = 6;
  doc.setLineWidth(0.8);
  // Corner flourishes
  doc.line(xOffset + flOffset, yOffset + flOffset, xOffset + flOffset + flSize, yOffset + flOffset);
  doc.line(xOffset + flOffset, yOffset + flOffset, xOffset + flOffset, yOffset + flOffset + flSize);
  doc.line(xOffset + baseWidth - flOffset, yOffset + flOffset, xOffset + baseWidth - flOffset - flSize, yOffset + flOffset);
  doc.line(xOffset + baseWidth - flOffset, yOffset + flOffset, xOffset + baseWidth - flOffset, yOffset + flOffset + flSize);
  doc.line(xOffset + flOffset, yOffset + baseHeight - flOffset, xOffset + flOffset + flSize, yOffset + baseHeight - flOffset);
  doc.line(xOffset + flOffset, yOffset + baseHeight - flOffset, xOffset + flOffset, yOffset + baseHeight - flOffset - flSize);
  doc.line(xOffset + baseWidth - flOffset, yOffset + baseHeight - flOffset, xOffset + baseWidth - flOffset - flSize, yOffset + baseHeight - flOffset);
  doc.line(xOffset + baseWidth - flOffset, yOffset + baseHeight - flOffset, xOffset + baseWidth - flOffset, yOffset + baseHeight - flOffset - flSize);

  // 4. Header Logo & BSN Title
  try {
    const logoImg = await loadImage(BSN_LOGO);
    const logoSize = 38;
    const lx = xOffset + (baseWidth - logoSize) / 2;
    const ly = yOffset + 12;
    doc.addImage(logoImg, "PNG", lx, ly, logoSize, logoSize);
  } catch (err) {
    console.warn("Could not draw header logo in PDF:", err);
  }

  doc.setFont(fontCinzel, "normal");
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
  doc.setFont(fontCinzel, "normal");
  doc.setFontSize(36);
  if (isNavy) {
    setTextColorCMYK(0, 18, 73, 4);
  } else {
    setTextColorCMYK(0, 35, 90, 45);
  }
  doc.text("CERTIFICADO", xOffset + baseWidth / 2, yOffset + 71, { align: "center" });

  doc.setFont(fontCinzel, "normal");
  doc.setFontSize(10);
  if (isNavy) {
    setTextColorCMYK(0, 29, 86, 12);
  } else {
    setTextColorCMYK(0, 45, 90, 45);
  }
  doc.text("Homenagem Comemorativa de 1º Ano", xOffset + baseWidth / 2, yOffset + 78.5, { align: "center" });

  doc.setFont(fontGaramond, "italic");
  doc.setFontSize(14);
  if (isNavy) {
    setTextColorCMYK(0, 4, 11, 20);
  } else {
    setTextColorCMYK(0, 0, 0, 70);
  }
  doc.text("Este certificado é concedido com honra a:", xOffset + baseWidth / 2, yOffset + 97.5, { align: "center" });

  // Recipient Name
  doc.setFont(fontCinzel, "normal");
  doc.setFontSize(32);
  if (isNavy) {
    setTextColorCMYK(0, 0, 0, 0);
  } else {
    setTextColorCMYK(93, 49, 0, 84);
  }
  doc.text(recipientName || "Nome do Homenageado", xOffset + baseWidth / 2, yOffset + 116, { align: "center" });

  if (isNavy) {
    setDrawColorCMYK(0, 29, 86, 25);
  } else {
    setDrawColorCMYK(0, 35, 90, 45);
  }
  doc.setLineWidth(0.3);
  doc.line(xOffset + baseWidth / 2 - 80, yOffset + 122.5, xOffset + baseWidth / 2 + 80, yOffset + 122.5);

  // Description text
  doc.setFont(fontGaramond, "italic");
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

  // Function to draw gold emblem seal
  const drawEmblemSeal = (sx: number, sy: number, size: number) => {
    const cx = sx + size / 2;
    const cy = sy + size / 2;
    const r = size / 2;

    setDrawColorCMYK(0, 18, 73, 4);
    setFillColorCMYK(0, 29, 86, 12);
    doc.ellipse(cx, cy, r, r, "F");

    doc.setLineWidth(0.4);
    doc.ellipse(cx, cy, r, r, "S");
    doc.ellipse(cx, cy, r - 0.8, r - 0.8, "S");

    doc.setFont(fontCinzel, "normal");
    doc.setFontSize(6.5);
    setTextColorCMYK(93, 49, 0, 84);
    doc.text("BSN", cx, cy - 2.5, { align: "center" });

    doc.setFontSize(9.5);
    doc.text("1º Ano", cx, cy + 1, { align: "center" });

    doc.setFontSize(5.5);
    doc.text("2025-2026", cx, cy + 4, { align: "center" });
  };

  if (isSingleSig) {
    // Left: Date
    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(10);
    if (isNavy) {
      setTextColorCMYK(0, 18, 73, 4);
    } else {
      setTextColorCMYK(0, 35, 90, 45);
    }
    doc.text(dateText, xOffset + 40, footerY + 14.5, { align: "center" });

    // Center: Signature 1
    doc.setFont(fontGreatVibes, "normal");
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

    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(9);
    if (isNavy) {
      setTextColorCMYK(0, 0, 0, 0);
    } else {
      setTextColorCMYK(93, 49, 0, 84);
    }
    doc.text(sig1Name, xOffset + baseWidth / 2, footerY + 11, { align: "center" });

    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(7.5);
    if (isNavy) {
      setTextColorCMYK(0, 0, 0, 40);
    } else {
      setTextColorCMYK(0, 0, 0, 60);
    }
    doc.text(sig1Role, xOffset + baseWidth / 2, footerY + 14.5, { align: "center" });

    // Right: Seal
    drawEmblemSeal(xOffset + baseWidth - 40 - 22, footerY + 1.5, 22);
  } else {
    // Dual Signatures
    doc.setFont(fontGreatVibes, "normal");
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

    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(9);
    if (isNavy) {
      setTextColorCMYK(0, 0, 0, 0);
    } else {
      setTextColorCMYK(93, 49, 0, 84);
    }
    doc.text(sig1Name, xOffset + 55, footerY + 11, { align: "center" });

    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(7.5);
    if (isNavy) {
      setTextColorCMYK(0, 0, 0, 40);
    } else {
      setTextColorCMYK(0, 0, 0, 60);
    }
    doc.text(sig1Role, xOffset + 55, footerY + 14.5, { align: "center" });

    // Center Seal
    drawEmblemSeal(xOffset + (baseWidth - 22) / 2, footerY + 1.5, 22);

    // Signature 2
    doc.setFont(fontGreatVibes, "normal");
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

    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(9);
    if (isNavy) {
      setTextColorCMYK(0, 0, 0, 0);
    } else {
      setTextColorCMYK(93, 49, 0, 84);
    }
    doc.text(sig2Name, xOffset + baseWidth - 55, footerY + 11, { align: "center" });

    doc.setFont(fontGaramond, "normal");
    doc.setFontSize(7.5);
    if (isNavy) {
      setTextColorCMYK(0, 0, 0, 40);
    } else {
      setTextColorCMYK(0, 0, 0, 60);
    }
    doc.text(sig2Role, xOffset + baseWidth - 55, footerY + 14.5, { align: "center" });

    // Date below dual signatures
    doc.setFont(fontGaramond, "normal");
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

  doc.save(`certificado-bsn-${recipientName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
};
