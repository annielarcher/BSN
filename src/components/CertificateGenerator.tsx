"use client";

import React, { useState, useEffect } from "react";
import { 
  CertificateCategory, 
  CertificateTheme, 
  CATEGORY_PRESETS 
} from "./certificate/types";
import { CertificateSidebar } from "./certificate/CertificateSidebar";
import { CertificatePreview } from "./certificate/CertificatePreview";
import { generateCertificatePDF } from "./certificate/pdf-exporter";

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

  useEffect(() => {
    if (category !== "custom") {
      setCustomText(CATEGORY_PRESETS[category].defaultText);
    }
  }, [category]);

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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateCertificatePDF({
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
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // On-screen dimensions (px)
  const is169 = aspectRatioMode === "16_9";
  const canvasWidth = 840;
  const canvasHeight = is169 ? 472.5 : 594;
  const bleedPadding = isCropMarks ? 15 : 0;
  
  const outerWidth = canvasWidth + (bleedPadding * 2);
  const outerHeight = canvasHeight + (bleedPadding * 2);

  return (
    <div className="w-full min-h-screen flex bg-slate-950 text-slate-100 print:bg-transparent print:text-black">
      {/* Dynamic Head Import for Google Fonts & Print CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @media print {
          body {
            background: transparent !important;
            color: black !important;
          }
          .certificate-canvas-container {
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}} />

      {/* 1. Sidebar Controls */}
      <CertificateSidebar
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        category={category}
        setCategory={setCategory}
        customText={customText}
        setCustomText={setCustomText}
        dateText={dateText}
        setDateText={setDateText}
        theme={theme}
        setTheme={setTheme}
        sig1Name={sig1Name}
        setSig1Name={setSig1Name}
        sig1Role={sig1Role}
        setSig1Role={setSig1Role}
        sig2Name={sig2Name}
        setSig2Name={setSig2Name}
        sig2Role={sig2Role}
        setSig2Role={setSig2Role}
        isSingleSig={isSingleSig}
        setIsSingleSig={setIsSingleSig}
        aspectRatioMode={aspectRatioMode}
        setAspectRatioMode={setAspectRatioMode}
        setIsCropMarks={setIsCropMarks}
        isExporting={isExporting}
        onExportPDF={handleExportPDF}
        onResetFields={resetFields}
      />

      {/* 2. Certificate Landscape Canvas Preview */}
      <CertificatePreview
        recipientName={recipientName}
        customText={customText}
        dateText={dateText}
        theme={theme}
        sig1Name={sig1Name}
        sig1Role={sig1Role}
        sig2Name={sig2Name}
        sig2Role={sig2Role}
        isSingleSig={isSingleSig}
        isCropMarks={isCropMarks}
        aspectRatioMode={aspectRatioMode}
        outerWidth={outerWidth}
        outerHeight={outerHeight}
        bleedPadding={bleedPadding}
      />
    </div>
  );
}
