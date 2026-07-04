export const BSN_NAVY = "#031529";
export const BSN_DARK_BLUE = "#020d1a";
export const BSN_LIGHT_NAVY = "#0a2240";
export const BSN_GOLD = "#e0a020";
export const BSN_GOLD_LIGHT = "#f5c842";
export const BSN_CREAM = "#f5ead8";
export const BSN_LOGO = "https://i.ibb.co/RT04KgYz/BSN-logo-no-BG.png";

export type CertificateCategory = "musico" | "apoiador" | "colaborador" | "custom";
export type CertificateTheme = "navy" | "saver";

export interface CategoryPreset {
  title: string;
  defaultText: string;
}

export const CATEGORY_PRESETS: Record<CertificateCategory, CategoryPreset> = {
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
