import React from "react";
import { MapPin, Calendar, Clock, Mic2, Wrench, ChevronRight, Navigation } from "lucide-react";

export interface Guest {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

export interface EventActivity {
  id: string;
  title: string;
  type: string;
  items?: string[];
  guestIds?: string[];
}

export interface EventFlyerProps {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  locationUrl?: string;
  entryFee: string;
  activities: EventActivity[];
  guests: Guest[];
  director: Guest;
}

const GOLD = "#e0a020";
const GOLD_LIGHT = "#f5c842";
const TEAL = "#00c9b1";
const DARK = "#07080e";
const CONDUCTOR_PHOTO = "https://images.unsplash.com/photo-1617544517234-c436b0624a34?w=600&h=900&fit=crop&auto=format";
const BSN_LOGO = "https://i.ibb.co/RT04KgYz/BSN-logo-no-BG.png";

function PersonCard({ photo, name, role }: { photo?: string; name: string; role?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#07080e] flex items-center justify-center relative"
        style={{ boxShadow: `0 0 0 2px ${GOLD_LIGHT}` }}
      >
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <span className="text-[10px] font-bold text-white/40">FOTO</span>
        )}
      </div>
      <p className="text-[10px] font-bold leading-tight line-clamp-1" style={{ color: "#f5ead8", fontFamily: "'Raleway',sans-serif" }}>
        {name}
      </p>
      {role && (
        <p className="text-[9px] font-semibold line-clamp-1" style={{ color: TEAL }}>
          {role}
        </p>
      )}
    </div>
  );
}

export function EventFlyer({
  title,
  subtitle,
  date,
  time,
  location,
  entryFee,
  activities,
  guests,
  director,
}: EventFlyerProps) {

  // Helper to safely get guest by id
  const getGuest = (id: string) => guests.find((g) => g.id === id);

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center py-8 px-4 print:py-0 print:px-0"
      style={{ background: "#04050a", fontFamily: "'Raleway', sans-serif" }}
    >
      {/* Import external fonts dynamically to guarantee the design looks exactly as intended */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=Raleway:wght@400;600;700;900&display=swap');
      `}} />

      {/* Flyer container — fixed A4-ish proportion */}
      <div
        className="relative w-full overflow-hidden print:shadow-none print:max-w-none print:rounded-none"
        style={{
          maxWidth: 480,
          aspectRatio: "5 / 7",
          background: DARK,
          borderRadius: 20,
          boxShadow: "0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(224,160,32,0.15)",
        }}
      >

        {/* ── HERO PHOTO with teal duotone overlay ── */}
        <div className="absolute inset-0">
          <img
            src={CONDUCTOR_PHOTO}
            alt="Maestro em ação"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.55, filter: "grayscale(60%) contrast(1.1)" }}
          />
          {/* Teal color overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(160deg, rgba(0,201,177,0.35) 0%, rgba(7,8,14,0.2) 50%, rgba(7,8,14,0.0) 100%)`,
              mixBlendMode: "screen",
            }}
          />
          {/* Dark fade bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, rgba(7,8,14,0.2) 0%, rgba(7,8,14,0.55) 42%, rgba(7,8,14,0.97) 70%, ${DARK} 88%)`,
            }}
          />
          {/* Dark fade left edge */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to right, rgba(7,8,14,0.6) 0%, transparent 55%)`,
            }}
          />
        </div>

        {/* ── DIAGONAL GOLD SLASH ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            clipPath: "polygon(62% 0%, 72% 0%, 52% 100%, 42% 100%)",
            background: `linear-gradient(160deg, rgba(245,200,66,0.18) 0%, rgba(224,160,32,0.06) 100%)`,
            borderLeft: `1px solid rgba(245,200,66,0.3)`,
          }}
        />
        {/* ── DIAGONAL TEAL SLASH ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            clipPath: "polygon(74% 0%, 80% 0%, 60% 100%, 54% 100%)",
            background: `linear-gradient(160deg, rgba(0,201,177,0.15) 0%, rgba(0,201,177,0.04) 100%)`,
          }}
        />

        {/* ── VERTICAL SIDE TEXT ── */}
        <div
          className="absolute right-4 top-[40%] flex flex-col items-center gap-1 pointer-events-none"
          style={{ transform: "rotate(90deg)", transformOrigin: "center center", marginRight: -32 }}
        >
          <span
            className="text-[8px] font-bold tracking-[0.35em] uppercase whitespace-nowrap"
            style={{ color: "rgba(245,200,66,0.35)" }}
          >
            {subtitle} · {new Date().getFullYear()}
          </span>
        </div>

        {/* ── CONTENT layer ── */}
        <div className="absolute inset-0 flex flex-col px-7 pt-7 pb-6 z-10">

          {/* Top bar: logo + badge */}
          <div className="flex items-center justify-between mb-auto">
            <div className="w-14 h-14">
              <img
                src={BSN_LOGO}
                alt="BSN Logo"
                className="w-full h-full object-contain"
                style={{ filter: `drop-shadow(0 0 8px rgba(224,160,32,0.7))` }}
              />
            </div>
            <span
              className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: DARK,
                letterSpacing: "0.18em",
              }}
            >
              Entrada Franca
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Main title block */}
          <div className="mb-5">
            <p
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-0.5"
              style={{ color: TEAL }}
            >
              {title.split(" ")[0]}
            </p>
            <div className="flex flex-col">
              <h1
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "clamp(2.6rem, 9vw, 3.6rem)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                  textShadow: "0 2px 30px rgba(0,0,0,0.6)",
                }}
              >
                {title.split(" ")[1]}
              </h1>
              <h1
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "clamp(2.6rem, 9vw, 3.6rem)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  background: `linear-gradient(120deg, ${GOLD_LIGHT} 0%, ${GOLD} 70%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.01em",
                }}
              >
                {title.split(" ").slice(2).join(" ")}
              </h1>
            </div>
          </div>

          {/* Date / time / address row */}
          <div className="flex items-start gap-3 mb-5">
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Calendar size={12} style={{ color: GOLD_LIGHT }} />
              <span className="text-[10px] font-bold" style={{ color: "#f5ead8" }}>{date}</span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Clock size={12} style={{ color: GOLD_LIGHT }} />
              <span className="text-[10px] font-bold" style={{ color: "#f5ead8" }}>{time}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-5">
            <Navigation size={12} className="mt-0.5 shrink-0" style={{ color: TEAL }} />
            <div>
              <p className="text-[11px] font-bold leading-tight" style={{ color: "#f5ead8" }}>
                {location}
              </p>
              <p className="text-[9px] mt-0.5" style={{ color: "#4a6a66" }}>
                Ver no mapa
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-4"
            style={{ background: `linear-gradient(90deg, ${TEAL}44, ${GOLD}55, transparent)` }}
          />

          {/* Programação label */}
          <p
            className="text-[8px] font-black tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(245,200,66,0.5)" }}
          >
            Programação
          </p>

          {/* People grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">

            {/* Roda de conversa */}
            <div
              className="rounded-2xl p-3 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Mic2 size={10} style={{ color: GOLD_LIGHT }} />
                <p className="text-[8px] font-black tracking-widest uppercase" style={{ color: GOLD_LIGHT }}>
                  Roda de Conversa
                </p>
              </div>
              <div className="flex justify-around">
                <PersonCard 
                  photo={getGuest("alexandre")?.imageUrl} 
                  name={getGuest("alexandre")?.name || "Alexandre Rocha"} 
                  role={getGuest("alexandre")?.role} 
                />
                <PersonCard 
                  photo={getGuest("eduardo")?.imageUrl} 
                  name={getGuest("eduardo")?.name || "Eduardo Lagreca Fan"} 
                  role={getGuest("eduardo")?.role} 
                />
              </div>
            </div>

            {/* Convidados */}
            <div
              className="rounded-2xl p-3 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Mic2 size={10} style={{ color: GOLD_LIGHT }} />
                <p className="text-[8px] font-black tracking-widest uppercase" style={{ color: GOLD_LIGHT }}>
                  Convidados
                </p>
              </div>
              <div className="flex justify-around">
                <PersonCard 
                  photo={getGuest("roberto")?.imageUrl} 
                  name={getGuest("roberto")?.name || "Roberto Weingrill Jr."} 
                  role={getGuest("roberto")?.role} 
                />
                <PersonCard 
                  photo={getGuest("reginaldo")?.imageUrl} 
                  name={getGuest("reginaldo")?.name || "Reginaldo de Jesus"} 
                  role={getGuest("reginaldo")?.role} 
                />
              </div>
            </div>
          </div>

          {/* Oficinas + Direção */}
          <div className="flex items-center justify-between gap-3">
            <div
              className="flex-1 rounded-2xl px-3 py-2.5 backdrop-blur-sm h-full flex flex-col justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-1 mb-1.5">
                <Wrench size={9} style={{ color: TEAL }} />
                <p className="text-[8px] font-black tracking-widest uppercase" style={{ color: TEAL }}>
                  Oficina & Mostra
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-start gap-1">
                  <ChevronRight size={9} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <p className="text-[9px] leading-tight" style={{ color: "#c8bfaa" }}>
                    Luthieria com <span className="font-bold text-[#f5ead8]">Reginaldo</span>
                  </p>
                </div>
                <div className="flex items-start gap-1 mt-0.5">
                  <ChevronRight size={9} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <p className="text-[9px] leading-tight" style={{ color: "#c8bfaa" }}>
                    Amostra Weril com <span className="font-bold text-[#f5ead8]">Roberto W.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Direção artística */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-14 h-14 rounded-full overflow-hidden bg-[#07080e] flex items-center justify-center shrink-0"
                style={{ boxShadow: `0 0 0 2px ${GOLD_LIGHT}, 0 0 16px rgba(224,160,32,0.3)` }}
              >
                {director.imageUrl ? (
                  <img
                    src={director.imageUrl}
                    alt={director.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-white/40">FOTO</span>
                )}
              </div>
              <p className="text-[9px] font-bold text-center leading-tight line-clamp-1" style={{ color: "#f5ead8" }}>
                {director.name}
              </p>
              <p className="text-[8px] text-center line-clamp-1" style={{ color: GOLD }}>{director.role}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Exemplo configurado exportado para o app visualizá-lo
export function SinfonicaEventFlyer() {
  return (
    <EventFlyer
      title="Primeiro Encontro Musical"
      subtitle="Banda Sinfônica Nacional"
      date="17 Jul · Sex"
      time="18h30"
      location="Catedral Presbiteriana do Rio de Janeiro"
      entryFee="Franca"
      activities={[]}
      guests={[
        { id: "alexandre", name: "Alexandre Rocha", role: "Maestro", imageUrl: "https://i.ibb.co/3y59L7mb/Whats-App-Image-2026-01-29-at-19-04-21.jpg" },
        { id: "eduardo", name: "Eduardo Lagreca Fan", role: "Maestro", imageUrl: "/Images/Eduardo-lagreca-fan.jpeg.jpeg" },
        { id: "reginaldo", name: "Reginaldo de Jesus", role: "Oficina Luthieria", imageUrl: "/Images/Reginaldo-Jesus.jpeg" },
        { id: "roberto", name: "Roberto Weingrill Jr.", role: "Amostra Weril", imageUrl: "/Images/Roberto-Weingrill.jpeg" },
      ]}
      director={{ id: "geyzi", name: "Geyzi Moreira", role: "Dir. Artística", imageUrl: "https://i.ibb.co/Jw1wR0n7/Whats-App-Image-2026-01-30-at-18-58-42.jpg" }}
    />
  );
}
