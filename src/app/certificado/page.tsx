import React from "react";
import { CertificateGenerator } from "@/components/CertificateGenerator";

export default function CertificadoPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center print:bg-transparent print:text-black print:min-h-0 print:py-0">
      <CertificateGenerator />
    </main>
  );
}
