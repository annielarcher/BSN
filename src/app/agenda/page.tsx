import { Calendar, MapPin, Clock, ArrowRight, Ticket, Music, ExternalLink, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { parsePtBrDate } from '@/lib/utils';
import { ImageAssets } from '@/lib/placeholder-images';
import eventosData from '@/lib/eventos.json';

export const metadata: Metadata = {
  title: 'Agenda de Concertos — Banda Sinfônica Nacional',
  description: 'Consulte a agenda oficial de concertos da Banda Sinfônica Nacional. Veja nossas próximas apresentações no Salão Assyrio do Theatro Municipal e relembre edições passadas.',
};

export default function AgendaPage() {
  // Data atual (meia-noite) para comparação justa
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Filtra os eventos futuros (data maior ou igual a hoje) e ordena do mais próximo pro mais distante
  const upcomingEvents = eventosData.events
    .filter(event => parsePtBrDate(event.date).getTime() >= hoje.getTime())
    .sort((a, b) => parsePtBrDate(a.date).getTime() - parsePtBrDate(b.date).getTime());

  // Filtra os eventos passados (data menor que hoje) e ordena do mais recente pro mais antigo
  const pastEvents = eventosData.events
    .filter(event => parsePtBrDate(event.date).getTime() < hoje.getTime())
    .sort((a, b) => parsePtBrDate(b.date).getTime() - parsePtBrDate(a.date).getTime());

  const nextEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1);
  const nextEventImage = nextEvent ? ImageAssets.find(img => img.id === nextEvent.imageId) : null;
  const nextEventDay = nextEvent ? nextEvent.date.split(' de ')[0] : '';
  const nextEventMonth = nextEvent ? nextEvent.date.split(' de ')[1]?.substring(0, 3).toUpperCase() : '';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-card/80 via-card/40 to-background border-b border-border/40 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Programação Oficial 2026
            </div>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-4">
              Agenda de Concertos
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Acompanhe as próximas apresentações da Banda Sinfônica Nacional no Salão Assyrio do Theatro Municipal do Rio de Janeiro e em grandes palcos do Brasil.
            </p>

            {/* Quick Navigation Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {nextEvent && (
                <a 
                  href="#proximo-concerto"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-transform hover:scale-105 shadow-md flex items-center gap-2"
                >
                  <Ticket className="h-4 w-4" />
                  Próximo Concerto: {nextEventDay} {nextEventMonth}
                </a>
              )}
              {otherUpcomingEvents.length > 0 && (
                <a 
                  href="#eventos-futuros"
                  className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-bold transition-all hover:bg-muted"
                >
                  Concertos Futuros ({otherUpcomingEvents.length})
                </a>
              )}
              <a 
                href="#historico"
                className="px-4 py-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition-all hover:bg-muted"
              >
                Histórico ({pastEvents.length})
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 md:py-16 flex-grow">
        
        {/* Featured Upcoming Event */}
        <section id="proximo-concerto" className="mb-24 scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 bg-primary rounded-full" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Próximo Concerto</h2>
            </div>
          </div>

          {nextEvent ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-primary/30 group transform-gpu transition-all hover:border-primary hover:shadow-primary/20">
              <div className="flex flex-col lg:flex-row">
                
                {/* Image Area */}
                <div className="w-full lg:w-5/12 relative min-h-[360px] lg:min-h-full overflow-hidden bg-[#080a08]">
                  {nextEventImage ? (
                    <>
                      {/* Ambient blurred background */}
                      <Image 
                        src={nextEventImage.imageUrl} 
                        alt="" 
                        fill 
                        aria-hidden="true"
                        className="object-cover blur-2xl scale-125 opacity-40 brightness-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                      
                      {/* Full uncropped flyer foreground */}
                      <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <Image 
                          src={nextEventImage.imageUrl} 
                          alt={nextEvent.title} 
                          fill 
                          priority
                          className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                      <Music className="h-24 w-24 text-white opacity-20" />
                    </div>
                  )}

                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-primary/20 text-center z-10">
                    <div className="text-primary font-black text-3xl leading-none">{nextEventDay}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{nextEventMonth}</div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="w-full lg:w-7/12 px-8 py-8 md:px-12 md:py-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Confirmado
                      </span>
                      {(nextEvent as any).ticketUrl && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-widest">
                          <Ticket className="h-3.5 w-3.5" />
                          Ingressos Abertos
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-headline text-3xl md:text-4xl font-bold mb-4 leading-tight text-foreground">
                      {nextEvent.title}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                      {nextEvent.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-border/40">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Data</div>
                          <div className="font-bold text-foreground">{nextEvent.date}</div>
                        </div>
                      </div>
                      {nextEvent.time && (
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Horário</div>
                            <div className="font-bold text-foreground">{nextEvent.time}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Local</div>
                          <div className="font-medium text-foreground">{nextEvent.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex flex-wrap items-center gap-4">
                    {(nextEvent as any).ticketUrl ? (
                      <Button asChild size="lg" className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black shadow-xl gap-2 rounded-xl group/btn text-base px-8 py-6">
                        <a href={(nextEvent as any).ticketUrl} target="_blank" rel="noopener noreferrer">
                          <Ticket className="h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                          Garantir Ingresso (Fever)
                          <ExternalLink className="h-4 w-4 opacity-70" />
                        </a>
                      </Button>
                    ) : (
                      <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        Entrada Gratuita ou Informações no Local
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-card/50 rounded-2xl border border-dashed border-border">
              <Calendar className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Nenhum evento agendado no momento</h3>
              <p className="text-muted-foreground max-w-md">
                Estamos preparando a nova temporada de apresentações da Banda Sinfônica Nacional. Fique ligado em nosso site!
              </p>
            </div>
          )}
        </section>

        {/* Other Upcoming Events Grid */}
        {otherUpcomingEvents.length > 0 && (
          <section id="eventos-futuros" className="mb-24 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-2 bg-primary/60 rounded-full" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Concertos Futuros</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherUpcomingEvents.map((event, index) => {
                const imgAsset = event.imageId ? ImageAssets.find(img => img.id === event.imageId) : null;
                return (
                  <Card key={index} className="bg-card border-primary/20 shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col h-full group overflow-hidden rounded-2xl">
                    {imgAsset && (
                      <div className="relative w-full h-56 overflow-hidden shrink-0 bg-[#0a080c] border-b border-border/30">
                        {/* Ambient blurred background */}
                        <Image
                          src={imgAsset.imageUrl}
                          alt=""
                          fill
                          aria-hidden="true"
                          className="object-cover blur-2xl scale-125 opacity-40 brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-black/20 to-black/30" />
                        
                        {/* Adapted uncropped artwork foreground */}
                        <div className="relative w-full h-full p-2.5 flex items-center justify-center">
                          <Image
                            src={imgAsset.imageUrl}
                            alt={event.title}
                            fill
                            className="object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                        {event.time && <span className="ml-1 px-2 py-0.5 bg-primary/10 rounded-md">{event.time}</span>}
                      </div>
                      <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4 pb-6 border-t border-border/30 mt-auto flex flex-col items-start gap-3">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                      {(event as any).ticketUrl && (
                        <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-xl mt-2">
                          <a href={(event as any).ticketUrl} target="_blank" rel="noopener noreferrer">
                            <Ticket className="h-4 w-4" />
                            Comprar Ingresso
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Past Events Grid */}
        <section id="historico" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 bg-muted-foreground/40 rounded-full" />
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Concertos Anteriores</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => {
              const imgAsset = event.imageId ? ImageAssets.find(img => img.id === event.imageId) : null;
              return (
                <Card key={index} className="bg-card/70 border-border/40 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col h-full group overflow-hidden rounded-2xl">
                  {imgAsset && (
                    <div className="relative w-full h-52 overflow-hidden shrink-0 bg-[#0a080c] border-b border-border/30">
                      {/* Ambient blurred background */}
                      <Image
                        src={imgAsset.imageUrl}
                        alt=""
                        fill
                        aria-hidden="true"
                        className="object-cover blur-2xl scale-125 opacity-40 brightness-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-black/20 to-black/30" />
                      
                      {/* Adapted uncropped artwork foreground */}
                      <div className="relative w-full h-full p-2.5 flex items-center justify-center">
                        <Image
                          src={imgAsset.imageUrl}
                          alt={event.title}
                          fill
                          className="object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date}
                    </div>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 pb-6 border-t border-border/30 mt-auto">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/70 mt-0.5" />
                      <span className="line-clamp-2">{event.location}</span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
