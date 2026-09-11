export type ImageAsset = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type VideoAsset = {
  id: string;
  description: string;
  embedId: string;
  source: 'youtube' | 'vimeo';
  thumbnailId: string;
};

export const ImageAssets: ImageAsset[] = [
  {
    "id": "institutional-hero",
    "description": "Banda Sinfônica Nacional em concerto",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "orchestra stage"
  },
  {
    "id": "bsn-logo",
    "description": "Logo Oficial Banda Sinfônica Nacional",
    "imageUrl": "/Images/BSN-logo-no-BG.png",
    "imageHint": "banda sinfonica logo"
  },
  {
    "id": "bsn-logo-footer",
    "description": "Logo Footer Banda Sinfônica Nacional",
    "imageUrl": "/Images/BSN-logo-no-BG.png",
    "imageHint": "banda sinfonica logo footer"
  },
  {
    "id": "geyzi-moreira",
    "description": "Maestra Geyzi Moreira",
    "imageUrl": "/Images/geyzi-moreira.jpg",
    "imageHint": "woman headshot"
  },
  {
    "id": "alexandre-rocha",
    "description": "Maestro Alexandre Rocha",
    "imageUrl": "/Images/alexandre-rocha.jpg",
    "imageHint": "man headshot"
  },
  {
    "id": "diogo-perdigao",
    "description": "Diogo Perdigão",
    "imageUrl": "/Images/alexandre-rocha.jpg",
    "imageHint": "man portrait"
  },
  {
    "id": "eduardo-lagreca",
    "description": "Maestro Eduardo Lagreca Fan",
    "imageUrl": "/Images/Eduardo-lagreca-fan.jpeg.jpeg",
    "imageHint": "classical music"
  },
  {
    "id": "Roberto-weingrill",
    "description": "Roberto Weingrill Jr.",
    "imageUrl": "/Images/Roberto-Weingrill..jpeg",
    "imageHint": "classical music"
  },
  {
    "id": "reginaldo-de-jesus",
    "description": "Reginaldo de Jesus",
    "imageUrl": "/Images/Reginaldo-Jesus.jpeg",
    "imageHint": "classical music"
  },
  {
    "id": "queen-band",
    "description": "Queen Sinfônica",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "rock band"
  },
  {
    "id": "orchestra",
    "description": "Banda Sinfônica Nacional",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "orchestra concert"
  },
  {
    "id": "video-cta",
    "description": "Banda Sinfônica Nacional",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "rock singer"
  },
  {
    "id": "news-queen-sinfonica",
    "description": "Queen Sinfônica",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "rock band orchestra"
  },
  {
    "id": "news-musica-no-museu",
    "description": "Música no Museu",
    "imageUrl": "/Images/portfolio-geyzi/musica-no-museu.png",
    "imageHint": "orchestra stage"
  },
  {
    "id": "news-rio-harp-festival",
    "description": "Rio Harp Festival",
    "imageUrl": "/flyers/ccbb-rioharpfestival.png",
    "imageHint": "orchestra concert"
  },
  {
    "id": "testimonial-1",
    "description": "Vilani",
    "imageUrl": "/Images/geyzi-moreira.jpg",
    "imageHint": "person portrait"
  },
  {
    "id": "testimonial-2",
    "description": "sergio",
    "imageUrl": "/Images/alexandre-rocha.jpg",
    "imageHint": "person portrait"
  },
  {
    "id": "testimonial-3",
    "description": "peter",
    "imageUrl": "/Images/alexandre-rocha.jpg",
    "imageHint": "person portrait"
  },
  {
    "id": "testimonial-4",
    "description": "Jorge Paula",
    "imageUrl": "/Images/jorge-paula.jpeg",
    "imageHint": "person portrait"
  },
  {
    "id": "gallery-1",
    "description": "BSN em Concerto",
    "imageUrl": "/Images/portfolio-geyzi/bsn-16.8.25.png",
    "imageHint": "orchestra stage"
  },
  {
    "id": "gallery-2",
    "description": "BSN Solistas",
    "imageUrl": "/Images/portfolio-geyzi/CFN-1.jpeg",
    "imageHint": "orchestra violin"
  },
  {
    "id": "gallery-3",
    "description": "Regência",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "orchestra conductor"
  },
  {
    "id": "gallery-4",
    "description": "Concerto",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "symphony orchestra"
  },
  {
    "id": "gallery-5",
    "description": "Concerto",
    "imageUrl": "/flyers/ccbb-rioharpfestival.png",
    "imageHint": "orchestra cellist"
  },
  {
    "id": "gallery-6",
    "description": "Apresentação",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "orchestra performance"
  },
  {
    "id": "gallery-7",
    "description": "Apresentação",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "symphony music"
  },
  {
    "id": "gallery-8",
    "description": "Música Sinfônica",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-9",
    "description": "Concerto",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-10",
    "description": "Encerramento do Concerto",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-11",
    "description": "Sesc Flamengo",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-12",
    "description": "Sesc Flamengo",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-13",
    "description": "Sesc Flamengo",
    "imageUrl": "/Images/bsn-hero.jpg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-14",
    "description": "CCBB RJ",
    "imageUrl": "/Images/portfolio-geyzi/CFN-1.jpeg",
    "imageHint": "classical music"
  },
  {
    "id": "gallery-15",
    "description": "CCBB RJ",
    "imageUrl": "/Images/portfolio-geyzi/CFN-1.jpeg",
    "imageHint": "classical music"
  },
  {
    "id": "weril-logo",
    "description": "Weril Logo",
    "imageUrl": "/parceiros/weril.webp",
    "imageHint": "weril logo"
  },
  {
    "id": "reginaldo-logo",
    "description": "RJF Luthier Logo",
    "imageUrl": "/parceiros/rjf-luthier.png",
    "imageHint": "rjf luthier logo"
  },
  {
    "id": "flyer-tmrj-assyrio",
    "description": "Flyer Oficial - Concerto Clássicos Mundiais no Salão Assyrio (Hero Full Bleed)",
    "imageUrl": "/flyers/theatro-municipal-assyrio-hero.png",
    "imageHint": "flyer theatro municipal assyrio hero"
  },
  {
    "id": "flyer-tmrj-assyrio-coluna",
    "description": "Flyer Oficial - Concerto Clássicos Mundiais no Salão Assyrio (Coluna Monumental)",
    "imageUrl": "/flyers/theatro-municipal-assyrio-coluna.png",
    "imageHint": "flyer theatro municipal assyrio coluna monumental"
  },
  {
    "id": "flyer-joao-caetano",
    "description": "Flyer Oficial - Concerto Clássicos Mundiais no Teatro João Caetano",
    "imageUrl": "/flyers/joao-caetano.png",
    "imageHint": "flyer teatro joao caetano"
  },
  {
    "id": "flyer-painel-sinfonico",
    "description": "Flyer Oficial - I Painel Sinfônico Diálogos & Sons",
    "imageUrl": "/flyers/painel-sinfonico.png",
    "imageHint": "flyer painel sinfonico"
  },
  {
    "id": "flyer-ccbb-rioharpfestival",
    "description": "Flyer Oficial - XXI RioHarpFestival no CCBB",
    "imageUrl": "/flyers/ccbb-rioharpfestival.png",
    "imageHint": "flyer ccbb rioharpfestival"
  }
];

export const VideoAssets: VideoAsset[] = [
  {
    "id": "video-musica-museu",
    "description": "O Sole Mio - Banda Sinfônica Nacional - Tenor Wladimir Cabanas",
    "embedId": "_fPvCNMoMo4",
    "source": "youtube",
    "thumbnailId": "news-musica-no-museu"
  },
  {
    "id": "video-sons-brasil",
    "description": "Xote das meninas",
    "embedId": "ypj77Ma0Iog",
    "source": "youtube",
    "thumbnailId": "gallery-15"
  },
  {
    "id": "video-queen-special",
    "description": "Highland Cathedral - Banda Sinfônica Nacional - Brazilian Piper",
    "embedId": "_rYVjF8il90",
    "source": "youtube",
    "thumbnailId": "news-musica-no-museu"
  },
  {
    "id": "video-queen-melhores-momentos",
    "description": "Melhores Momentos do Queen Sinfônica",
    "embedId": "2-KYx1KSUfE",
    "source": "youtube",
    "thumbnailId": "news-queen-sinfonica"
  }
];
